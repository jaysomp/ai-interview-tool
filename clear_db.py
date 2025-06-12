import sqlite3

DB_PATH = "interview.db"

def clear_all_tables():
    with sqlite3.connect(DB_PATH) as conn:
        c = conn.cursor()
        c.execute("DELETE FROM scores;")
        c.execute("DELETE FROM generated_questions;")
        c.execute("DELETE FROM interview_sessions;")
        conn.commit()
        print("All tables cleared.")

if __name__ == "__main__":
    clear_all_tables()
