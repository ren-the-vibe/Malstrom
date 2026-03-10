const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

let yaml;
try {
  yaml = require('js-yaml');
} catch (e) {
  // js-yaml not installed yet — save/load will use JSON fallback
  yaml = null;
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 600,
    backgroundColor: '#1a1a2e',
    title: 'Malstrom',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  win.loadFile('src/index.html');
}

// ── IPC: Save Project ──
ipcMain.handle('save-project', async (event, projectData) => {
  const { canceled, filePath } = await dialog.showSaveDialog({
    title: 'Save Malstrom Project',
    defaultPath: 'untitled.mus',
    filters: [{ name: 'Malstrom Project', extensions: ['mus'] }]
  });
  if (canceled || !filePath) return { canceled: true };

  let header;
  if (yaml) {
    header = yaml.dump(projectData.state, { lineWidth: 120 });
  } else {
    header = JSON.stringify(projectData.state, null, 2);
  }
  const content = header + '---\n' + (projectData.code || '');
  fs.writeFileSync(filePath, content, 'utf8');
  return { canceled: false, filePath };
});

// ── IPC: Load Project ──
ipcMain.handle('load-project', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    title: 'Open Malstrom Project',
    filters: [{ name: 'Malstrom Project', extensions: ['mus'] }],
    properties: ['openFile']
  });
  if (canceled || filePaths.length === 0) return { canceled: true };

  const content = fs.readFileSync(filePaths[0], 'utf8');
  const sepIndex = content.indexOf('\n---\n');
  let state, code;
  if (sepIndex !== -1) {
    const headerStr = content.substring(0, sepIndex);
    code = content.substring(sepIndex + 5);
    if (yaml) {
      state = yaml.load(headerStr);
    } else {
      state = JSON.parse(headerStr);
    }
  } else {
    if (yaml) {
      state = yaml.load(content);
    } else {
      state = JSON.parse(content);
    }
    code = '';
  }
  return { canceled: false, state, code, filePath: filePaths[0] };
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
