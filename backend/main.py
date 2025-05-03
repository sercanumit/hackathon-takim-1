from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.responses import RedirectResponse
from app.routers import auth
from app.database import engine, metadata

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

app.include_router(auth.router)

@app.get("/")
def read_root():
    return RedirectResponse(url="/docs")