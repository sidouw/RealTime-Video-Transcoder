const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipcMain = electron.ipcMain;
const dialog = electron.dialog
require('./Server/server')
const path = require('path');
const isDev = require('electron-is-dev');
const { startServer, stopServer,setStreamSettings } = require('./Server/server');

let mainWindow = null;


const webPreferences = { webSecurity: false,nodeIntegration: true,contextIsolation: false,enableRemoteModule: true}

function createWindow() {
  mainWindow = new BrowserWindow({width: 900, height: 350,webPreferences });
  mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);

  // mainWindow.webContents.openDevTools()
  
  // settingsWindow = new BrowserWindow({width: 600, height: 600, parent: mainWindow, show: true,webPreferences});
  // settingsWindow.loadURL(isDev ? 'http://localhost:3000/settings' : `file://${path.join(__dirname, '../build/index.html')}`);
  // mainWindow.on('closed', () => mainWindow = null);
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on('settingsChnaged',(event,settings)=>{
  setStreamSettings(settings);
  
})

ipcMain.on('startServer', (event,path, port,pswEnabled,password,ffmpegLocation) => {
  startServer(path,port,pswEnabled,password,ffmpegLocation)
})

ipcMain.on('stopServer', () => {
  stopServer()
})

ipcMain.on('selectFolder', async (e,arg) => {
  const place = await dialog.showOpenDialog(mainWindow,{properties:['openFile', 'openDirectory']})
  const replay = place.canceled ? "" : place.filePaths[0]
  e.reply('folderSelected',replay)
})
