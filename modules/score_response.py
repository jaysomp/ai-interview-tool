import os
from dotenv import load_dotenv
from google import genai
from google.genai import types
import re

load_dotenv()  
client = genai.Client() 

def score_response(job_title: str, question: str, response: str) -> tuple[float, str]:
    """
    Score a response to an interview question using Gemini API.

    Args:
        job_title: The job title of the interview.
        question: The interview question to score.
        response: The response to score.

    Returns:
        A tuple (score, reasoning_text):
            - score: A float score between 0 and 10.
            - reasoning_text: The reasoning/explanation from Gemini.
    """
    # Use system instruction to improve output style
    system_instr = "You are an expert hiring manager crafting thoughtful interview questions."
    prompt_text = (
        f"Job Title: {job_title}\n"
        f"Question: {question}\n"
        f"Response: {response}\n\n"
        "Please score the response on a scale of 0 to 10."
        "\n\n"
        "In your answer, start with the score in the format: Score: X/10. Then, provide concise reasoning (50-100 words) on why you scored it that way. Do not include any other text or formatting."
        "\n\n"
        "Keep in mind that the responses are being spoken so the transcipt grammer and spelling may not be perfect. Do your best to understand Key words that would be associated with the job title and description. So somewords may be misspelled or may evenm fully be whole other words but try to understand the words (no need to correct it in the response)"
        "\n\n"
        "Also, Keep in mind the experience level of the candidate. Such as Junior, Senior, Mid-level, Entry-level, etc."
    )

    response = client.models.generate_content(
        model="gemini-1.5-flash",
        config=types.GenerateContentConfig(system_instruction=system_instr),
        contents=[prompt_text]
    )
    text = response.text.strip()

    # Extract the score using regex (looks for e.g. 'Score: 7.5' or '7/10' or similar)
    score_match = re.search(r"([0-9]+(?:\.[0-9]+)?)\s*(?:/\s*10|out of 10|points|score)?", text, re.IGNORECASE)
    if score_match:
        score = float(score_match.group(1))
    else:
        score = None  # or raise an error if you want

    # Optionally, you could clean the reasoning text if the score is embedded
    return score, text