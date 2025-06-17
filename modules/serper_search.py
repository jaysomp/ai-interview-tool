import http.client
import json
import os
from dotenv import load_dotenv
load_dotenv()  
SERPER_API_KEY = os.getenv("SERPER_API_KEY")

def serper_search(company_name: str, job_title: str) -> list[str]:
    if not SERPER_API_KEY:
        raise ValueError("SERPER_API_KEY environment variable is not set.")
    conn = http.client.HTTPSConnection("google.serper.dev")
    payload = json.dumps({
        "q": f"interview questions for {job_title} role {company_name}"
    })
    headers = {
        'X-API-KEY': SERPER_API_KEY,
        'Content-Type': 'application/json'
    }
    try:
        conn.request("POST", "/search", payload, headers)
        res = conn.getresponse()
        if res.status != 200:
            raise Exception(f"Serper API error: {res.status} {res.reason}")
        data = res.read()
        json_data = json.loads(data.decode("utf-8"))
        # Extract snippets or titles from organic results
        results = json_data.get("organic", [])
        questions = []
        for item in results:
            # Prefer snippet, fallback to title
            snippet = item.get("snippet")
            if snippet:
                questions.append(snippet)
            elif "title" in item:
                questions.append(item["title"])
        return questions
    except Exception as e:
        print(f"Error during Serper search: {e}")
        return []