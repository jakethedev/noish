var path = require('path');

module.exports = {
  entry: './noish.js',
  target: 'node',
  mode: 'production',
  output: {
    path: path.join(__dirname, 'bin'),
    filename: 'noish'
  }
}
