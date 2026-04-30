const SYSTEM_PROMPT = `You are an English speaking practice assistant. You talk to users in simple English, correct their mistakes, explain briefly, and ask engaging questions to improve their speaking skills.

Rules:
1. Act as a friendly English tutor. Start conversations naturally if no prior context exists.
2. Ask one simple question at a time to keep the conversation flowing. Ask about their day, hobbies, goals, opinions, etc.
3. If the user makes a grammar mistake, provide the corrected sentence and a short explanation, then continue the conversation.
4. If the user types in Hindi, give a short explanation or translation in Hindi, then switch back to English conversation.
5. Your response MUST be a valid JSON object with the following structure:
{
  "reply": "Your conversational response here. This is the main part of the message.",
  "correction": "Corrected sentence if there was a mistake, or null",
  "explanation": "Brief explanation of the mistake or translation if Hindi was used, or null"
}`;

async function callGroq(apiKey, contents) {
  const url = "https://api.groq.com/openai/v1/chat/completions";
  
  // Convert Gemini history format to OpenAI/Groq format
  const messages = contents.map(c => ({
    role: c.role === 'model' ? 'assistant' : 'user',
    content: Array.isArray(c.parts) ? c.parts[0].text : c.parts
  }));

  const body = {
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages
    ],
    response_format: { type: "json_object" },
    temperature: 0.7
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Groq Error: ${error.error?.message || "API error"}`);
  }

  const data = await response.json();
  const text = data.choices[0].message.content;
  // Clean JSON response (sometimes AI adds markdown code blocks)
  return text.replace(/```json/g, '').replace(/```/g, '').trim();
}

// Groq ke liye dedicated function - bina chat SYSTEM_PROMPT ke (grammar/vocab ke liye)
async function callGroqDirect(apiKey, systemInstruction, userMessage, temperature = 0.5) {
  const url = "https://api.groq.com/openai/v1/chat/completions";

  const body = {
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: systemInstruction },
      { role: "user", content: userMessage }
    ],
    response_format: { type: "json_object" },
    temperature: temperature
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Groq Error: ${error.error?.message || "API error"}`);
  }

  const data = await response.json();
  const text = data.choices[0].message.content;
  return text.replace(/```json/g, '').replace(/```/g, '').trim();
}

async function callGemini(apiKey, contents) {
  const modelName = "gemini-flash-latest";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
  
  const body = {
    contents: contents,
    generationConfig: { temperature: 0.7 }
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Gemini Error: ${errorData.error?.message || "Connection failed"}`);
  }

  const data = await response.json();
  const text = data.candidates[0].content.parts[0].text;
  return text.replace(/```json/g, '').replace(/```/g, '').trim();
}

export async function handleChat(message, history, clientApiKey) {
  try {
    const groqKey = process.env.GROQ_API_KEY;
    const geminiKey = clientApiKey || process.env.GEMINI_API_KEY;

    let resultText;
    // Prefer Groq if available
    if (groqKey && groqKey !== 'your_groq_api_key_here') {
      const contents = [
        ...history.map(h => ({ role: h.role, parts: h.content })),
        { role: 'user', parts: message }
      ];
      resultText = await callGroq(groqKey, contents);
    } else {
      const formattedHistory = history.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      }));
      const contents = [
        ...formattedHistory,
        { role: 'user', parts: [{ text: "SYSTEM INSTRUCTION: " + SYSTEM_PROMPT }] },
        { role: 'user', parts: [{ text: message }] }
      ];
      resultText = await callGemini(geminiKey, contents);
    }

    return JSON.parse(resultText);
  } catch (error) {
    console.error("AI Service Error:", error);
    return {
      reply: `Error: ${error.message}. Please check your API keys.`,
      correction: null,
      explanation: null
    };
  }
}

export async function getFeedback(history, clientApiKey) {
  try {
    const groqKey = process.env.GROQ_API_KEY;
    const prompt = `Analyze the conversation and provide feedback in JSON format: { "strengths": [], "mistakes": [], "suggestions": [] }. History: ${JSON.stringify(history)}`;
    
    let resultText;
    if (groqKey) {
      resultText = await callGroq(groqKey, [{ role: 'user', parts: prompt }]);
    } else {
      resultText = await callGemini(clientApiKey || process.env.GEMINI_API_KEY, [{ role: 'user', parts: [{ text: prompt }] }]);
    }
    return JSON.parse(resultText);
  } catch (err) {
    return { strengths: [], mistakes: [], suggestions: [`Error: ${err.message}`] };
  }
}

export async function checkGrammar(text, clientApiKey) {
  try {
    const groqKey = process.env.GROQ_API_KEY;
    
    const systemInstruction = `You are a professional English grammar checker. Your ONLY job is to analyze the given text and return a JSON object with EXACTLY this structure:
{
  "corrected": "the fully corrected version of the sentence",
  "corrections": [
    { "wrong": "the wrong word or phrase", "correct": "the correct version", "explanation": "brief reason why" }
  ]
}
If the text is already correct, return the original text as "corrected" and an empty "corrections" array. Return ONLY the JSON, nothing else.`;

    const userMessage = `Check this text for grammar mistakes: "${text}"`;

    let resultText;
    if (groqKey && groqKey !== 'your_groq_api_key_here') {
      resultText = await callGroqDirect(groqKey, systemInstruction, userMessage);
    } else {
      const geminiPrompt = `${systemInstruction}\n\n${userMessage}`;
      resultText = await callGemini(clientApiKey || process.env.GEMINI_API_KEY, [{ role: 'user', parts: [{ text: geminiPrompt }] }]);
    }

    const parsed = JSON.parse(resultText);

    // Validate the response structure
    if (!parsed.corrected) {
      throw new Error('Invalid grammar response format from AI');
    }

    return {
      corrected: parsed.corrected,
      corrections: Array.isArray(parsed.corrections) ? parsed.corrections : []
    };
  } catch (err) {
    console.error('Grammar check failed:', err.message);
    return { corrected: text, corrections: [], error: `Error: ${err.message}` };
  }
}

export async function getVocabulary(clientApiKey) {
  try {
    const groqKey = process.env.GROQ_API_KEY;

    // Har call pe random category — AI ko force karta hai different words dene ke liye
    const categories = [
      'emotions and feelings',
      'daily routines and habits',
      'work and office life',
      'home and family',
      'food and eating',
      'health and body',
      'time and planning',
      'friendship and relationships',
      'travel and commute',
      'shopping and money',
      'school and learning',
      'weather and nature',
    ];
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    const randomSeed = Math.floor(Math.random() * 100000); // uniqueness ke liye

    const systemInstruction = `You are a friendly vocabulary teacher for beginners. Return ONLY a JSON object with this exact structure:
{
  "words": [
    { "word": "example", "type": "noun", "meaning": "a brief definition", "example": "A sentence using the word." }
  ]
}
Provide exactly 5 DIFFERENT simple, everyday English words each time. Focus on the topic: "${randomCategory}". Avoid rare, advanced, or academic words. Every set must be unique and fresh — never repeat the same words. No extra text, just the JSON.`;

    const userMessage = `[Request #${randomSeed}] Give me 5 fresh, different everyday English vocabulary words about "${randomCategory}" (easy to medium level). Each word must have its type, a simple meaning, and a realistic example sentence from daily life. Do NOT repeat common words like happy, sad, eat, sleep etc.`;

    let resultText;
    if (groqKey && groqKey !== 'your_groq_api_key_here') {
      // temperature 0.95 — har baar naye words milenge
      resultText = await callGroqDirect(groqKey, systemInstruction, userMessage, 0.95);
      const parsed = JSON.parse(resultText);
      const wordsArray = Array.isArray(parsed) ? parsed : (parsed.words || parsed.vocabulary || parsed.data || []);
      if (!Array.isArray(wordsArray) || wordsArray.length === 0) {
        throw new Error('No vocabulary words returned from AI');
      }
      return wordsArray;
    } else {
      const geminiPrompt = `[Request #${randomSeed}] Provide 5 fresh, different everyday English vocabulary words about "${randomCategory}" (not advanced or rare) as a raw JSON array: [{ "word": "", "type": "", "meaning": "", "example": "" }]. Every call must return a unique, different set of words.`;
      resultText = await callGemini(clientApiKey || process.env.GEMINI_API_KEY, [{ role: 'user', parts: [{ text: geminiPrompt }] }]);
      const parsed = JSON.parse(resultText);
      return Array.isArray(parsed) ? parsed : (parsed.words || parsed.vocabulary || []);
    }
  } catch (err) {
    console.error('Vocabulary fetch failed:', err.message);
    return [{ word: "Error", type: "error", meaning: err.message, example: "Please check your API key and try again." }];
  }
}
