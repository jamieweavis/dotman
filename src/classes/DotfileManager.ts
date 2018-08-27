import cliUx from 'cli-ux';

import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';

import logger from '../utilities/logger';
import Dotfile from '../interfaces/Dotfile';

class DotfileManager {
  private homeDir: string;
  private dotfileDir: string;

  constructor(dotfileDir: string) {
    this.homeDir = os.homedir();
    this.dotfileDir = dotfileDir;
  }

  public async load() {
    const dotfiles: Dotfile[] = this.getDirtyDotfiles(
      this.homeDir,
      this.dotfileDir,
    );
    const save = await this.promptSave(dotfiles);

    if (save) {
      dotfiles.forEach((dotfile: Dotfile) => {
        fs.copyFileSync(
          path.join(this.dotfileDir, dotfile.name),
          path.join(this.homeDir, dotfile.name),
        );
      });
      logger.success('Dotfiles loaded');
    } else {
      logger.error('Load aborted');
    }
  }

  private getDirtyDotfiles(toDir: string, fromDir: string): Dotfile[] {
    const toFiles = this.getDotfiles(toDir);
    const fromFiles = this.getDotfiles(fromDir);
    const dirtyFiles: Dotfile[] = [];

    fromFiles.forEach((fromFile: Dotfile) => {
      const toFile = toFiles.find(toFile => toFile.name === fromFile.name);
      if (toFile && Buffer.compare(toFile.buffer, fromFile.buffer) !== 0) {
        dirtyFiles.push(fromFile);
      }
    });

    return dirtyFiles;
  }

  private getDotfiles(dir: string): Dotfile[] {
    const dotfiles: Dotfile[] = [];

    fs.readdirSync(dir).forEach(name => {
      if (this.isDotfile(name)) {
        const filePath = path.join(dir, name);
        const stats = fs.statSync(filePath);
        if (stats.isDirectory()) return;
        const buffer = fs.readFileSync(filePath);
        dotfiles.push({ name, buffer });
      }
    });

    return dotfiles;
  }

  private isDotfile(filename: string): boolean {
    const blackList = ['.CFUserTextEncoding', '.DS_Store'];
    return filename.substring(0, 1) === '.' && !blackList.includes(filename);
  }

  private async promptSave(dotfiles: Dotfile[]) {
    if (dotfiles.length === 0) {
      logger.info('Dotfiles are identical');
      process.exit();
    }
    logger.warn('Dotfiles to be replaced:');
    dotfiles.forEach(dotfile => logger.info(dotfile.name));
    return await cliUx.confirm('Overwrite existing dotfiles? (y/n)');
  }
}

export default DotfileManager;
