# AIML-A Project Hub & Tools

This workspace contains a central **Project Hub UI** that launches several independent applications. To make the hub's buttons work, you must run each application's server simultaneously in separate terminals.

---

## Quick Start: How to Run Everything

Open a new terminal for each step.

### Terminal 1: Run the Main Project Hub (Your UI)

This is the main user interface.
```sh
# 1. Navigate to the hub's directory
cd "c:\Users\HP\OneDrive\Desktop\ADA project aiml-a\main-hub"

# 2. Install dependencies (only needed once)
npm install

# 3. Start the UI
npm start
```
✅ **Your UI is now running at `http://localhost:3000`**

---

### Terminal 2: Run the Algorithm Analyzer

This runs the server for the "Algorithm Analyzer" tool.
```sh
# 1. Navigate to the analyzer's frontend directory
cd "c:\Users\HP\OneDrive\Desktop\ADA project aiml-a\algorithmanalyser"

# 2. Install dependencies (only needed once)
npm install

# 3. Start the server
npm run dev
```
✅ **The Analyzer tool is now running at `http://localhost:3001`**

---

### Terminal 3: Run the Smart Resume Optimizer

This runs the Python server for the "Resume Optimizer" tool.
```sh
# 1. Navigate to the optimizer's directory
cd "c:\Users\HP\OneDrive\Desktop\ADA project aiml-a\resumeoptimiser"

# 2. Activate virtual environment
venv\Scripts\activate

# 3. Install dependencies (only needed once)
pip install -r requirements.txt

# 4. Start the server
python main.py
```
✅ **The Resume Optimizer is now running at `http://localhost:5000`**

---

### Terminals 4 & 5: Run the Student Q&A Platform

This tool requires two servers (backend and frontend).

**In Terminal 4 (Backend):**
```sh
# 1. Navigate to the Q&A project directory
cd "c:\Users\HP\OneDrive\Desktop\ADA project aiml-a\projectQ&A\project"

# 2. Start the backend server
npm run server
```
✅ **The Q&A backend is now running (check terminal for port, likely 8000).**

**In Terminal 5 (Frontend):**
```sh
# 1. Navigate to the Q&A project directory
cd "c:\Users\HP\OneDrive\Desktop\ADA project aiml-a\projectQ&A\project"

# 2. Start the frontend server
npm run dev
```
✅ **The Q&A frontend is now running at `http://localhost:5173`**
