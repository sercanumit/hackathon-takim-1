from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.responses import RedirectResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware # Import CORSMiddleware
from app.routers import auth, stories
from app.core.database import engine, metadata
import os
from pathlib import Path

# Define the lifespan context manager
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Code to run on startup
    print("Starting up...")
    print("Creating tables (if they don't exist)...")
    try:
        async with engine.begin() as conn:
            await conn.run_sync(metadata.create_all)
        print("Database tables created/verified.")
    except Exception as e:
        print(f"Error creating tables: {e}")
        # Handle error appropriately
    yield
    # Code to run on shutdown
    print("Shutting down...")
    await engine.dispose()
    print("Database connections closed.")

# Pass the lifespan manager to the FastAPI app
app = FastAPI(
    title="Hackathon Takım-1",
    description="Çocukların kararlarına göre eğitici hikayeler oluşturma uygulaması",
    version="0.0.1",
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allows all origins
    allow_credentials=True,
    allow_methods=["*"], # Allows all methods
    allow_headers=["*"], # Allows all headers
)

# Create the uploads directory if it doesn't exist
uploads_dir = Path(__file__).parent / "uploads"
if not uploads_dir.exists():
    uploads_dir.mkdir(parents=True)

# Mount the uploads directory to serve files statically
app.mount("/uploads", StaticFiles(directory=str(uploads_dir)), name="uploads")

app.include_router(auth.router)
app.include_router(stories.router)

@app.get("/")
def read_root():
    return RedirectResponse(url="/docs")