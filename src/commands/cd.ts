import { Command } from '@oclif/command';
import * as path from 'path';
import * as fs from 'fs';

import logger from '../utilities/logger';
import config from '../utilities/config';

class Cd extends Command {
  static description = 'Change the dotfile repository directory';

  static usage = `cd <path/to/your/dotfile/repo>`;

  static args = [
    {
      name: 'path',
      required: true,
      description: 'The path to your dotfile repository directory',
    },
  ];

  async run() {
    const { args } = this.parse(Cd);
    const absolutePath = path.resolve(process.cwd(), args.path);

    try {
      const stats = fs.statSync(absolutePath);
      if (!stats.isDirectory()) throw new Error();
    } catch (error) {
      logger.error('Invalid directory path');
      process.exit();
    }

    config.set('dotfileRepoDir', absolutePath);
    logger.success(`Dotfile repository directory set to: ${absolutePath}`);
  }
}

export = Cd;
