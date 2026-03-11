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

  // Try to parse as JSON/YAML project state
  let state, code;

  // First attempt: look for YAML frontmatter with --- separator
  const sepIndex = content.indexOf('\n---\n');
  if (sepIndex !== -1) {
    const headerStr = content.substring(0, sepIndex);
    code = content.substring(sepIndex + 5);
    try {
      state = yaml ? yaml.load(headerStr) : JSON.parse(headerStr);
    } catch (e) {
      console.error('[Malstrom] Failed to parse header before ---:', e.message);
      state = null;
    }
  }

  // Second attempt: try parsing the whole file as JSON/YAML (no separator)
  if (!state || !Array.isArray(state.modules)) {
    try {
      state = yaml ? yaml.load(content) : JSON.parse(content);
      code = '';
    } catch (e) {
      // Not valid YAML/JSON — treat as plain strudel code
      console.log('[Malstrom] File is not JSON/YAML, treating as plain strudel');
      return { canceled: false, plainStrudel: true, code: content, filePath: filePaths[0] };
    }
  }

  // Validate that state has a modules array
  if (!state || !Array.isArray(state.modules)) {
    console.log('[Malstrom] Parsed state has no modules array, treating as plain strudel');
    return { canceled: false, plainStrudel: true, code: content, filePath: filePaths[0] };
  }

  console.log('[Malstrom] Loaded project with', state.modules.length, 'modules');
  return { canceled: false, state, code, filePath: filePaths[0] };
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
