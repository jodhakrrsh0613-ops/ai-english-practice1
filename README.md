# AI English Practice Agent

A modern, responsive web application that helps users improve their English speaking and grammar skills by chatting with an AI agent.

## Features

- **Modern Chat Interface**: WhatsApp-like UI built with React and Vanilla CSS (Glassmorphism).
- **AI English Tutor**: Powered by Gemini API to act as a friendly tutor.
- **Real-Time Grammar Correction**: The AI detects mistakes and provides corrections and explanations.
- **Hindi Support**: If you type in Hindi, the AI provides an explanation in Hindi before switching back to English.
- **Voice Integration**:
  - *Speech-to-Text*: Speak to the AI using your microphone.
  - *Text-to-Speech*: Listen to the AI's replies by clicking the speaker icon.
- **Progress Tracking**: End the chat session to get customized feedback on your strengths, areas to improve, and suggestions.
- **Local Storage**: All chat history is saved in a local SQLite database.

## Prerequisites

- Node.js (v18+)
- A [Google Gemini API Key](https://aistudio.google.com/)

## Installation & Setup

1. **Clone the repository** (or navigate to the project directory):
   ```bash
   cd ai-english-practice
   ```

2. **Setup the Backend**:
   ```bash
   cd server
   npm install
   ```
   Open `server/.env` and add your Gemini API Key:
   ```env
   PORT=3000
   GEMINI_API_KEY=your_actual_api_key_here
   ```

3. **Setup the Frontend**:
   ```bash
   cd ../client
   npm install
   ```

## Running the Application

You will need two terminal windows to run both the frontend and backend.

**Terminal 1 (Backend)**:
```bash
cd ai-english-practice/server
node index.js
```
*The backend will run on http://localhost:3000*

**Terminal 2 (Frontend)**:
```bash
cd ai-english-practice/client
npm run dev
```
*The frontend will run on http://localhost:5173*

## Usage

1. Open your browser to the Frontend URL.
2. The AI will start the conversation. You can type your response or click the microphone to speak.
3. If you make a grammatical mistake, watch for the correction box below the AI's message.
4. Click the speaker icon to hear the AI speak.
5. Click **End Chat** when you are done to view your session feedback.
