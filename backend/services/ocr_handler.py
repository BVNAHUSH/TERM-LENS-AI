import pytesseract
from PIL import Image
import shutil
import os
from fastapi import UploadFile

async def extract_text_from_image(file: UploadFile) -> str:
    temp_path = f"temp_uploads/{file.filename}"
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    image = Image.open(temp_path)
    text = pytesseract.image_to_string(image)

    os.remove(temp_path)
    return text
