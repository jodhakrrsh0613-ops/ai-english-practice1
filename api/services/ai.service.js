import * as sdk from '@google/generative-ai';

// Defensive way to get the constructor
const GoogleGenAI = sdk.GoogleGenAI || (sdk.default && sdk.default.GoogleGenAI) || sdk.default;

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

export async function handleChat(message, history, clientApiKey) {
  try {
    const apiKey = clientApiKey || process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      return {
        reply: "Please enter your valid Google Gemini API Key in the settings to start chatting.",
        correction: null,
        explanation: null
      };
    }
    
    if (typeof GoogleGenAI !== 'function') {
        throw new Error("AI SDK failed to load correctly. Please redeploy.");
    }

    const genAI = new GoogleGenAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const formattedHistory = history.map(msg => {
      let textContent = msg.content;
      if (msg.role === 'model') {
        try {
          const parsed = JSON.parse(msg.content);
          textContent = JSON.stringify(parsed);
        } catch (e) {
          textContent = msg.content;
        }
      }
      return {
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: textContent }]
      };
    });

    const chatSession = model.startChat({
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.7,
      },
      history: [
        { role: 'user', parts: [{ text: SYSTEM_PROMPT }] },
        { role: 'model', parts: [{ text: '{"reply": "Understood. I will strictly follow these rules and respond in JSON.", "correction": null, "explanation": null}' }] },
        ...formattedHistory
      ],
    });

    const result = await chatSession.sendMessage(message);
    const response = await result.response;
    return JSON.parse(response.text());
  } catch (error) {
    console.error("AI Service Error:", error);
    return {
      reply: `Connection error: ${error.message || 'Unknown error'}. Please check if your API key is active and has enough quota.`,
      correction: null,
      explanation: null
    };
  }
}

export async function getFeedback(history, clientApiKey) {
  try {
    const apiKey = clientApiKey || process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      return { strengths: [], mistakes: [], suggestions: ["Please configure your API key."] };
    }
    const genAI = new GoogleGenAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Analyze the following conversation between a user and an English tutor.
Provide feedback on the user's performance. Focus on their strengths, mistakes, and suggestions for improvement.
Return the response as a JSON object with the structure:
{
  "strengths": ["list", "of", "strengths"],
  "mistakes": ["list", "of", "recurring", "mistakes"],
  "suggestions": ["list", "of", "suggestions"]
}

Conversation History:
${history.map(h => {
    let textContent = h.content;
    if (h.role === 'model') {
      try { textContent = JSON.parse(h.content).reply; } catch (e) { }
    }
    return `${h.role}: ${textContent}`;
  }).join('\n')}
`;

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: "application/json" }
    });
    const response = await result.response;
    return JSON.parse(response.text());
  } catch (err) {
    console.error("Feedback error", err);
    return { strengths: [], mistakes: [], suggestions: [`Feedback generation failed: ${err.message || 'Unknown error'}`] };
  }
}

export async function checkGrammar(text, clientApiKey) {
  try {
    const apiKey = clientApiKey || process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
        return { corrected: text, corrections: [], explanation: "API Key missing." };
    }
    const genAI = new GoogleGenAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Analyze and correct the following English text for grammar, punctuation, and style.
Return the result as a JSON object with the structure:
{
  "corrected": "The full corrected text",
  "corrections": [
    {
      "wrong": "word or phrase",
      "correct": "corrected word or phrase",
      "explanation": "why it was wrong"
    }
  ]
}

Text to check:
"${text}"`;

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.2,
      }
    });
    const response = await result.response;
    return JSON.parse(response.text());
  } catch (err) {
    console.error("Grammar check error", err);
    return { corrected: text, corrections: [], explanation: `Grammar check failed: ${err.message || 'Unknown error'}` };
  }
}

export async function getVocabulary(clientApiKey) {
  try {
    const apiKey = clientApiKey || process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
        return [];
    }
    const genAI = new GoogleGenAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Provide 5 advanced or useful English vocabulary words for a language learner.
For each word, provide:
1. The word itself
2. Part of speech (noun, verb, adj, etc.)
3. A simple meaning
4. A clear example sentence

Return the result as a JSON array of objects:
[
  { "word": "word", "type": "noun", "meaning": "meaning", "example": "example" }
]`;

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 1,
      }
    });
    const response = await result.response;
    return JSON.parse(response.text());
  } catch (err) {
    console.error("Vocab error", err);
    return [{ word: "Error", type: "error", meaning: `Could not fetch vocabulary: ${err.message || 'Unknown error'}`, example: "" }];
  }
}
