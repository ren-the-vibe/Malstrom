// App — main entry point, wires rack + cables + compiler + engine together

import { Rack } from './rack.js';
import { CableManager } from './cable.js';
import { Compiler } from './compiler.js';
import { Engine } from './engine.js';
import { MODULE_CATEGORIES, createModule } from './modules/index.js';
import { loadedPacks } from './modules/sampler.js';

const ALTERNET_URL = 'https://strudel-samples.alternet.site';

class App {
  constructor() {
    this.rack = null;
    this.cables = null;
    this.compiler = null;
    this.engine = null;
  }

  init() {
    // DOM elements
    const rackEl = document.getElementById('rack');
    const cablesEl = document.getElementById('cables');
    const rackContainer = document.getElementById('rack-container');
    const paletteList = document.getElementById('palette-list');
    const btnPlay = document.getElementById('btn-play');
    const btnStop = document.getElementById('btn-stop');
    const btnInitAudio = document.getElementById('btn-init-audio');
    const audioStatus = document.getElementById('audio-status');
    const compiledCodeEl = document.getElementById('compiled-code');
    const bpmInput = document.getElementById('bpm');

    // Initialize systems
    this.rack = new Rack(rackEl);
    this.cables = new CableManager(cablesEl, rackContainer);
    this.engine = new Engine();
    this.compiler = new Compiler(this.rack, this.cables);

    // Wire up module removal to cable cleanup
    this.rack.onModuleRemoved = (module) => {
      this.cables.removeModuleConnections(module.id);
      this._recompile();
    };

    // Wire up connection changes to recompile
    this.cables.onConnectionChange = () => {
      this._recompile();
    };

    // Build palette sidebar
    this._buildPalette(paletteList);

    // Transport controls
    btnInitAudio.addEventListener('click', async () => {
      try {
        await this.engine.initAudio();
        audioStatus.className = 'status-dot on';
        btnInitAudio.textContent = 'Audio Ready';
        btnInitAudio.classList.add('active');
      } catch (err) {
        compiledCodeEl.textContent = `Audio init error: ${err.message}`;
        compiledCodeEl.classList.add('error');
        console.error('Audio init failed:', err);
      }
    });

    btnPlay.addEventListener('click', async () => {
      compiledCodeEl.classList.remove('error');
      btnPlay.classList.remove('error');

      try {
        if (!this.engine.isInitialized()) {
          compiledCodeEl.textContent = 'Initializing Strudel...';
          await this.engine.initAudio();
          audioStatus.className = 'status-dot on';
          btnInitAudio.textContent = 'Audio Ready';
          btnInitAudio.classList.add('active');
        }
      } catch (err) {
        btnPlay.classList.add('error');
        compiledCodeEl.textContent = `Engine init error: ${err.message}`;
        compiledCodeEl.classList.add('error');
        console.error('Engine init failed:', err);
        return;
      }

      const code = this._recompile();

      if (!code) {
        compiledCodeEl.textContent = 'Nothing to play — connect modules to an Output';
        compiledCodeEl.classList.add('error');
        return;
      }

      try {
        await this.engine.play(code);
        btnPlay.classList.add('playing');
        btnPlay.classList.remove('error');
        btnStop.classList.remove('active');
        this._setModulesActive(true);
      } catch (err) {
        btnPlay.classList.remove('playing');
        btnPlay.classList.add('error');
        compiledCodeEl.textContent = `Error: ${err.message}`;
        compiledCodeEl.classList.add('error');
        console.error('Play failed:', err);
        setTimeout(() => {
          btnPlay.classList.remove('error');
          compiledCodeEl.classList.remove('error');
        }, 6000);
      }
    });

    btnStop.addEventListener('click', async () => {
      await this.engine.stop();
      btnPlay.classList.remove('playing', 'error');
      btnStop.classList.add('active');
      this._setModulesActive(false);
      setTimeout(() => btnStop.classList.remove('active'), 300);
    });

    // BPM wiring
    bpmInput.addEventListener('change', () => {
      const bpm = parseInt(bpmInput.value, 10);
      if (bpm >= 20 && bpm <= 300) this.engine.setBpm(bpm);
    });

    // Save / Load
    document.getElementById('btn-save')?.addEventListener('click', () => this._saveProject());
    document.getElementById('btn-load')?.addEventListener('click', () => this._loadProject());

    // Sample browser
    this._initSampleBrowser();

    // Code preview panel
    this._initCodePanel();

    // Refresh cable positions on scroll/resize
    rackContainer.addEventListener('scroll', () => this.cables.refreshPositions());
    window.addEventListener('resize', () => this.cables.refreshPositions());

    // Periodic cable refresh (catches layout shifts from module content changes)
    setInterval(() => {
      if (this.cables.connections.length > 0) {
        this.cables.refreshPositions();
      }
    }, 500);
  }

  // ── Palette ──

  _buildPalette(container) {
    for (const category of MODULE_CATEGORIES) {
      const catDiv = document.createElement('div');
      catDiv.className = `palette-category ${category.cssClass}`;

      const title = document.createElement('div');
      title.className = 'palette-category-title';
      title.textContent = category.name;
      catDiv.appendChild(title);

      for (const modDef of category.modules) {
        const item = document.createElement('div');
        item.className = `palette-item ${category.cssClass}`;

        const dot = document.createElement('span');
        dot.className = 'dot';
        item.appendChild(dot);

        const label = document.createElement('span');
        label.textContent = modDef.label;
        item.appendChild(label);

        item.addEventListener('click', () => this._addModule(modDef.type));
        catDiv.appendChild(item);
      }

      container.appendChild(catDiv);
    }
  }

  _addModule(type) {
    const module = createModule(type);
    if (!module) return;
    module.onChange = () => this._recompile();
    this.rack.addModule(module);
    requestAnimationFrame(() => this.cables.refreshPositions());
    return module;
  }

  _recompile() {
    const code = this.compiler.compile();
    const compiledCodeEl = document.getElementById('compiled-code');
    compiledCodeEl.classList.remove('error');
    compiledCodeEl.textContent = code || '(no connections to output)';
    this._updateCodePreview(code);
    return code;
  }

  // Highlight modules in the active signal chain when playing
  _setModulesActive(active) {
    const allModules = this.rack.getAllModules();
    if (!active) {
      allModules.forEach(m => m.el?.classList.remove('active'));
      return;
    }
    // Find modules connected to the output chain
    const connectedIds = new Set();
    const terminals = allModules.filter(m => m.type === 'output');
    const visit = (moduleId) => {
      if (connectedIds.has(moduleId)) return;
      connectedIds.add(moduleId);
      const inputs = this.cables.getInputConnections(moduleId);
      for (const conn of inputs) {
        visit(conn.from.moduleId);
      }
    };
    for (const t of terminals) visit(t.id);
    allModules.forEach(m => {
      m.el?.classList.toggle('active', connectedIds.has(m.id));
    });
  }

  // ── Code Preview Panel ──

  _initCodePanel() {
    const panel = document.getElementById('code-panel');
    const toggleBtn = document.getElementById('btn-toggle-code');
    if (!panel || !toggleBtn) return;

    toggleBtn.addEventListener('click', () => {
      panel.classList.toggle('collapsed');
      toggleBtn.innerHTML = panel.classList.contains('collapsed')
        ? 'Strudel Code &#9650;'
        : 'Strudel Code &#9660;';
    });
  }

  _updateCodePreview(moduleCode) {
    const previewEl = document.getElementById('code-preview');
    const statusEl = document.getElementById('code-panel-status');
    if (!previewEl) return;

    // Build full code: sample imports + module code
    const imports = this.engine.getSampleImports();
    let fullCode = '';
    if (imports.length > 0) {
      fullCode = imports.map(s => `await ${s}`).join('\n') + '\n\n';
    }
    fullCode += moduleCode || '// (no connections to output)';

    previewEl.textContent = fullCode;
    if (statusEl) {
      statusEl.textContent = imports.length > 0 ? `${imports.length} sample import(s)` : '';
    }
  }

  // ── Save / Load ──

  _getProjectState() {
    const modules = this.rack.getAllModules().map(m => m.getConfig());
    const connections = this.cables.connections.map(c => ({
      from: { moduleId: c.from.moduleId, jackName: c.from.jackName },
      to: { moduleId: c.to.moduleId, jackName: c.to.jackName }
    }));
    const sampleImports = this.engine.getSampleImports();
    return { modules, connections, sampleImports };
  }

  async _saveProject() {
    if (!window.malstrom?.saveProject) {
      console.warn('Save not available (no IPC)');
      return;
    }
    const state = this._getProjectState();
    const code = this._recompile() || '';
    await window.malstrom.saveProject({ state, code });
  }

  async _loadProject() {
    if (!window.malstrom?.loadProject) {
      console.warn('Load not available (no IPC)');
      return;
    }
    const result = await window.malstrom.loadProject();
    if (result.canceled) return;

    // Stop playback
    await this.engine.stop();
    document.getElementById('btn-play').classList.remove('playing', 'error');

    // Check if this is a plain strudel code file (no frontmatter)
    if (result.plainStrudel) {
      this._handlePlainStrudel(result.code);
      return;
    }

    // Clear current state
    this.rack.clear();

    // Restore sample imports
    if (result.state.sampleImports) {
      for (const imp of result.state.sampleImports) {
        this.engine.addSampleImport(imp);
      }
      this._refreshImportList();
    }

    // Rebuild with ID mapping
    const idMap = {};
    for (const modConfig of result.state.modules) {
      const module = createModule(modConfig.type);
      if (!module) continue;
      module.onChange = () => this._recompile();
      this.rack.addModule(module);
      idMap[modConfig.id] = module.id;
      module.restoreConfig(modConfig);
    }

    // Restore connections after DOM settles
    requestAnimationFrame(() => {
      for (const conn of result.state.connections) {
        const fromId = idMap[conn.from.moduleId];
        const toId = idMap[conn.to.moduleId];
        if (!fromId || !toId) continue;
        this.cables.addConnection(fromId, conn.from.jackName, toId, conn.to.jackName);
      }
      this._recompile();
    });
  }

  _handlePlainStrudel(code) {
    // For now, show a clear error - this can be refined later
    const compiledCodeEl = document.getElementById('compiled-code');
    compiledCodeEl.textContent = "CAN'T PARSE THIS STRUDEL INTO MALSTROM — file contains raw strudel code without module configuration";
    compiledCodeEl.classList.add('error');

    // Show the code in the preview panel so the user can see it
    const previewEl = document.getElementById('code-preview');
    if (previewEl) {
      previewEl.textContent = '// Imported strudel code (cannot decompose into modules):\n' + code;
    }
    const panel = document.getElementById('code-panel');
    if (panel) {
      panel.classList.remove('collapsed');
      const toggleBtn = document.getElementById('btn-toggle-code');
      if (toggleBtn) toggleBtn.innerHTML = 'Strudel Code &#9660;';
    }
  }

  // ── Sample Browser ──

  _initSampleBrowser() {
    const modal = document.getElementById('sample-browser-modal');
    const btnSamples = document.getElementById('btn-samples');
    if (!modal || !btnSamples) return;

    const btnClose = modal.querySelector('.sb-close');
    const importInput = modal.querySelector('.sb-import-input');
    const btnAdd = modal.querySelector('.sb-add-btn');
    const importList = modal.querySelector('.sb-import-list');
    const iframe = modal.querySelector('.sb-iframe');
    const btnReload = modal.querySelector('.sb-browse-reload');

    // Store reference for external refresh
    this._importListEl = importList;

    // Close modal
    const closeModal = () => modal.classList.remove('visible');
    btnClose.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

    // Open modal
    btnSamples.addEventListener('click', () => {
      modal.classList.add('visible');
      // Load iframe on first open
      if (iframe.src === 'about:blank') {
        iframe.src = ALTERNET_URL;
      }
      this._renderImportList(importList);
    });

    // Add import code
    const addImport = () => {
      const code = importInput.value.trim();
      if (!code) return;
      this.engine.addSampleImport(code);
      importInput.value = '';
      this._renderImportList(importList);
      this._recompile();
    };

    btnAdd.addEventListener('click', addImport);
    importInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') addImport();
    });

    // Reload iframe
    btnReload.addEventListener('click', () => {
      iframe.src = ALTERNET_URL;
    });
  }

  _renderImportList(container) {
    if (!container) container = this._importListEl;
    if (!container) return;
    container.innerHTML = '';

    const imports = this.engine.getSampleImports();
    if (imports.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'sb-import-empty';
      empty.textContent = 'No sample imports yet';
      container.appendChild(empty);
      return;
    }

    for (const imp of imports) {
      const item = document.createElement('div');
      item.className = 'sb-import-item';

      const codeEl = document.createElement('code');
      codeEl.className = 'sb-import-code';
      codeEl.textContent = imp;
      item.appendChild(codeEl);

      const btnRemove = document.createElement('button');
      btnRemove.className = 'sb-import-remove';
      btnRemove.textContent = '\u00d7';
      btnRemove.title = 'Remove';
      btnRemove.addEventListener('click', () => {
        this.engine.removeSampleImport(imp);
        this._renderImportList(container);
        this._recompile();
      });
      item.appendChild(btnRemove);

      container.appendChild(item);
    }
  }

  _refreshImportList() {
    this._renderImportList(this._importListEl);
  }
}

// Boot
const app = new App();
document.addEventListener('DOMContentLoaded', () => app.init());
