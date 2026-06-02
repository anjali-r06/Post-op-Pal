from fastapi import FastAPI
import uvicorn

app = FastAPI()

@app.get("/")
def home():
    return {"status": "Post-Op Pal Brain is running 🧠"}

@app.get("/ask")
def ask(q: str):
    return {
        "question": q,
        "answer": f"Brain received your question: '{q}'"
    }

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8010)
