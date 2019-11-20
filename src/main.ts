import { app, BrowserWindow, Menu } from 'electron';
import * as path from 'path';

import args from './squirrel/args';
import squirrel from './squirrel/squirrel';

let window: Electron.BrowserWindow;

function createWindow() {
  window = new BrowserWindow({
    height: 600,
    icon: path.join(__dirname, '../img/logo.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
    width: 800,
  });

  Menu.setApplicationMenu(null);

  window.loadFile(path.join(__dirname, '../index.html'));

  window.on('closed', () => {
    window = null;
  });
}

(() => {
  const cmd = args.parseArguments(app, process.argv.slice(1)).squirrelCommand;
  if (process.platform === 'win32' && squirrel.handleCommand(app, cmd)) {
    return;
  }

  app.on('ready', () => {createWindow(); });

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    if (window === null) {
      createWindow();
    }
  });

})();
