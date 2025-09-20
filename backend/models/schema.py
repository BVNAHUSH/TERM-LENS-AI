from pydantic import BaseModel
from typing import List, Optional

class AnalyzeResponse(BaseModel):
    summary: str
    fairness_score: float
    pros: List[str]
    cons: List[str]

class TextAnalysisRequest(BaseModel):
    text: str

class QuestionRequest(BaseModel):
    text: str
    question: str

class QuestionResponse(BaseModel):
    answer: str
