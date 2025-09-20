import re
import textstat
import aiohttp
from bs4 import BeautifulSoup
from fastapi import HTTPException

def analyze_fairness(text: str) -> float:
    """
    Estimate fairness score based on difficult words and legal red flags.
    """
    base_score = 100 - textstat.difficult_words(text) * 1.2
    penalties = len(re.findall(r"(not responsible|subject to change|no liability)", text, re.I)) * 10
    return round(max(min(base_score - penalties, 100), 0), 2)

def extract_pros_cons(text: str):
    """
    Extract pros and cons using simple heuristics.
    """
    pros, cons = [], []
    for line in text.split('\n'):
        l = line.strip().lower()
        if any(p in l for p in ['benefit', 'advantage', 'you get', 'free']):
            pros.append(line)
        elif any(c in l for c in ['risk', 'responsible', 'no refund', 'termination']):
            cons.append(line)
    return pros, cons

async def fetch_text_from_url(url: str) -> str:
    # Increase the buffer size for headers
    connector = aiohttp.TCPConnector(limit=None)
    async with aiohttp.ClientSession(connector=connector, read_bufsize=1024*100) as session:
        try:
            async with session.get(url) as resp:
                html = await resp.text()
                soup = BeautifulSoup(html, "html.parser")
                return soup.get_text(separator="\n", strip=True)
        except aiohttp.ClientResponseError as e:
            # Handle cases where the server still rejects the request
            if "Header value is too long" in str(e):
                raise HTTPException(status_code=400, detail=f"The headers from {url} are too large to process.")
            raise e
