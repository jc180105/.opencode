$ErrorActionPreference = "SilentlyContinue"
$root = "C:\Users\pedro\.config\opencode"

Set-Location $root

# 1) Kill old worker/autopilot instances
Get-CimInstance Win32_Process |
  Where-Object { $_.CommandLine -like "*impeccable-live-worker.ps1*" -or $_.CommandLine -like "*impeccable-live-autopilot.py*" } |
  ForEach-Object { Stop-Process -Id $_.ProcessId -Force }

# 2) Ensure test page server is up
$ok = $false
try {
  $resp = Invoke-WebRequest -Uri "http://localhost:4173" -UseBasicParsing -TimeoutSec 2
  if ($resp.StatusCode -eq 200) { $ok = $true }
} catch {}
if (-not $ok) {
   Write-Output "Iniciando page server em nova janela..."
   Start-Process -FilePath "npx" -ArgumentList "serve","test-live","-l","4173" -WorkingDirectory $root -NoNewWindow
   Start-Sleep -Seconds 2
}

# 3) Start live helper (inject live.js)
Write-Output "Iniciando Live Helper..."
node "skills/impeccable/scripts/live.mjs"

# 4) Start autopilot em nova janela (poll + generate handler)
Write-Output "Iniciando Impeccable Autopilot em nova janela..."
$autopilot = Join-Path $root "scripts/impeccable-live-autopilot.py"
Start-Process -FilePath "python" -ArgumentList "`"$autopilot`"" -WorkingDirectory $root

# 5) Show status summary
Write-Output ""
Write-Output "Impeccable Live iniciado."
Write-Output "URL teste: http://localhost:4173"
node "skills/impeccable/scripts/live-status.mjs"
