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
                company_name TEXT,
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

def create_interview_session(name, job_title, job_description, company_name=None):
    with get_connection() as conn:
        c = conn.cursor()
        c.execute(
            "INSERT INTO interview_sessions (name, job_title, job_description, company_name) VALUES (?, ?, ?, ?)",
            (name, job_title, job_description, company_name)
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
            "SELECT job_title, job_description, company_name FROM interview_sessions WHERE interview_id = ?",
            (interview_id,)
        )
        row = c.fetchone()
        if row:
            return {"job_title": row[0], "job_description": row[1], "company_name": row[2]}
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

def clear_all_tables():
    with get_connection() as conn:
        c = conn.cursor()
        c.execute("DELETE FROM scores;")
        c.execute("DELETE FROM generated_questions;")
        c.execute("DELETE FROM interview_sessions;")
        conn.commit()
        print("All tables cleared.")

def get_all_interview_history():
    """
    Returns a list of all interviews with their questions, answers, scores, and reasoning.
    Each interview contains: interview_id, name, job_title, job_description, company_name, created_at, questions (list of dicts)
    Each question contains: question_id, question_text, answer, score, reasoning
    """
    with get_connection() as conn:
        c = conn.cursor()
        c.execute("""
            SELECT interview_id, name, job_title, job_description, company_name, created_at
            FROM interview_sessions
            ORDER BY created_at DESC
        """)
        interviews = c.fetchall()
        result = []
        for interview in interviews:
            interview_id, name, job_title, job_description, company_name, created_at = interview
            # Get questions for this interview
            c.execute("""
                SELECT q.question_id, q.question_text, s.score, s.reasoning, s.rowid, s.score_id
                FROM generated_questions q
                LEFT JOIN scores s ON q.question_id = s.question_id AND s.interview_id = ?
                WHERE q.interview_id = ?
            """, (interview_id, interview_id))
            questions = []
            for q in c.fetchall():
                question_id, question_text, score, reasoning, _, _ = q
                # For extensibility, you could add an 'answer' field if you store answers
                questions.append({
                    'question_id': question_id,
                    'question_text': question_text,
                    'score': score,
                    'reasoning': reasoning,
                    'answer': None  # Placeholder if you add answer storage
                })
            result.append({
                'interview_id': interview_id,
                'name': name,
                'job_title': job_title,
                'job_description': job_description,
                'company_name': company_name,
                'created_at': created_at,
                'questions': questions
            })
        return result