const { contextBridge, ipcRenderer } = require('electron');
const path = require('path');

contextBridge.exposeInMainWorld('malstrom', {
  platform: process.platform,
  version: require('./package.json').version,
  strudelPath: path.join(__dirname, 'node_modules', '@strudel', 'web', 'dist', 'index.mjs'),
  saveProject: (data) => ipcRenderer.invoke('save-project', data),
  loadProject: () => ipcRenderer.invoke('load-project')
});
