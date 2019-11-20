'use strict';

import child from 'child_process';
import fs from 'fs-plus';
import path from 'path';
import pkg from '../../package.json';

const appFolder = path.resolve(process.execPath, '..');
const rootFolder = path.resolve(appFolder, '..');
const updateDotExe = path.join(rootFolder, 'Update.exe');
const exeName = path.basename(process.execPath);

function spawn(command: any, args: any, callback: any) {
  let spawnedProcess = null;
  let error: any = null;
  let stdout = '';

  try {
    spawnedProcess = child.spawn(command, args);
  } catch (processError) {
    process.nextTick(() => {
      callback(processError, stdout);
    });
    return;
  }

  spawnedProcess.stdout.on('data', (data: any) => {
    stdout += data;
  });

  spawnedProcess.on('error', (processError: any) => {
    error = error || processError;
  });

  spawnedProcess.on('close', (code: any, signal: any) => {
    if (code !== 0) {
      error = error || new Error(`Command failed: ${(signal || code)}`);
    }

    callback(error, stdout);
  });
}

function spawnUpdate(args: any, callback: any) {
  spawn(updateDotExe, args, callback);
}

function createShortcuts(callback: any) {
  spawnUpdate(['--createShortcut', exeName], callback);
}

function updateShortcuts(callback: any) {
  const homeDirectory = fs.getHomeDirectory();
  if (homeDirectory) {
    const desktopShortcutPath = path.join(homeDirectory, 'Desktop', `${pkg.name}.lnk`);
    fs.access(desktopShortcutPath, (desktopShortcutExists: any) => {
      createShortcuts(() => {
        if (desktopShortcutExists) {
          callback();
        } else {
          fs.unlink(desktopShortcutPath, callback);
        }
      });
    });
  } else {
    createShortcuts(callback);
  }
}

function removeShortcuts(callback: any) {
  spawnUpdate(['--removeShortcut', exeName], callback);
}

const handleCommand = (app: any, cmd: any) => {
  switch (cmd) {
    case 'install':
      createShortcuts(() => {
        app.quit();
      });
      return true;
    case 'updated':
      updateShortcuts(() => {
        app.quit();
      });
      return true;
    case 'uninstall':
      removeShortcuts(() => {
        app.quit();
      });
      return true;
    case 'obsolete':
      app.quit();
      return true;
    default:
      return false;
  }
};

export default {
  handleCommand,
  spawnUpdate,
};
