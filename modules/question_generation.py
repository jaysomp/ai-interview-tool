import os
from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv()  
client = genai.Client() 

def generate_interview_questions(job_title: str, job_description: str, num_questions: int = 5) -> list[str]:
    """
    Generate a list of interview questions tailored to a job title and description using Gemini API.

    Args:
        job_title: e.g. "Software Engineer"
        job_description: e.g. "Develop scalable web services in Python and Kubernetes..."
        num_questions: number of questions to generate (default: 5)

    Returns:
        A list of generated interview question strings.
    """
    # Use system instruction to improve output style
    system_instr = "You are an expert hiring manager crafting thoughtful interview questions."
    prompt_text = (
        f"Job Title: {job_title}\n"
        f"Job Description: {job_description}\n\n"
        f"Please write {num_questions} tailored interview questions."
        "\n\n"
        "Format the output as a list of questions, with each question on a new line."
        "\n\n"
        "Please dont include any additional text or formatting."
    )

    response = client.models.generate_content(
        model="gemini-1.5-flash",
        config=types.GenerateContentConfig(system_instruction=system_instr),
        contents=[prompt_text]
    )
    text = response.text.strip()
    # split lines and clean numbering/bullets
    questions = [
        line.strip().lstrip("0123456789.)-  ").strip()
        for line in text.splitlines()
        if line.strip()
    ]
    return questions

