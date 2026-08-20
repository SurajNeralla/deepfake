import io
import pytest
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_reject_unsupported_file_extension():
    fake_file = io.BytesIO(b"dummy executable bytes")
    response = client.post(
        "/api/analyze/image",
        files={"file": ("malicious.exe", fake_file, "application/octet-stream")}
    )
    assert response.status_code == 400
    assert "Unsupported image extension" in response.json()["detail"]

def test_reject_empty_file():
    empty_file = io.BytesIO(b"")
    response = client.post(
        "/api/analyze/image",
        files={"file": ("empty.jpg", empty_file, "image/jpeg")}
    )
    assert response.status_code == 400
    assert "Uploaded file is empty" in response.json()["detail"]
