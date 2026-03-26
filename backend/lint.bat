@echo off
cd backend
echo Running flake8 on Python code...

:: Run flake8 exactly as CI does
flake8 .\app .\alembic\versions --exclude=venv,__pycache__,.git

IF %ERRORLEVEL% EQU 0 (
    echo ✅ All Python linting checks passed!
    exit /B 0
) ELSE (
    echo ❌ Python linting failed. Please fix the issues above.
    exit /B 1
)
