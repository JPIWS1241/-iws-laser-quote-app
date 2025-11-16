const { app, BrowserWindow, dialog } = require("electron");
const path = require("path");
const { autoUpdater } = require("electron-updater");

// ================= STREAMLIT URL =====================
const STREAMLIT_URL = "https://iws-laser-quote.streamlit.app";
// ======================================================

// REQUIRED FIXES
autoUpdater.allowDowngrade = true;
autoUpdater.autoDownload = false;

// LOGGING
autoUpdater.logger = require("electron-log");
autoUpdater.logger.transports.file.level = "info";

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 900,
    icon: path.join(__dirname, "icon.png"),
    webPreferences: { preload: path.join(__dirname, "preload.js") }
  });

  console.log("🌎 Loading Streamlit:", STREAMLIT_URL);
  win.loadURL(STREAMLIT_URL);
}

// APP READY
app.whenReady().then(() => {
  console.log("🔧 App ready. Checking updates…");
  createWindow();
  setTimeout(() => autoUpdater.checkForUpdates(), 4000);
});

// UPDATE AVAILABLE
autoUpdater.on("update-available", info => {
  console.log("🟢 Update available:", info.version);

  dialog.showMessageBox({
    type: "info",
    title: "Update Available",
    message: `Version ${info.version} is available.\nDownload now?`,
    buttons: ["Yes", "No"]
  }).then(result => {
    if (result.response === 0) autoUpdater.downloadUpdate();
  });
});

// UPDATE DOWNLOADED
autoUpdater.on("update-downloaded", () => {
  console.log("📦 Update downloaded");
  dialog.showMessageBox({
    title: "Install Update",
    message: "Update ready. Restart now?",
    buttons: ["Restart", "Later"]
  }).then(result => {
    if (result.response === 0) autoUpdater.quitAndInstall();
  });
});

// NO UPDATE
autoUpdater.on("update-not-available", info => {
  console.log("❌ No update. Current:", app.getVersion(), "Latest:", info.version);
});

// ERROR
autoUpdater.on("error", err => {
  console.error("❗ AutoUpdater Error:", err);
});
