const { app, BrowserWindow, ipcMain, dialog, Menu } = require('electron');
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
  // Hide Electron default menu
  Menu.setApplicationMenu(null);

  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 600,
    backgroundColor: '#1a1a2e',
    title: 'Malstrom',
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
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
    try {
      if (yaml) {
        state = yaml.load(headerStr);
      } else {
        state = JSON.parse(headerStr);
      }
    } catch (e) {
      // Header didn't parse — treat entire file as plain strudel code
      return { canceled: false, plainStrudel: true, code: content, filePath: filePaths[0] };
    }
  } else {
    // No separator — try to parse as state (YAML/JSON), fall back to plain strudel
    try {
      if (yaml) {
        state = yaml.load(content);
      } else {
        state = JSON.parse(content);
      }
      // Must have a modules array to be a valid project
      if (!state || !Array.isArray(state.modules)) {
        return { canceled: false, plainStrudel: true, code: content, filePath: filePaths[0] };
      }
    } catch (e) {
      // Not valid YAML/JSON — treat as plain strudel code
      return { canceled: false, plainStrudel: true, code: content, filePath: filePaths[0] };
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
