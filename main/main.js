const path = require('path');
const mysql = require('mysql');
const {app, BrowserWindow, screen} = require('electron');

app.on('ready', function() {
  const {width, height} = screen.getPrimaryDisplay().size;
  console.log(width,height);
  mainWindow = new BrowserWindow({ 
    title: "slipeManager",
    width: width/3*2,
    height: height/3*2,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    }
  });
  mainWindow.loadURL(`file://${__dirname}/frontPage.html`);
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
});