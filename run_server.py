"""
HawaWise AI - Server Entrypoint
Starts FastAPI application with Uvicorn server on http://localhost:8000
"""

import os
import sys
import uvicorn

if __name__ == "__main__":
    host = os.environ.get("HOST", "127.0.0.1")
    port = int(os.environ.get("PORT", "8000"))
    
    print("\n" + "=" * 65)
    print("STARTING HAWAWISE AI APPLICATION SERVER")
    print(f"Web Application URL: http://{host}:{port}")
    print(f"API Documentation:   http://{host}:{port}/docs")
    print(f"Video Stream:        http://{host}:{port}/video")
    print("=" * 65 + "\n")

    uvicorn.run("backend.main:app", host=host, port=port, reload=False)
