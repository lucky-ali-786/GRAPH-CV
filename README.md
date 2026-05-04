# AI Resume Roaster & ATS Evaluator

A high-performance, asynchronous AI application designed to evaluate, critique, and enhance resumes. By decoupling heavy LLM processing from the main application thread using a message queue, this platform ensures a seamless, non-blocking user experience even during complex document analysis.

## Core Features

*   **Resume Roaster:** Deep-dives into document flaws, flagging vague bullet points, missing quantifiable metrics, and weak action verbs.
*   **Resume Enhancer:** Processes and rewrites specific document sections in parallel to elevate the overall impact.
*   **ATS Evaluator:** Compares the uploaded resume against targeted Job Descriptions (JD) to generate precise match metrics and compatibility scores.
*   **Integrated LaTeX Editor:** Allows users to make immediate formatting and content adjustments based on AI feedback, rendering changes directly in the browser.

## System Architecture

Evaluating complex documents with LLMs synchronously often leads to API timeouts and a frozen client UI. This system solves that bottleneck through a decoupled architecture:

1.  **Ingestion & Queueing:** A user uploads a resume via the React frontend. The Node.js backend immediately generates a Job ID and offloads the task to a **BullMQ** message queue, keeping the main thread free.
2.  **Document Parsing:** Background workers pick up the job. Image-based documents are extracted as raw bytes (rather than base64) to optimize Gemini API token efficiency and stability.
3.  **Parallel Evaluation:** The data enters a **LangGraph** multi-agent flow. Dedicated Gemini agents evaluate the *Experience*, *Projects*, and *Achievements* sections simultaneously, drastically reducing overall latency.
4.  **Final Judge:** A synthesis node aggregates the parallel outputs, enforces a strict JSON schema, and writes the structured feedback to the database.

## Tech Stack

*   **Frontend:** React.js
*   **Backend:** Node.js, Express.js
*   **Queue System:** BullMQ, Redis
*   **AI / LLM:** Gemini API, LangGraph
*   **Infrastructure:** Docker (for containerized background workers)

## Getting Started

### Prerequisites
*   Node.js (v18+)
*   Redis (Running locally or via Docker)
*   Gemini API Key

### Installation

1. Clone the repository:
   ```bash
   git clone [https://github.com/yourusername/your-repo-name.git](https://github.com/yourusername/your-repo-name.git)
   cd your-repo-name
2.Install dependencies for the backend and frontend:
```bash

   cd backend
   npm install
   cd ../frontend
   npm install
GEMINI_API_KEY=your_gemini_api_key
REDIS_URL=redis://127.0.0.1:6379
PORT=5000

4. Start the development servers:
   ```bash
   # Terminal 1: Start the backend server and queue
   cd backend
   npm run dev

   # Terminal 2: Start the background worker
   cd backend
   npm run worker

   # Terminal 3: Start the React frontend
   cd frontend
   npm run start
