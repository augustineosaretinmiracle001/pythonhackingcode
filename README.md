# Python Web Application

A simple Flask web application ready for deployment.

## Setup

1. Install Python 3.8+
2. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

## Run Locally

```
python app.py
```

Visit: http://localhost:5000

## Deploy

### Render
1. Connect GitHub repository
2. Set build command: `pip install -r requirements.txt`
3. Set start command: `gunicorn app:app`

### Railway
1. Connect GitHub repository
2. Railway auto-detects Python and deploys

## Features

- Flask web framework
- HTML/CSS/JavaScript frontend
- REST API endpoint
- Ready for production deployment