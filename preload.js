const { contextBridge } = require('electron');
const path = require('path');

contextBridge.exposeInMainWorld('malstrom', {
  platform: process.platform,
  version: require('./package.json').version,
  strudelPath: path.join(__dirname, 'node_modules', '@strudel', 'web', 'dist', 'index.mjs')
});
