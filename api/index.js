import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { handleChat, getFeedback, checkGrammar, getVocabulary } from './services/ai.service.js';

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

if (process.env.NODE_ENV !== 'production' || process.env.PORT) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
