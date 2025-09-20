import os
import re
import logging
from dotenv import load_dotenv
import google.generativeai as genai
from fastapi import HTTPException
from models.schema import AnalyzeResponse
from utils.helpers import analyze_fairness, extract_pros_cons

load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

gemini_api_key = os.getenv("GEMINI_API_KEY")
if not gemini_api_key:
    logger.error("GEMINI_API_KEY not found in .env file")
    # Depending on the desired behavior, you might want to exit or handle this case
    # For now, we'll let it fail downstream when genai.configure is called.
else:
    genai.configure(api_key=gemini_api_key)

async def analyze_text_chunk(text_chunk: str, model_name: str) -> dict:
    try:
        model = genai.GenerativeModel(model_name)
    except Exception as e:
        logger.error(f"Failed to initialize model {model_name}: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to initialize AI model. Error: {e}")
    prompt = f"""
You are a digital agreement evaluator for user protection.

The user has provided a chunk of a larger Terms & Conditions document. Analyze this chunk to help the user understand the fairness of what they are agreeing to.

Perform the following analysis on this chunk:

1. **Summarize** the core themes and structure of this chunk.
2. For each major clause, rate it using this fairness scale:
   - **1.0 (Fair):** Transparent, balanced, respects user rights
   - **0.5 (Questionable):** Vague, potentially unfair, or dependent on context
   - **0.0 (Unfair):** Clearly one-sided, restrictive, or harmful to the user
3. **List and explain all clauses rated 0.0 or 0.5**.
4. **Suggest how each unfair or questionable clause could be rewritten** to improve fairness.
5. **Identify major Pros and Cons** for the user in this chunk.

Format your output clearly using the following structure with markdown formatting.

- **Summary**
- **Pros**
- **Cons**
- **Unfair or Questionable Clauses**
- **Suggestions for Improvement**

Here is the input chunk:
{text_chunk}
"""
    response = model.generate_content(prompt)
    output = response.text
    score_match = re.search(r"Fairness Score:\s*(\d+)%?", output, re.I)
    score = int(score_match.group(1)) if score_match else analyze_fairness(text_chunk)
    summary = re.sub(r"Fairness Score:\s*(\d+)%?", "", output, flags=re.I).strip()
    pros, cons = extract_pros_cons(output)
    return {"summary": summary, "score": score, "pros": pros, "cons": cons}

async def analyze_with_fallback(prompt: str, text_for_fairness: str):
    model_names = ["gemini-2.5-pro", "gemini-1.5-pro"]
    last_exception = None
    for model_name in model_names:
        try:
            model = genai.GenerativeModel(model_name)
            response = model.generate_content(prompt)
            output = response.text
            
            score_match = re.search(r"Fairness Score:\s*(\d+)%?", output, re.I)
            score = int(score_match.group(1)) if score_match else analyze_fairness(text_for_fairness)
            summary = re.sub(r"Fairness Score:\s*(\d+)%?", "", output, flags=re.I).strip()
            pros, cons = extract_pros_cons(output)
            
            return summary, score, pros, cons
        except Exception as e:
            logger.warning(f"Model {model_name} failed: {e}")
            last_exception = e
    
    logger.error(f"All models failed. Last error: {last_exception}")
    raise HTTPException(status_code=500, detail=f"An error occurred with the AI model after trying all fallbacks. Please check your API key and server logs. Error: {last_exception}")

async def analyze_text(text: str) -> AnalyzeResponse:
    if not gemini_api_key:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY is not configured on the server.")

    chunk_size = 15000
    
    if len(text) <= chunk_size:
        prompt = f"""
You are a digital agreement evaluator for user protection.

The user has provided Terms & Conditions from one of the following sources: file, pasted text, or URL. Analyze this content to help the user understand the fairness of what they are agreeing to.

Perform the following analysis:

1. **Extract and evaluate individual clauses or terms.**
2. **Summarize** the core themes and structure of the document.
3. For each major clause, rate it using this fairness scale:
   - **1.0 (Fair):** Transparent, balanced, respects user rights
   - **0.5 (Questionable):** Vague, potentially unfair, or dependent on context
   - **0.0 (Unfair):** Clearly one-sided, restrictive, or harmful to the user
4. **List and explain all clauses rated 0.0 or 0.5**.
5. **Suggest how each unfair or questionable clause could be rewritten** to improve fairness.
6. **Identify major Pros and Cons** for the user in this agreement.

Format your output clearly using the following structure with markdown formatting.

- **Summary**
- **Pros**
- **Cons**
- **Unfair or Questionable Clauses**

Here is the input:
{text}
"""
        summary, score, pros, cons = await analyze_with_fallback(prompt, text)
        return AnalyzeResponse(summary=summary, fairness_score=score, pros=pros, cons=cons)
    else:
        text_chunks = [text[i:i+chunk_size] for i in range(0, len(text), chunk_size)]
        
        chunk_results = []
        model_names = ["gemini-2.5-pro"]

        for chunk in text_chunks:
            last_exception = None
            for model_name in model_names:
                try:
                    result = await analyze_text_chunk(chunk, model_name)
                    chunk_results.append(result)
                    break  # Success, move to the next chunk
                except Exception as e:
                    logger.warning(f"Chunk analysis with {model_name} failed: {e}")
                    last_exception = e
            else:  # This else belongs to the for loop, executed if the loop completes without break
                logger.error(f"All models failed for a chunk. Last error: {last_exception}")
                raise HTTPException(status_code=500, detail=f"Failed to analyze a text chunk with all available models. Error: {last_exception}")

        combined_summary = "\n\n".join([res["summary"] for res in chunk_results])
        total_score = sum([res["score"] for res in chunk_results])
        average_score = total_score / len(chunk_results) if chunk_results else 0
        combined_pros = [pro for res in chunk_results for pro in res["pros"]]
        combined_cons = [con for res in chunk_results for con in res["cons"]]

        return AnalyzeResponse(
            summary=combined_summary,
            fairness_score=int(average_score),
            pros=list(set(combined_pros)),
            cons=list(set(combined_cons))
        )
