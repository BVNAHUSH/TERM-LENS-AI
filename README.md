![Python](https://img.shields.io/badge/Python-3.11-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.95-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

# 🎯AI T&C Analyzer

**Ever scrolled through endless terms and conditions, wondering what you’re actually agreeing to?**  

AI T&C Analyzer is a cutting-edge web application that uses **artificial intelligence** to analyze Terms & Conditions (T&C) documents, highlighting **key clauses, potential risks, and hidden obligations**. With this tool, users can **quickly understand legal documents without spending hours reading**.  

Whether you’re signing up for a service, checking a loan agreement, or browsing a website, AI T&C Analyzer makes **legal transparency accessible to everyone**.

---

## 🌟 Why This Matters

- ⚖️ **Legal transparency:** Most people skip T&C documents, often unknowingly agreeing to unfavorable terms.  
- ⏱️ **Time-saving:** Instantly identify important clauses instead of reading pages of legal jargon.  
- 🚨 **Risk awareness:** Detect potential issues like automatic subscriptions, privacy concerns, or hidden fees.  
- 💻 **Accessible:** Works as a web app and browser extension, putting insights right at your fingertips.  

By bridging AI and everyday legal documents, AI T&C Analyzer empowers users to **make informed decisions** and **take control of their digital agreements**.

# 👁️ Meet **TERM LENS AI** 👁️





Analyze contracts, T&C documents, and agreements instantly with AI! 🧠  
Understand key clauses, spot hidden risks, and make informed decisions — all in seconds.


<img width="1896" height="902" alt="image" src="https://github.com/user-attachments/assets/8ec58343-2bcb-4c83-a7a1-327877875c47" />



https://github.com/user-attachments/assets/c9b8440d-d855-40b0-9459-7f6e8effb21e


## Features


- 📄 Upload and analyze T&C documents.  
- 🤖 AI-powered analysis to highlight important clauses and detect potential issues.  
- 🖥️ User-friendly interface to view analysis results.  
- 🌐 Browser extension for quick access while browsing websites(future work).  

---

<img width="1898" height="901" alt="image" src="https://github.com/user-attachments/assets/388f1db8-6cc2-4c4b-818c-397d6e3241a7" />



## Tech Stack

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Python, FastAPI
- **OCR:** Tesseract for extracting text from documents
- **AI/ML:** Custom AI models for document analysis
## Installation and Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd AI-T&C-ANALYZER
    ```
2.  **Set up the backend:**
    *   Navigate to the `backend` directory:
        ```bash
        cd backend
        ```
    *   Install the required Python packages:
        ```bash
        pip install -r requirements.txt
        ```
    *   Activate the conda environment (if you are using conda):
        ```bash
        C:/Users/username/anaconda3/Scripts/activate
        conda activate base
        ```
    *   Run the backend server:
        ```bash
        uvicorn main:app --reload
        ```
3.  **Set up the frontend:**
    *   Open the `web-client/index.html` file in your browser.

4.  **Set up the browser extension:**
    *   Open your browser's extension management page.
    *   Enable "Developer mode".
    *   Click "Load unpacked" and select the `extension` directory.

## Usage

1.  Open the web application by launching `web-client/index.html`.
2.  Upload a T&C document.
3.  View the analysis results.

## Project Structure

The project is organized as follows:

```
.
├── backend
│   ├── main.py
│   ├── models
│   │   └── schema.py
│   ├── routes
│   │   └── analyze.py
│   ├── services
│   │   ├── ai_model.py
│   │   ├── file_handler.py
│   │   └── ocr_handler.py
│   └── utils
│       └── helpers.py
├── extension
│   ├── icons
│   ├── manifest.json
│   ├── popup.html
│   ├── popup.js
│   └── style.css
├── images
│   ├── card icon.png
│   ├── eye icon.png
│   ├── graduate icon.png
│   └── logo.gif
├── shared
│   └── helpers.js
├── web-client
│   ├── about.html
│   ├── analyzer.html
│   ├── index.html
│   ├── script.js
│   ├── signin.html
│   └── style.css
├── .env
├── commands
├── README.md
├── requirements.txt
└── test.txt
```
# Environment Variables
```
GEMINI_KEY=your_api_key_here

```
set your api key and then start the project.
## 💡 Feedback

If you have ideas, bug reports, or suggestions, feel free to open an [issue](https://github.com/BVNAHUSH/TERM-LENS-AI/issues) or contact me directly.  
All code contributions are managed solely by **B.V. Nahush**.


## 🔒 License

© 2025 B.V. Nahush. All Rights Reserved.  
This project is proprietary and owned solely by **B.V. Nahush**.  
Unauthorized use, modification, or distribution is prohibited.


# 📊 Outputs
For complete demos, screenshots, and live examples, check my LinkedIn profile:  
🔗 [B.V. Nahush - LinkedIn](https://www.linkedin.com/in/b-v-nahush)

 # 📫Contact
 [Mail me](work.nahushreddy@gmail.com)

 
