from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from modules.question_generation import generate_interview_questions
from modules.score_response import score_response
from modules.db import init_db, create_interview_session, add_generated_questions, add_score, get_all_interview_history, get_interview_by_id, get_question_by_id, clear_all_tables

app = FastAPI()

# Allow CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    init_db()


# --- Interview Session Endpoint ---
class InterviewRequest(BaseModel):
    name: str
    job_title: str
    job_description: str
    company_name: str = None

class InterviewResponse(BaseModel):
    interview_id: int

@app.post("/interview", response_model=InterviewResponse)
def create_interview(req: InterviewRequest):
    try:
        interview_id = create_interview_session(req.name, req.job_title, req.job_description, req.company_name)
        return {"interview_id": interview_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# --- Generate Questions & Persist ---
class InterviewQuestionsRequest(BaseModel):
    interview_id: int
    num_questions: Optional[int] = 5

class InterviewQuestionsResponse(BaseModel):
    questions: List[dict]  # Each dict: {question_id, question_text}

@app.post("/generate_questions_for_interview", response_model=InterviewQuestionsResponse)
def generate_questions_for_interview(request: InterviewQuestionsRequest):
    try:
        interview = get_interview_by_id(request.interview_id)
        if not interview:
            raise HTTPException(status_code=404, detail="Interview not found")
        questions = generate_interview_questions(
            job_title=interview["job_title"],
            job_description=interview["job_description"],
            company_name=interview.get("company_name", ""),
            num_questions=request.num_questions or 5
        )
        questions_with_ids = add_generated_questions(request.interview_id, questions)
        # Format as list of dicts
        result = [
            {"question_id": qid, "question_text": qtext}
            for (qid, qtext) in questions_with_ids
        ]
        return {"questions": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# --- Score Response Endpoint & Persist ---
class ScoreRequest(BaseModel):
    question_id: int
    response: str

class ScoreResponse(BaseModel):
    score: float | None
    reasoning: str
    score_id: int

@app.post("/score_response", response_model=ScoreResponse)
def score_response_endpoint(request: ScoreRequest):
    try:
        question = get_question_by_id(request.question_id)
        if not question:
            raise HTTPException(status_code=404, detail="Question not found")
        interview = get_interview_by_id(question["interview_id"])
        if not interview:
            raise HTTPException(status_code=404, detail="Interview not found")
        score, reasoning = score_response(
            job_title=interview["job_title"],
            question=question["question_text"],
            response=request.response
        )
        score_id = add_score(question["interview_id"], request.question_id, score, reasoning)
        return {"score": score, "reasoning": reasoning, "score_id": score_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

from fastapi.responses import JSONResponse

@app.get("/interview_history")
def interview_history():
    try:
        interviews = get_all_interview_history()
        return {"interviews": interviews}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/interview_history/{interview_id}")
def interview_detail(interview_id: int):
    try:
        interviews = get_all_interview_history()
        for interview in interviews:
            if interview["interview_id"] == interview_id:
                return {"interview": interview}
        raise HTTPException(status_code=404, detail="Interview not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/clear_history")
def clear_interview_history():
    try:
        clear_all_tables()
        return {"message": "All interview history cleared successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
