---
name: webapp-testing
description: Toolkit for interacting with and testing local web applications using Playwright. Supports verifying frontend functionality, debugging UI behavior, capturing browser screenshots, and viewing browser logs.
license: Complete terms in LICENSE.txt
---

# Web Application Testing

To test local web applications, write native Python Playwright scripts.

**Helper Scripts Available**:
- `scripts/with_server.py` - Manages server lifecycle (supports multiple servers)

**Always run scripts with `--help` first** to see usage. DO NOT read the source until you try running the script first and find that a customized solution is absolutely necessary. These scripts can be very large and thus pollute your context window.

## Environment (Windows-first, cross-platform)

- **Python**: use `python` (NOT `python3`) on Windows; use `python3` inside Docker/Linux
- **Shell chains**: use `;` (NOT `&&`) on PowerShell
  - ❌ `cd backend && python server.py`
  - ✅ `cd backend; python server.py`  (PowerShell)
  - ✅ `cd backend && python server.py`  (bash/Docker only)
- **Screenshots**: use relative paths (NOT `/tmp/`) — `/tmp/` doesn't exist on Windows
  - ❌ `page.screenshot(path='/tmp/inspect.png')`
  - ✅ `page.screenshot(path='screenshots/inspect.png')`
- **pathlib**: always use `pathlib.Path` for file paths in Python scripts

## Decision Tree: Choosing Your Approach

```
User task → Is it static HTML?
    ├─ Yes → Read HTML file directly to identify selectors
    │         ├─ Success → Write Playwright script using selectors
    │         └─ Fails/Incomplete → Treat as dynamic (below)
    │
    └─ No (dynamic webapp) → Is the server already running?
        ├─ No → Run: python scripts/with_server.py --help
        │        Then use the helper + write simplified Playwright script
        │
        └─ Yes → Reconnaissance-then-action:
            1. Navigate and wait for networkidle
            2. Take screenshot or inspect DOM
            3. Identify selectors from rendered state
            4. Execute actions with discovered selectors
```

## Example: Using with_server.py

To start a server, run `--help` first, then use the helper:

**Single server (PowerShell):**
```powershell
python scripts/with_server.py --server "npm run dev" --port 5173 -- python your_automation.py
```

**Multiple servers (PowerShell — use ; inside strings for chaining):**
```powershell
# Pass server commands as quoted strings — the script handles them via shell=True internally
python scripts/with_server.py `
  --server "npm run dev" --port 5173 `
  --server "python -m uvicorn app:main --port 3000" --port 3000 `
  -- python your_automation.py
```

**Multiple servers (bash/Linux/CI):**
```bash
python3 scripts/with_server.py \
  --server "cd backend && python server.py" --port 3000 \
  --server "cd frontend && npm run dev" --port 5173 \
  -- python3 your_automation.py
```

To create an automation script, include only Playwright logic (servers are managed automatically):
```python
from pathlib import Path
from playwright.sync_api import sync_playwright

# Cross-platform output path
screenshots_dir = Path("screenshots")
screenshots_dir.mkdir(exist_ok=True)

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)  # Always launch chromium in headless mode
    page = browser.new_page()
    page.goto('http://localhost:5173')  # Server already running and ready
    page.wait_for_load_state('networkidle')  # CRITICAL: Wait for JS to execute
    # ... your automation logic
    page.screenshot(path=str(screenshots_dir / 'inspect.png'))  # Cross-platform path
    browser.close()
```

## Reconnaissance-Then-Action Pattern

1. **Inspect rendered DOM**:
   ```python
   from pathlib import Path
   screenshots = Path("screenshots")
   screenshots.mkdir(exist_ok=True)

   page.screenshot(path=str(screenshots / 'inspect.png'), full_page=True)
   content = page.content()
   page.locator('button').all()
   ```

2. **Identify selectors** from inspection results

3. **Execute actions** using discovered selectors

## Common Pitfalls

❌ **Don't** use `/tmp/` paths — they don't exist on Windows  
✅ **Do** use `pathlib.Path("screenshots")` for output files

❌ **Don't** inspect the DOM before waiting for `networkidle` on dynamic apps  
✅ **Do** wait for `page.wait_for_load_state('networkidle')` before inspection

❌ **Don't** use `python3` on Windows  
✅ **Do** use `python` on Windows, `python3` in Docker/Linux CI

## Best Practices

- **Use bundled scripts as black boxes** - To accomplish a task, consider whether one of the scripts available in `scripts/` can help. Use `--help` to see usage, then invoke directly.
- Use `sync_playwright()` for synchronous scripts
- Always close the browser when done
- Use descriptive selectors: `text=`, `role=`, CSS selectors, or IDs
- Add appropriate waits: `page.wait_for_selector()` or `page.wait_for_timeout()`
- **Always use `pathlib.Path`** for file paths — never hardcode `/` or `\`

## Reference Files

- **examples/** - Examples showing common patterns:
  - `element_discovery.py` - Discovering buttons, links, and inputs on a page
  - `static_html_automation.py` - Using file:// URLs for local HTML
  - `console_logging.py` - Capturing console logs during automation