import { Command } from '@oclif/command';

import logger from '../utilities/logger';
import config from '../utilities/config';

import DotfileManager from '../classes/DotfileManager';

class Load extends Command {
  static description = 'Load dotfiles from the dotfile repository directory';

  async run() {
    if (!config.get('dotfileRepoDir')) {
      logger.error('Dotfile repository directory not set');
      logger.info(`Set with: dotman cd <path/to/your/dotfile/repo>`);
      process.exit();
    }

    const dotfileRepoDir = config.get('path');
    const dotfileManager = new DotfileManager(dotfileRepoDir);

    dotfileManager.load();
  }
}

export = Load;
