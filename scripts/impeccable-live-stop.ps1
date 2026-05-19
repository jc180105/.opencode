$ErrorActionPreference = "SilentlyContinue"
$root = "C:\Users\pedro\.config\opencode"

Set-Location $root

# 1) Stop poll worker/autopilot
Get-CimInstance Win32_Process |
  Where-Object { $_.CommandLine -like "*impeccable-live-worker.ps1*" -or $_.CommandLine -like "*impeccable-live-autopilot.py*" } |
  ForEach-Object { Stop-Process -Id $_.ProcessId -Force }

# 2) Stop helper and remove injection
node "skills/impeccable/scripts/live-server.mjs" stop

# 3) Optional: stop local test server
Get-CimInstance Win32_Process |
  Where-Object { $_.CommandLine -like "*serve test-live -l 4173*" } |
  ForEach-Object { Stop-Process -Id $_.ProcessId -Force }

Write-Output "Impeccable Live parado e limpo."
node "skills/impeccable/scripts/live-status.mjs"
