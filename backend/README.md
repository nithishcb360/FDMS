# Landing Page Backend

FastAPI backend with PostgreSQL for the landing page.

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

3. Update the `.env` file with your PostgreSQL credentials:
```
DATABASE_URL=postgresql://user:password@localhost:5432/landing_db
SECRET_KEY=your-secret-key-here
BACKEND_CORS_ORIGINS=["http://localhost:3000"]
```

4. Run the application:
```bash
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`

## API Documentation

- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Endpoints

- `POST /api/contacts/` - Create a new contact submission
- `GET /api/contacts/` - Get all contact submissions
- `GET /api/contacts/{id}` - Get a specific contact submission
