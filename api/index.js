const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const { handleChat, getFeedback, checkGrammar, getVocabulary } = require('./services/ai.service');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post('/api/chat', async (req, res) => {
  try {
    const { message, history } = req.body;
    const clientApiKey = req.headers['x-api-key'];
    
    // Process chat directly without database
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
    
    // Process feedback directly without database
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

// Export the Express API for Vercel Serverless
module.exports = app;

// Listen only if not in Vercel environment (optional but good practice)
if (process.env.NODE_ENV !== 'production' || process.env.PORT) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
