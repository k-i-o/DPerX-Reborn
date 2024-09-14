import * as fs from 'fs';
import * as path from 'path';
import { IBase } from '../../../interfaces/IBase';
import { Notification } from 'electron';

export class Spoofer implements IBase {

    backup: boolean = true;

    hotkeys: any[] = [];

    execute() {
        const desktopPath = this.getDesktopPath();

        if (desktopPath) {
            
            if(this.checkDDNetFolders(desktopPath, this.backup) || this.checkTeeworldsFolders(desktopPath, this.backup)) {
                const backupDir = path.join(desktopPath, 'BackupDDNetFiles');
                if (!fs.existsSync(backupDir) && this.backup) {
                    fs.mkdirSync(backupDir);
                }
    
                new Notification({ title: 'Spoofed!', body: 'Spoof Status' }).show();
                return;
            }
            
            new Notification({ title: 'Spoofing failed... Folder of DDNet or Teeworlds not found.', body: 'Spoof Status' }).show();
            
        } else {
            new Notification({ title: 'Unable to obtain the path to the user\'s Desktop folder.', body: 'Spoof Status' }).show();
        }
    }

    private getDesktopPath(): string | null {
        const homeDir = require('os').homedir();
        return path.join(homeDir, 'Desktop');
    }

    private checkDDNetFolders(desktopDir: string, backup: boolean): boolean {
        const pathDDNet = path.join(require('os').homedir(), 'AppData', 'Roaming', 'DDNet');

        if (!fs.existsSync(pathDDNet)) {
            new Notification({ title: 'DDNet folder not found!', body: 'Spoof Status' }).show();
            return false;
        }

        if (backup) {
            const backupPath = path.join(desktopDir, 'BackupDDNetFiles', 'DDNet');
            this.copyFolderRecursiveSync(pathDDNet, backupPath);
        }

        new Notification({ title: 'Operation completed successfully (DDNet backup)!', body: 'Spoof Status' }).show();

        this.deleteFolderRecursive(pathDDNet);

        return true;
    }

    private checkTeeworldsFolders(desktopDir: string, backup: boolean): boolean {
        const pathTeeworlds = path.join(require('os').homedir(), 'AppData', 'Roaming', 'Teeworlds');

        if (!fs.existsSync(pathTeeworlds)) {
            new Notification({ title: 'Teeworlds folder not found!', body: 'Spoof Status' }).show();
            return false;
        }

        if (backup) {
            const backupPath = path.join(desktopDir, 'BackupDDNetFiles', 'Teeworlds');
            this.copyFolderRecursiveSync(pathTeeworlds, backupPath);
        }

        new Notification({ title: 'Operation completed successfully (Teeworlds backup)!', body: 'Spoof Status' }).show();

        this.deleteFolderRecursive(pathTeeworlds);

        return true;
    }

    private copyFolderRecursiveSync(source: string, target: string) {
        if (!fs.existsSync(target)) {
            fs.mkdirSync(target, { recursive: true });
        }

        if (fs.lstatSync(source).isDirectory()) {
            fs.readdirSync(source).forEach((file) => {
                const curSource = path.join(source, file);
                const curTarget = path.join(target, file);

                if (fs.lstatSync(curSource).isDirectory()) {
                    this.copyFolderRecursiveSync(curSource, curTarget);
                } else {
                    fs.copyFileSync(curSource, curTarget);
                }
            });
        }
    }

    private deleteFolderRecursive(folder: string) {
        if (fs.existsSync(folder)) {
            fs.readdirSync(folder).forEach((file) => {
                const curPath = path.join(folder, file);
                if (fs.lstatSync(curPath).isDirectory()) {
                    this.deleteFolderRecursive(curPath);
                } else {
                    fs.unlinkSync(curPath);
                }
            });
            fs.rmdirSync(folder);
        }
    }
}
