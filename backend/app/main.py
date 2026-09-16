from fastapi import FastAPI

app = FastAPI(
    title="AI-Based Fake Identity & Document Screening System",
    version="1.0.0"
)


@app.get("/")
def root():
    return {
        "message": "AI Identity Screening Backend is running"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }