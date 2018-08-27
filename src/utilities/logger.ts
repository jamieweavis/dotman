const { Signale } = require('signale');
const pkg = require('../../package.json');

const logger = new Signale({
  scope: pkg.name,
});

export default logger;
