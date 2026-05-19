# RTK Monitoring Script
# Author: DevOps Agent
# Description: Monitor RTK token savings and discover missed opportunities
# Location: C:\Users\pedro\.config\opencode\scripts\rtk-monitor.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   RTK Token Savings Monitor" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "=== RTK Token Savings Report ===" -ForegroundColor Green
rtk gain

Write-Host ""
Write-Host "=== Daily Breakdown ===" -ForegroundColor Yellow
rtk gain --daily

Write-Host ""
Write-Host "=== Weekly Breakdown ===" -ForegroundColor Yellow
rtk gain --weekly

Write-Host ""
Write-Host "=== ASCII Graph (Last 30 Days) ===" -ForegroundColor Magenta
rtk gain --graph

Write-Host ""
Write-Host "=== Missed Opportunities (Last 24h) ===" -ForegroundColor Red
rtk discover --all --since 1

Write-Host ""
Write-Host "=== Exporting Analytics ===" -ForegroundColor Green
$jsonPath = "C:\Users\pedro\.config\opencode\rtk-analytics.json"
$csvPath = "C:\Users\pedro\.config\opencode\rtk-analytics.csv"

rtk gain --all --format json > $jsonPath
Write-Host "  JSON exported to: $jsonPath" -ForegroundColor Gray

rtk gain --all --format csv > $csvPath
Write-Host "  CSV exported to: $csvPath" -ForegroundColor Gray

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Monitoring Complete!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
