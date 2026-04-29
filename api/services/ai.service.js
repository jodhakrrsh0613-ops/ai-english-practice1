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

async function callGemini(apiKey, contents, systemInstruction = null) {
  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;
  
  const body = {
    contents: contents,
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.7
    }
  };

  if (systemInstruction) {
    body.systemInstruction = {
      parts: [{ text: systemInstruction }]
    };
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || "Failed to connect to Gemini API");
  }

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}

export async function handleChat(message, history, clientApiKey) {
  try {
    const apiKey = clientApiKey || process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      return { reply: "API Key missing.", correction: null, explanation: null };
    }

    const formattedHistory = history.map(msg => {
      let textContent = msg.content;
      if (msg.role === 'model') {
        try {
          const parsed = JSON.parse(msg.content);
          textContent = JSON.stringify(parsed);
        } catch (e) { }
      }
      return {
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: textContent }]
      };
    });

    const contents = [
      ...formattedHistory,
      { role: 'user', parts: [{ text: message }] }
    ];

    const resultText = await callGemini(apiKey, contents, SYSTEM_PROMPT);
    return JSON.parse(resultText);
  } catch (error) {
    console.error("AI Service Error:", error);
    return {
      reply: `Error: ${error.message}`,
      correction: null,
      explanation: null
    };
  }
}

export async function getFeedback(history, clientApiKey) {
  try {
    const apiKey = clientApiKey || process.env.GEMINI_API_KEY;
    const prompt = `Analyze the conversation and provide feedback in JSON format: { "strengths": [], "mistakes": [], "suggestions": [] }.
    History: ${JSON.stringify(history)}`;

    const resultText = await callGemini(apiKey, [{ role: 'user', parts: [{ text: prompt }] }]);
    return JSON.parse(resultText);
  } catch (err) {
    return { strengths: [], mistakes: [], suggestions: [`Error: ${err.message}`] };
  }
}

export async function checkGrammar(text, clientApiKey) {
  try {
    const apiKey = clientApiKey || process.env.GEMINI_API_KEY;
    const prompt = `Correct this text and explain in JSON: { "corrected": "", "corrections": [{ "wrong": "", "correct": "", "explanation": "" }] }.
    Text: "${text}"`;

    const resultText = await callGemini(apiKey, [{ role: 'user', parts: [{ text: prompt }] }]);
    return JSON.parse(resultText);
  } catch (err) {
    return { corrected: text, corrections: [], explanation: `Error: ${err.message}` };
  }
}

export async function getVocabulary(clientApiKey) {
  try {
    const apiKey = clientApiKey || process.env.GEMINI_API_KEY;
    const prompt = `Provide 5 vocab words in JSON array: [{ "word": "", "type": "", "meaning": "", "example": "" }]`;

    const resultText = await callGemini(apiKey, [{ role: 'user', parts: [{ text: prompt }] }]);
    return JSON.parse(resultText);
  } catch (err) {
    return [{ word: "Error", type: "error", meaning: err.message, example: "" }];
  }
}
