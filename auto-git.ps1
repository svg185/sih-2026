$ProjectPath = "D:\sih\national-identity-security"

Set-Location $ProjectPath

Write-Host "Git Auto-Sync Started..." -ForegroundColor Green

while ($true) {

    $status = git status --porcelain

    if ($status) {

        Write-Host ""
        Write-Host "Changes detected!" -ForegroundColor Yellow

        git add .

        $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
        git commit -m "Auto-sync: $timestamp"

        git push origin MCP

        Write-Host "Changes committed and pushed successfully." -ForegroundColor Green
    }

    Start-Sleep -Seconds 60
}
