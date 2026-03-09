from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from routes.generate import router as generate_router
from routes.qa import router as qa_router

load_dotenv()

app = FastAPI(title="ListMate API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"],
    allow_credentials=True,
    allow_methods=["*"],   # TODO: tighten to ["GET", "POST"] before any deployment
    allow_headers=["*"],   # TODO: tighten to ["Content-Type"] before any deployment
)

app.include_router(generate_router, prefix="/api")
app.include_router(qa_router, prefix="/api")

@app.get("/api/health")
def health():
    return {"status": "ok"}
