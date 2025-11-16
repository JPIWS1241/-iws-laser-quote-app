# One-click builder for Windows (run as Administrator if needed)
Set-StrictMode -Version Latest

# Ensure Node and Python are installed
Write-Output "Installing npm packages..."
npm install

Write-Output "Installing Python packages..."
py -3.11 -m pip install --upgrade pip
py -3.11 -m pip install streamlit pandas fpdf pillow openpyxl

Write-Output "Building Electron installer (this may take several minutes)..."
npm run dist

Write-Output "Build complete. Check the 'dist' folder for your installer."
Pause
