# 🎙️ Speech2Text – Frontend

This is the **React frontend** for the Speech2Text app.  
It allows users to:

- 🔑 Login with Google
- 📂 Upload audio files and transcribe them using OpenAI Whisper API
- 🎧 Perform **live transcription** using the browser’s Speech Recognition API
- 💾 Save transcription history (view, delete, manage)
- 💰 See audio duration and estimated transcription cost (₹)

---

## 🚀 Tech Stack

- React (Vite)
- Axios
- TailwindCSS
- Lucide-react (icons)
- React Router

---

## 📦 Setup Instructions

### 1. Clone the repo
```bash
git clone https://github.com/your-username/speech2text.git
cd speech2text/frontend

2. Install dependencies
npm install

3. Start frontend
npm run dev


By default, the frontend runs on:
http://localhost:5173


🔑 Features
-Google OAuth login (handled via backend)
-File upload with transcription
-Live transcription using Web Speech API
-History view with delete option
-Displays duration and estimated cost (₹)

📂 Project Structure
frontend/
│── src/
│   ├── components/     # Reusable components
│   ├── pages/          # Home.jsx, Live.jsx
│   ├── App.jsx
│   ├── main.jsx
│── public/
│   ├── logo.png
│── package.json
│── tailwind.config.js
│── vite.config.js


