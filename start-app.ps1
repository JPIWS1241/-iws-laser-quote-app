Write-Output "Starting Streamlit backend..."

$pythonExe = Join-Path $PSScriptRoot "python\python.exe"
$appScript = Join-Path $PSScriptRoot "python\laser_quote_app_final.py"

Start-Process $pythonExe -ArgumentList $appScript -WindowStyle Hidden
