# AI Interview Local

This project is a local interview preparation tool that generates interview questions and scores your responses using AI. It includes a FastAPI backend and a React frontend.

> **Note:** The backend was written by me (the project owner). The frontend was generated entirely by AI, as I'm not a frontend expert.

## Features
- Generate interview questions based on job title and description
- Score your responses with AI
- Stores interview sessions and scores locally

## Tech Stack
- **Backend:** FastAPI (Python)
- **Frontend:** React (JavaScript)
- **Database:** SQLite (local file: `interview.db`)
- **AI Model:** Google Gemini API (via `google-genai` Python SDK)
- **Environment/Secrets:** dotenv (`.env` files)

## Project Structure
- `main.py`: FastAPI backend API
- `modules/`: Contains logic for question generation, scoring, and DB
- `frontend/`: React frontend (see below for running instructions)
- `.env`, `modules/.env`: Store secrets and config (not tracked by git)
- `interview.db`: SQLite database file (auto-created)

## Requirements
- Python 3.8+
- Node.js (for frontend)

## Backend Setup
1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```
2. **Configure secrets:**
   - Add your Gemini API key to `.env` or `modules/.env`:
     ```env
     GEMINI_API_KEY=your_gemini_api_key_here
     ```
   - If you want to use the search functionality (Serper API), add your Serper API key to `.env` or `modules/.env`:
     ```env
     SERPER_API_KEY=your_serper_api_key_here
     ```
   - (You may also need other API keys if using additional features.)
3. **Run the backend:**
   ```bash
   fastapi run main.py
   ```
   The API will be available at `http://localhost:8000`.

## Frontend Setup
1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Run the frontend:**
   ```bash
   npm start
   ```
   The app will be available at `http://localhost:3000`.

## Usage
- Open the frontend in your browser and follow the prompts to generate interview questions and get your answers scored.

## Database Design
The application uses a local SQLite database (`interview.db`) with the following tables:

- **interview_sessions**
  - `interview_id` (INTEGER, PRIMARY KEY)
  - `name` (TEXT)
  - `job_title` (TEXT)
  - `job_description` (TEXT)
  - `created_at` (TIMESTAMP)
- **generated_questions**
  - `question_id` (INTEGER, PRIMARY KEY)
  - `question_text` (TEXT)
  - `interview_id` (INTEGER, FOREIGN KEY → interview_sessions)
  - `created_at` (TIMESTAMP)
- **scores**
  - `score_id` (INTEGER, PRIMARY KEY)
  - `interview_id` (INTEGER, FOREIGN KEY → interview_sessions)
  - `question_id` (INTEGER, FOREIGN KEY → generated_questions)
  - `score` (REAL)
  - `reasoning` (TEXT)
  - `created_at` (TIMESTAMP)

## Clearing the Database

If you want to reset the database and delete all stored interview sessions, questions, and scores, you can use the `clear_db.py` script provided in the project root.

**Usage:**
```bash
python clear_db.py
```

**Warning:** This will permanently delete all interview data from the database (`interview.db`). Use this script only if you are sure you want to clear all data.
## Notes
- Secrets in `.env` files are ignored by git for security.
- Make sure both backend and frontend are running for full functionality.
- Configure your Gemini API key in `.env` or `modules/.env` as described above. This is required for AI-powered question generation and scoring.
- If you want to use the search feature, configure your Serper API key in `.env` or `modules/.env` as described above.

---
If you have any issues, please open an issue or contact the maintainer.
