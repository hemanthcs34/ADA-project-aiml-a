# Algorithm Analyzer

A modern educational tool for visualizing and analyzing classic algorithms (sorting, graph, DP, etc.) with a beautiful React frontend and a Python Flask backend.

---

## Project Structure

```
ada/
  visualizer/
    api_server.py         # Flask backend with all endpoints
  requirements.txt        # Backend dependencies (Flask)
frontend/
  (React app: src/, public/, package.json, etc.)
```

---

## Getting Started

### 1. Open in VS Code
- Open VS Code.
- Go to **File > Open Folder...**
- Select the project root folder (e.g., `ada`).

### 2. Install Backend Dependencies
```
cd ada
pip install -r requirements.txt
```

### 3. Install Frontend Dependencies
```
cd ../frontend
npm install
```

### 4. Run the Backend (Flask)
```
cd ../ada/visualizer
python api_server.py
```
- The backend will run at `http://127.0.0.1:5000/`

### 5. Run the Frontend (React)
```
cd ../../frontend
npm start
```
- The app will open in your browser (usually at [http://localhost:3000](http://localhost:3000)).

---

## Usage
- Select an algorithm from the dropdown.
- Enter input as described in the placeholder.
- Click **Visualize** to see:
  - The result
  - Step-by-step explanation
  - (For Merge Sort) Tree visualization

---

## Notes
- Make sure both backend and frontend are running.
- If you see "Error connecting to backend", check that Flask is running at `http://127.0.0.1:5000/`.
- Extend `api_server.py` to add more algorithms or explanations.

---

**Happy Learning!** 