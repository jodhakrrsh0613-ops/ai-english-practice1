const { GoogleGenAI } = require('@google/genai');

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

async function handleChat(message, history, clientApiKey) {
  try {
    const apiKey = clientApiKey || process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      return {
        reply: "Please enter your valid Google Gemini API Key in the settings to start chatting.",
        correction: null,
        explanation: null
      };
    }
    const ai = new GoogleGenAI({ apiKey });

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

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
            { role: 'user', parts: [{ text: SYSTEM_PROMPT }] },
            { role: 'model', parts: [{ text: '{"reply": "Understood. I will strictly follow these rules and respond in JSON.", "correction": null, "explanation": null}' }] },
            ...formattedHistory,
            { role: 'user', parts: [{ text: message }] }
        ],
        config: {
            responseMimeType: "application/json",
            temperature: 0.7,
        }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("AI Service Error:", error);
    return {
      reply: "I'm sorry, I am having trouble connecting right now. Please make sure your API key is correct.",
      correction: null,
      explanation: null
    };
  }
}

async function getFeedback(history, clientApiKey) {
    const apiKey = clientApiKey || process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
        return { strengths: [], mistakes: [], suggestions: ["Please configure your API key."] };
    }
    const ai = new GoogleGenAI({ apiKey });

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
        try { textContent = JSON.parse(h.content).reply; } catch(e) {}
    }
    return `${h.role}: ${textContent}`;
}).join('\n')}
`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            config: {
                responseMimeType: "application/json",
            }
        });
        return JSON.parse(response.text);
    } catch (err) {
        console.error("Feedback error", err);
        return { strengths: [], mistakes: [], suggestions: ["Keep practicing! API Key error."] };
    }
}

module.exports = { handleChat, getFeedback };
