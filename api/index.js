import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { handleChat, getFeedback, checkGrammar, getVocabulary, translateText, rewriteSentence, evaluateWriting, generateQuiz, generateEmail, evaluatePronunciation, generateResume } from './services/ai.service.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post('/api/chat', async (req, res) => {
  try {
    const { message, history } = req.body;
    const clientApiKey = req.headers['x-api-key'];
    
    const response = await handleChat(message, history || [], clientApiKey);
    res.json(response);
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to process chat' });
  }
});

app.post('/api/feedback', async (req, res) => {
  try {
    const { history } = req.body;
    const clientApiKey = req.headers['x-api-key'];
    
    const feedback = await getFeedback(history || [], clientApiKey);
    res.json(feedback);
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate feedback' });
  }
});

app.post('/api/grammar', async (req, res) => {
  try {
    const { text } = req.body;
    const clientApiKey = req.headers['x-api-key'];
    const result = await checkGrammar(text, clientApiKey);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to check grammar' });
  }
});

app.get('/api/vocabulary', async (req, res) => {
  try {
    const clientApiKey = req.headers['x-api-key'];
    const result = await getVocabulary(clientApiKey);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch vocabulary' });
  }
});

// Export the Express API for Vercel
export default app;

// ───── NEW FEATURE ROUTES ─────

app.post('/api/translate', async (req, res) => {
  try {
    const { text, direction } = req.body;
    const clientApiKey = req.headers['x-api-key'];
    if (!text || !text.trim()) return res.status(400).json({ error: 'Text is required' });
    const result = await translateText(text, direction || 'en-hi', clientApiKey);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Translation failed' });
  }
});

app.post('/api/rewrite', async (req, res) => {
  try {
    const { text, mode } = req.body;
    const clientApiKey = req.headers['x-api-key'];
    if (!text || !text.trim()) return res.status(400).json({ error: 'Text is required' });
    const result = await rewriteSentence(text, mode || 'formal', clientApiKey);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Rewrite failed' });
  }
});

app.post('/api/evaluate-writing', async (req, res) => {
  try {
    const { text } = req.body;
    const clientApiKey = req.headers['x-api-key'];
    if (!text || !text.trim()) return res.status(400).json({ error: 'Text is required' });
    const result = await evaluateWriting(text, clientApiKey);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Writing evaluation failed' });
  }
});

app.post('/api/quiz', async (req, res) => {
  try {
    const { topic, difficulty } = req.body;
    const clientApiKey = req.headers['x-api-key'];
    if (!topic) return res.status(400).json({ error: 'Topic is required' });
    const result = await generateQuiz(topic, difficulty || 'medium', clientApiKey);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Quiz generation failed' });
  }
});

app.post('/api/generate-email', async (req, res) => {
  try {
    const { type, details } = req.body;
    const clientApiKey = req.headers['x-api-key'];
    if (!type) return res.status(400).json({ error: 'Email type is required' });
    const result = await generateEmail(type, details || {}, clientApiKey);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Email generation failed' });
  }
});

app.post('/api/pronunciation', async (req, res) => {
  try {
    const { spokenText, targetText } = req.body;
    const clientApiKey = req.headers['x-api-key'];
    if (!spokenText || !targetText) return res.status(400).json({ error: 'Both spokenText and targetText are required' });
    const result = await evaluatePronunciation(spokenText, targetText, clientApiKey);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Pronunciation evaluation failed' });
  }
});

app.post('/api/resume', async (req, res) => {
  try {
    const { details } = req.body;
    const clientApiKey = req.headers['x-api-key'];
    if (!details) return res.status(400).json({ error: 'Resume details are required' });
    const result = await generateResume(details, clientApiKey);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Resume generation failed' });
  }
});

if (process.env.NODE_ENV !== 'production' || process.env.PORT) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
