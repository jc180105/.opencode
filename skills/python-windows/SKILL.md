---
name: python-cross-platform
description: Cross-platform Python development guide for Windows (PowerShell) and Linux/Mac. Use when writing Python scripts, managing virtual environments, installing packages, or running Python-based tools in this project. Enforces pathlib.Path usage and correct python/python3 invocation per platform.
license: MIT
---

# Python Cross-Platform Development

This skill ensures Python code and commands work correctly on **Windows (PowerShell)** and **Linux/Mac/Docker** without modification.

## Core Rule: Use `pathlib.Path` Always

Never hardcode path separators. `pathlib.Path` is cross-platform and works everywhere:

```python
from pathlib import Path

# ✅ Always — works on Windows AND Linux
base = Path(__file__).parent
data_file = base / "data" / "output.json"
config = Path.home() / ".config" / "myapp" / "settings.json"
screenshots = Path("screenshots")
screenshots.mkdir(parents=True, exist_ok=True)

# ❌ Never — breaks on one OS or the other
data_file = "data\\output.json"   # Windows-only
data_file = "data/output.json"    # Works but fragile, use Path instead
```

---

## Python Executable: `python` vs `python3`

| Platform | Correct command | Wrong |
|----------|----------------|-------|
| Windows (native) | `python` | `python3` (not installed by default) |
| Linux/Mac | `python3` | `python` (may be Python 2) |
| Docker (any image) | `python3` | depends on base image |
| Virtual env (any) | `python` | doesn't matter once activated |

**In OpenCode agents: always use `python`** (Windows). When writing Dockerfiles or CI scripts that run on Linux, use `python3`.

---

## Virtual Environments

### Windows (PowerShell)
```powershell
# Create
python -m venv .venv

# Activate
.venv\Scripts\Activate.ps1

# If PowerShell blocks scripts:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Install deps
python -m pip install -r requirements.txt

# Deactivate
deactivate
```

### Linux/Mac/Docker
```bash
python3 -m venv .venv
source .venv/bin/activate
python3 -m pip install -r requirements.txt
deactivate
```

### Cross-platform script that detects OS
```python
import sys
from pathlib import Path

venv = Path(".venv")
if sys.platform == "win32":
    activate = venv / "Scripts" / "activate.bat"
    python = venv / "Scripts" / "python.exe"
else:
    activate = venv / "bin" / "activate"
    python = venv / "bin" / "python"
```

---

## Package Management

```powershell
# Always use `python -m pip` (never bare `pip` or `pip3`)
python -m pip install <package>
python -m pip install -r requirements.txt
python -m pip install --upgrade pip
python -m pip list
python -m pip freeze > requirements.txt

# Security audit
python -m pip install pip-audit
python -m pip_audit
```

---

## Running Modules (PowerShell)

```powershell
# Web servers
python -m uvicorn app:main --reload --port 8000
python -m flask run --port 5000
python -m gunicorn app:main

# Testing
python -m pytest
python -m pytest tests/ -v
python -m pytest --tb=short -q

# Linting
python -m ruff check .
python -m ruff format .
python -m mypy src/

# Testing
python -m pytest
python -m pip list
```

---

## Shell Command Chaining (PowerShell)

```powershell
# ✅ Use ; to chain commands (NOT &&)
python -m venv .venv; .venv\Scripts\Activate.ps1; python -m pip install -r requirements.txt

# ❌ Don't use && (bash only)
python -m venv .venv && source .venv/bin/activate  # WRONG on Windows
```

---

## Cross-Platform Script Template

Use this pattern when writing Python scripts that run on both Windows and Linux:

```python
#!/usr/bin/env python3
"""
Cross-platform script — works on Windows, Linux, and Mac.
Usage: python script.py [args]
"""
from pathlib import Path
import sys
import subprocess

# Always use pathlib for paths
BASE_DIR = Path(__file__).parent
OUTPUT_DIR = BASE_DIR / "output"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# Detect platform
IS_WINDOWS = sys.platform == "win32"

# Platform-aware subprocess (use shell=True for complex commands)
def run(cmd: str) -> int:
    """Run a shell command cross-platform."""
    return subprocess.run(cmd, shell=True).returncode

# Example: running a node server
if IS_WINDOWS:
    run("npm run dev")  # PowerShell handles this fine
else:
    run("npm run dev")  # Same on Linux

if __name__ == "__main__":
    print(f"Running on: {'Windows' if IS_WINDOWS else 'Unix'}")
    print(f"Base dir: {BASE_DIR}")
    print(f"Output dir: {OUTPUT_DIR}")
```

---

## Common Pitfalls

| ❌ Problem | ✅ Solution |
|-----------|------------|
| `python3 script.py` on Windows | `python script.py` |
| `os.path.join("dir", "file")` | `Path("dir") / "file"` |
| `path = "/tmp/output"` | `path = Path("output") / "tmp"` |
| `open("dir\\file.txt")` | `open(Path("dir") / "file.txt")` |
| `export VAR=val` in Python | `os.environ["VAR"] = "val"` |
| `subprocess.run("cmd && cmd2")` | `subprocess.run("cmd ; cmd2", shell=True)` on PowerShell |

---

## Environment Variables

```python
import os
from pathlib import Path

# Read env var with fallback
api_key = os.environ.get("API_KEY", "")
graph_path = Path(os.environ.get("GRAPHIFY_GRAPH_PATH", "graphify-out/graph.json"))

# Set env var in process (not permanent)
os.environ["MY_VAR"] = "value"
```

```powershell
# Set permanently in PowerShell session
$env:MY_VAR = "value"

# Set permanently in user profile
[System.Environment]::SetEnvironmentVariable("MY_VAR", "value", "User")
```
