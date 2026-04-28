const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config();

const sqlite3 = require('sqlite3').verbose();
const { handleChat, getFeedback } = require('./services/ai.service');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../client/dist')));

// Initialize SQLite Database
const db = new sqlite3.Database('./database.sqlite', (err) => {
  if (err) {
    console.error('Database opening error: ', err);
  } else {
    db.run(`CREATE TABLE IF NOT EXISTS chat_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sessionId TEXT,
      role TEXT,
      content TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
  }
});

app.post('/api/chat', async (req, res) => {
  try {
    const { message, sessionId } = req.body;
    const clientApiKey = req.headers['x-api-key'];
    
    // Save user message
    db.run('INSERT INTO chat_history (sessionId, role, content) VALUES (?, ?, ?)', [sessionId, 'user', message]);
    
    // Retrieve previous history for context
    db.all('SELECT role, content FROM chat_history WHERE sessionId = ? ORDER BY timestamp ASC', [sessionId], async (err, history) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      
      const response = await handleChat(message, history, clientApiKey);
      
      // Save AI message
      db.run('INSERT INTO chat_history (sessionId, role, content) VALUES (?, ?, ?)', [sessionId, 'model', JSON.stringify(response)]);
      
      res.json(response);
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to process chat' });
  }
});

app.post('/api/feedback', async (req, res) => {
  try {
    const { sessionId } = req.body;
    const clientApiKey = req.headers['x-api-key'];
    db.all('SELECT role, content FROM chat_history WHERE sessionId = ? ORDER BY timestamp ASC', [sessionId], async (err, history) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      const feedback = await getFeedback(history, clientApiKey);
      res.json(feedback);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate feedback' });
  }
});

// Catch-all route for React
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
