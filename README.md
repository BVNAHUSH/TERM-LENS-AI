# AI T&C Analyzer

A web application that analyzes terms and conditions documents using AI.

## Features

*   Upload and analyze T&C documents.
*   AI-powered analysis to identify key clauses and potential issues.
*   User-friendly interface to view the analysis results.
*   Browser extension for quick analysis.

## Tech Stack

*   **Frontend:** HTML, CSS, JavaScript
*   **Backend:** Python, FastAPI

## Installation and Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd AI-T-C-ANALYZER
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
