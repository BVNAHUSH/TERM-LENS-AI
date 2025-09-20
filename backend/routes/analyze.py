from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from services.file_handler import extract_text_from_file
from services.ocr_handler import extract_text_from_image
from services.ai_model import analyze_text
from models.schema import AnalyzeResponse
import os
from utils.helpers import fetch_text_from_url

router = APIRouter()

@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze(
    file: UploadFile = File(None),
    raw_text: str = Form(None),
    url: str = Form(None),
):
    content = ""
    if raw_text:
        content = raw_text
    elif url:
        content = await fetch_text_from_url(url)
    elif file:
        if file.content_type in ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "text/plain"]:
            content = await extract_text_from_file(file)
        elif file.content_type in ["image/jpeg", "image/png"]:
            content = await extract_text_from_image(file)
        else:
            raise HTTPException(status_code=400, detail=f"Unsupported file type: {file.content_type}")
    else:
        raise HTTPException(status_code=400, detail="No input provided. Please provide either text, a file, or a URL.")

    if not content:
        raise HTTPException(status_code=500, detail="Failed to extract content from the input.")

    response = await analyze_text(content)
    return response
