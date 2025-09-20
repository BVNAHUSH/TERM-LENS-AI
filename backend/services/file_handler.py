import pdfplumber
import docx2txt
from fastapi import UploadFile
import os
import shutil

async def extract_text_from_file(file: UploadFile) -> str:
    # Ensure the temp_uploads directory exists
    if not os.path.exists("temp_uploads"):
        os.makedirs("temp_uploads")

    ext = file.filename.split(".")[-1].lower()
    temp_path = f"temp_uploads/{file.filename}"
    
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    content = ""
    if ext == "pdf":
        with pdfplumber.open(temp_path) as pdf:
            content = "\n".join(page.extract_text() for page in pdf.pages if page.extract_text())
    elif ext == "docx":
        content = docx2txt.process(temp_path)
    elif ext == "txt":
        with open(temp_path, "r", encoding="utf-8") as f:
            content = f.read()

    os.remove(temp_path)
    return content
