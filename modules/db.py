import sqlite3
from contextlib import contextmanager

DB_PATH = "interview.db"

@contextmanager
def get_connection():
    conn = sqlite3.connect(DB_PATH)
    try:
        yield conn
    finally:
        conn.close()

def init_db():
    with get_connection() as conn:
        c = conn.cursor()
        # Interview Sessions
        c.execute("""
            CREATE TABLE IF NOT EXISTS interview_sessions (
                interview_id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                job_title TEXT NOT NULL,
                job_description TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        # Generated Questions
        c.execute("""
            CREATE TABLE IF NOT EXISTS generated_questions (
                question_id INTEGER PRIMARY KEY AUTOINCREMENT,
                question_text TEXT NOT NULL,
                interview_id INTEGER NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (interview_id) REFERENCES interview_sessions(interview_id)
            )
        """)
        # Scores
        c.execute("""
            CREATE TABLE IF NOT EXISTS scores (
                score_id INTEGER PRIMARY KEY AUTOINCREMENT,
                interview_id INTEGER NOT NULL,
                question_id INTEGER NOT NULL,
                score REAL NOT NULL,
                reasoning TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (interview_id) REFERENCES interview_sessions(interview_id),
                FOREIGN KEY (question_id) REFERENCES generated_questions(question_id)
            )
        """)
        conn.commit()

def create_interview_session(name, job_title, job_description):
    with get_connection() as conn:
        c = conn.cursor()
        c.execute(
            "INSERT INTO interview_sessions (name, job_title, job_description) VALUES (?, ?, ?)",
            (name, job_title, job_description)
        )
        conn.commit()
        return c.lastrowid

def add_generated_questions(interview_id, questions):
    with get_connection() as conn:
        c = conn.cursor()
        for q in questions:
            c.execute(
                "INSERT INTO generated_questions (question_text, interview_id) VALUES (?, ?)",
                (q, interview_id)
            )
        conn.commit()
        # Return all question_ids for the inserted questions
        c.execute(
            "SELECT question_id, question_text FROM generated_questions WHERE interview_id = ?",
            (interview_id,)
        )
        return c.fetchall()

def add_score(interview_id, question_id, score, reasoning):
    with get_connection() as conn:
        c = conn.cursor()
        c.execute(
            "INSERT INTO scores (interview_id, question_id, score, reasoning) VALUES (?, ?, ?, ?)",
            (interview_id, question_id, score, reasoning)
        )
        conn.commit()
        return c.lastrowid

def get_interview_by_id(interview_id):
    with get_connection() as conn:
        c = conn.cursor()
        c.execute(
            "SELECT job_title, job_description FROM interview_sessions WHERE interview_id = ?",
            (interview_id,)
        )
        row = c.fetchone()
        if row:
            return {"job_title": row[0], "job_description": row[1]}
        return None

def get_question_by_id(question_id):
    with get_connection() as conn:
        c = conn.cursor()
        c.execute(
            "SELECT question_text, interview_id FROM generated_questions WHERE question_id = ?",
            (question_id,)
        )
        row = c.fetchone()
        if row:
            return {"question_text": row[0], "interview_id": row[1]}
        return None
