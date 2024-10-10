import { app, shell, BrowserWindow } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { ipcListeners, startGlobalListener, updater } from './workers'
import { Offsets } from './models/singletons/Offsets'

let mainWindow: BrowserWindow | null = null;

function createWindow(): void {
    
    mainWindow = new BrowserWindow({
        width: 900,
        height: 670,
        show: false,
        maximizable: false,
        autoHideMenuBar: true,
        frame: false,
        // ...(process.platform === 'linux' ? { icon } : {}),
        icon,
        webPreferences: {
            preload: join(__dirname, '../preload/index.js'),
            sandbox: false
        }
    });

    mainWindow.on('ready-to-show', () => {
        mainWindow?.show();
    });

    mainWindow.webContents.setWindowOpenHandler((details) => {
        shell.openExternal(details.url);
        return { action: 'deny' };
    });

    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
        mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
    } else {
        mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
    }
}

app.whenReady().then(() => {
    
    electronApp.setAppUserModelId('it.kiocode.dperxreborn');

    app.on('browser-window-created', (_, window) => {
        optimizer.watchWindowShortcuts(window)
    });

    Offsets.getInstance().loadAllDefaultOffsets();

    updater();
    
    createWindow();
    
    startGlobalListener(mainWindow);
    ipcListeners(mainWindow);  

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
    
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})