const { app, BrowserWindow, dialog } = require("electron");
const path = require("path");
const { autoUpdater } = require("electron-updater");
const log = require("electron-log");

// ---------------- LOGGING ----------------
autoUpdater.logger = log;
log.transports.file.level = "info";
autoUpdater.autoDownload = false;

// ---------------- CREATE WINDOW ----------------
function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 900,
    icon: path.join(__dirname, "icon.png"),
    webPreferences: { preload: path.join(__dirname, "preload.js") }
  });

  win.loadURL("https://iws-laser-quote.streamlit.app");
}

// ---------------- START APP ----------------
app.whenReady().then(() => {
  createWindow();

  setTimeout(() => {
    log.info("🔍 Checking for updates...");
    autoUpdater.checkForUpdates();
  }, 4000);
});

// ---------------- UPDATE AVAILABLE ----------------
autoUpdater.on("update-available", (info) => {
  log.info("🟢 Update available:", info.version);

  dialog.showMessageBox({
    type: "info",
    title: "New Update Available",
    message: `Version ${info.version} is available.\nInstall now?`,
    buttons: ["Yes", "Later"]
  }).then(result => {
    if (result.response === 0) {
      autoUpdater.downloadUpdate();
    }
  });
});

// ---------------- UPDATE DOWNLOADED ----------------
autoUpdater.on("update-downloaded", () => {
  log.info("📦 Update downloaded");

  dialog.showMessageBox({
    title: "Restart Required",
    message: "Update downloaded. Restart now?",
    buttons: ["Restart", "Later"]
  }).then(result => {
    if (result.response === 0) autoUpdater.quitAndInstall();
  });
});

// ---------------- NO UPDATE ----------------
autoUpdater.on("update-not-available", (info) => {
  log.info("❌ No update found. Current:", app.getVersion());
});

// ---------------- ERROR ----------------
autoUpdater.on("error", (err) => {
  log.error("❗ AutoUpdater ERROR:", err);
});
