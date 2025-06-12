# AI Interview Frontend

This is a React-based frontend for your AI Interview backend.

## Features
- Start a new interview session
- Generate and display questions
- Record and transcribe answers using your microphone
- Score answers and display feedback

## Setup & Run

1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```
2. **Start the frontend:**
   ```bash
   npm start
   ```
   This will run the app at [http://localhost:3000](http://localhost:3000)

3. **Backend:**
   Make sure your FastAPI backend is running at `http://localhost:8000` (the default).

## Notes
- This project uses the browser's built-in speech recognition (Web Speech API). For best results, use Chrome.
- The UI uses Material-UI for a modern look.
