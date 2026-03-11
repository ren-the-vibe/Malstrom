// App — main entry point, wires rack + cables + compiler + engine together

import { Rack } from './rack.js';
import { CableManager } from './cable.js';
import { Compiler } from './compiler.js';
import { Engine } from './engine.js';
import { MODULE_CATEGORIES, createModule } from './modules/index.js';
import { loadedPacks } from './modules/sampler.js';
import { parseStrudel, methodToModuleType } from './parser.js';

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
      window.__malstromModules?.delete(module.id);
      this.cables.removeModuleConnections(module.id);
      this._recompile();
    };

    // Wire up channel changes to recompile
    this.rack.onChannelChange = () => {
      this._recompile();
    };

    // Wire up connection changes to recompile
    this.cables.onConnectionChange = () => {
      this._recompile();
    };

    // Build palette sidebar
    this._buildPalette(paletteList);

    // Register global trigger handler for per-note visualization
    this._setupTriggerHandler();

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
        compiledCodeEl.textContent = 'Nothing to play — add modules to a channel';
        compiledCodeEl.classList.add('error');
        return;
      }

      try {
        // Reset trigger counters on all modules
        this._resetAllTriggers();
        await this.engine.play(code);
        btnPlay.classList.add('playing');
        btnPlay.classList.remove('error');
        btnStop.classList.remove('active');
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
      this._resetAllTriggers();
      setTimeout(() => btnStop.classList.remove('active'), 300);
    });

    // BPM wiring
    bpmInput.addEventListener('change', () => {
      const bpm = parseInt(bpmInput.value, 10);
      if (bpm >= 20 && bpm <= 300) this.engine.setBpm(bpm);
    });

    // Channel controls
    document.getElementById('btn-add-channel')?.addEventListener('click', () => {
      const channels = this.rack.getChannels();
      const name = `track${channels.length + 1}`;
      this.rack.addChannel(name);
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

  // ── Trigger Handling ──

  _setupTriggerHandler() {
    window.__malstromTrigger = (hap) => {
      if (!hap || !this.engine.isPlaying()) return;
      const value = hap.value || hap;
      // Flash all registered modules in the active chain
      const modules = window.__malstromModules;
      if (!modules) return;
      for (const [id, mod] of modules) {
        if (mod.flashTrigger) {
          try { mod.flashTrigger(value); } catch (e) { /* ignore flash errors */ }
        }
      }
    };
  }

  _resetAllTriggers() {
    const modules = window.__malstromModules;
    if (!modules) return;
    for (const [id, mod] of modules) {
      if (mod.resetTrigger) mod.resetTrigger();
    }
  }

  // ── Mod Lock ──

  _updateModLocks() {
    const allModules = this.rack.getAllModules();
    for (const mod of allModules) {
      // Check if this module has a 'mod' (or 'cutoffMod') input with a cable connected
      const modInputNames = mod.inputs
        .filter(i => i.name === 'mod' || i.name === 'cutoffMod')
        .map(i => i.name);

      const hasModCable = modInputNames.some(name =>
        this.cables.getSourceModule(mod.id, name) !== null
      );

      if (mod.setModLocked) {
        mod.setModLocked(hasModCable);
      }
    }
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
        if (modDef.desc) item.title = modDef.desc;

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

  _addModule(type, channelId = null) {
    const module = createModule(type);
    if (!module) return;
    module.onChange = () => this._recompile();
    module._onDragEnd = () => this.cables.refreshPositions();
    this.rack.addModule(module, channelId);
    requestAnimationFrame(() => this.cables.refreshPositions());
    return module;
  }

  _addModuleToMain(type) {
    const module = createModule(type);
    if (!module) return;
    module.onChange = () => this._recompile();
    module._onDragEnd = () => this.cables.refreshPositions();
    this.rack.addModuleToMain(module);
    requestAnimationFrame(() => this.cables.refreshPositions());
    return module;
  }

  _recompile() {
    const code = this.compiler.compile();
    const compiledCodeEl = document.getElementById('compiled-code');
    compiledCodeEl.classList.remove('error');
    compiledCodeEl.textContent = code || '(no connections to output)';
    this._updateCodePreview(code);

    // Live re-evaluation: if already playing, update the running pattern
    if (this.engine.isPlaying() && code) {
      this.engine.play(code).catch(err => {
        console.warn('[Malstrom] Live update failed:', err.message);
      });
    }

    // Update mod-locked knob states
    this._updateModLocks();

    return code;
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
    const rackState = this.rack.getProjectState();
    return { modules, connections, sampleImports, ...rackState };
  }

  async _saveProject() {
    if (!window.malstrom?.saveProject) {
      const compiledCodeEl = document.getElementById('compiled-code');
      compiledCodeEl.textContent = 'Save not available — IPC not ready';
      compiledCodeEl.classList.add('error');
      return;
    }
    const state = this._getProjectState();
    const code = this._recompile() || '';
    const result = await window.malstrom.saveProject({ state, code });
    if (!result.canceled) {
      const compiledCodeEl = document.getElementById('compiled-code');
      compiledCodeEl.textContent = `Saved to ${result.filePath}`;
    }
  }

  async _loadProject() {
    if (!window.malstrom?.loadProject) {
      const compiledCodeEl = document.getElementById('compiled-code');
      compiledCodeEl.textContent = 'Load not available — IPC not ready';
      compiledCodeEl.classList.add('error');
      return;
    }

    let result;
    try {
      result = await window.malstrom.loadProject();
    } catch (err) {
      console.error('[Malstrom] loadProject IPC error:', err);
      const compiledCodeEl = document.getElementById('compiled-code');
      compiledCodeEl.textContent = `Load error: ${err.message}`;
      compiledCodeEl.classList.add('error');
      return;
    }
    if (result.canceled) return;

    // Stop playback
    await this.engine.stop();
    document.getElementById('btn-play').classList.remove('playing', 'error');
    this._resetAllTriggers();

    // Check if this is a plain strudel code file (no frontmatter)
    if (result.plainStrudel) {
      this._handlePlainStrudel(result.code);
      return;
    }

    console.log('[Malstrom] Restoring project:', result.state.modules?.length, 'modules,', result.state.connections?.length, 'connections');

    // Clear current state
    this.rack.clear();

    // Restore sample imports
    if (result.state.sampleImports) {
      for (const imp of result.state.sampleImports) {
        this.engine.addSampleImport(imp);
      }
      this._refreshImportList();
    }

    // Restore channels if present (new format)
    if (result.state.channels) {
      this._loadProjectWithChannels(result.state);
    } else {
      // Legacy format: all modules in one channel
      this._loadProjectLegacy(result.state);
    }
  }

  _loadProjectWithChannels(state) {
    const idMap = {};

    // Recreate channels
    for (const chConfig of state.channels) {
      const channel = this.rack.addChannel(chConfig.name);
      channel.restoreConfig(chConfig);

      // Create modules for this channel
      for (const modId of chConfig.moduleIds) {
        const modConfig = state.modules.find(m => m.id === modId);
        if (!modConfig) continue;

        const module = createModule(modConfig.type);
        if (!module) {
          console.warn('[Malstrom] Unknown module type:', modConfig.type);
          continue;
        }
        module.onChange = () => this._recompile();
        module._onDragEnd = () => this.cables.refreshPositions();
        this.rack.addModule(module, channel.id);
        idMap[modConfig.id] = module.id;
        module.restoreConfig(modConfig);
      }
    }

    // Restore main channel global effects
    if (state.mainChannel?.globalEffectModuleIds) {
      for (const modId of state.mainChannel.globalEffectModuleIds) {
        const modConfig = state.modules.find(m => m.id === modId);
        if (!modConfig) continue;
        const module = createModule(modConfig.type);
        if (!module) continue;
        module.onChange = () => this._recompile();
        module._onDragEnd = () => this.cables.refreshPositions();
        this.rack.addModuleToMain(module);
        idMap[modConfig.id] = module.id;
        module.restoreConfig(modConfig);
      }
    }

    // Restore connections
    requestAnimationFrame(() => {
      for (const conn of state.connections) {
        const fromId = idMap[conn.from.moduleId];
        const toId = idMap[conn.to.moduleId];
        if (!fromId || !toId) continue;
        this.cables.addConnection(fromId, conn.from.jackName, toId, conn.to.jackName);
      }
      this._recompile();
    });
  }

  _loadProjectLegacy(state) {
    // Old format: load all modules into the first channel
    const idMap = {};
    for (const modConfig of state.modules) {
      const module = createModule(modConfig.type);
      if (!module) {
        console.warn('[Malstrom] Unknown module type:', modConfig.type);
        continue;
      }
      module.onChange = () => this._recompile();
      module._onDragEnd = () => this.cables.refreshPositions();
      this.rack.addModule(module);
      idMap[modConfig.id] = module.id;
      module.restoreConfig(modConfig);
    }

    // Restore connections after DOM settles
    requestAnimationFrame(() => {
      for (const conn of state.connections) {
        const fromId = idMap[conn.from.moduleId];
        const toId = idMap[conn.to.moduleId];
        if (!fromId || !toId) continue;
        this.cables.addConnection(fromId, conn.from.jackName, toId, conn.to.jackName);
      }
      this._recompile();
    });
  }

  // ── Strudel Import ──

  _handlePlainStrudel(code) {
    const compiledCodeEl = document.getElementById('compiled-code');

    let parsed;
    try {
      parsed = parseStrudel(code);
    } catch (err) {
      compiledCodeEl.textContent = `Parse error: ${err.message}`;
      compiledCodeEl.classList.add('error');
      return;
    }

    // Clear current state
    this.rack.clear();

    // Add sample imports
    for (const imp of parsed.sampleImports) {
      this.engine.addSampleImport(imp);
    }
    this._refreshImportList();

    // Set BPM from cps
    if (parsed.cps) {
      const bpm = Math.round(parsed.cps * 60 * 4);
      const bpmInput = document.getElementById('bpm');
      if (bpmInput) bpmInput.value = bpm;
      this.engine.setBpm(bpm);
    }

    // Create channels from tracks
    for (const track of parsed.tracks) {
      const channel = this.rack.addChannel(track.name);
      let prevModule = null;

      for (const method of track.chain) {
        const module = this._createModuleFromMethod(method);
        if (!module) continue;

        module.onChange = () => this._recompile();
        module._onDragEnd = () => this.cables.refreshPositions();
        this.rack.addModule(module, channel.id);

        // Auto-connect in chain: previous out → this in
        if (prevModule && module.inputs.length > 0) {
          requestAnimationFrame(() => {
            this.cables.addConnection(prevModule.id, 'out', module.id, 'in');
          });
        }

        // Handle mod input from complex args
        if (method.modCode && module.inputs.some(i => i.name === 'mod')) {
          const modModule = this._createCodeModule(method.modCode);
          if (modModule) {
            modModule.onChange = () => this._recompile();
            modModule._onDragEnd = () => this.cables.refreshPositions();
            this.rack.addModule(modModule, channel.id);
            requestAnimationFrame(() => {
              this.cables.addConnection(modModule.id, 'out', module.id, 'mod');
            });
          }
        }

        prevModule = module;
      }
    }

    // Add preamble lines as Code modules in main channel if they contain meaningful code
    for (const line of parsed.preamble) {
      const mod = this._createCodeModule(line);
      if (mod) {
        mod.onChange = () => this._recompile();
        this.rack.addModuleToMain(mod);
      }
    }

    // Update UI
    requestAnimationFrame(() => {
      this.cables.refreshPositions();
      this._recompile();
    });

    compiledCodeEl.textContent = `Imported: ${parsed.tracks.length} track(s), ${parsed.sampleImports.length} sample import(s)`;

    // Show code preview
    const previewEl = document.getElementById('code-preview');
    if (previewEl) {
      previewEl.textContent = '// Original strudel code:\n' + code;
    }
    const panel = document.getElementById('code-panel');
    if (panel) {
      panel.classList.remove('collapsed');
      const toggleBtn = document.getElementById('btn-toggle-code');
      if (toggleBtn) toggleBtn.innerHTML = 'Strudel Code &#9660;';
    }
  }

  _createModuleFromMethod(method) {
    // Try to match method name to a known module type
    const moduleType = methodToModuleType(method.method);

    if (moduleType) {
      const module = createModule(moduleType);
      if (module) {
        // Try to set knob/select values from parsed args
        this._applyMethodArgs(module, method);
        return module;
      }
    }

    // Fallback: create a Code module with the raw strudel text
    return this._createCodeModule(method.raw);
  }

  _createCodeModule(codeText) {
    if (!codeText || !codeText.trim()) return null;
    const module = createModule('code');
    if (!module) return null;
    // Set the code text after render (restoreConfig will handle it)
    module._pendingCode = codeText.trim();
    const origRender = module.renderBody.bind(module);
    module.renderBody = function() {
      const el = origRender();
      if (this._pendingCode && this.textInputs.code) {
        this.textInputs.code.value = this._pendingCode;
        delete this._pendingCode;
      }
      return el;
    };
    return module;
  }

  _applyMethodArgs(module, method) {
    if (!method.args) return;
    const args = method.args.trim();
    if (!args) return;

    // For simple numeric args, try to set the first knob
    const numVal = parseFloat(args);
    if (!isNaN(numVal)) {
      const knobNames = Object.keys(module.knobs);
      if (knobNames.length > 0) {
        module.knobs[knobNames[0]].value = numVal;
      }
      return;
    }

    // For string args like "bd" or "sawtooth", try to set a select or text input
    const strMatch = args.match(/^["'](.+?)["']$/);
    if (strMatch) {
      const val = strMatch[1];
      const selectNames = Object.keys(module.selects);
      if (selectNames.length > 0) {
        module.selects[selectNames[0]].value = val;
      }
      const textNames = Object.keys(module.textInputs);
      if (textNames.length > 0) {
        module.textInputs[textNames[0]].value = val;
      }
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

    this._importListEl = importList;

    const closeModal = () => modal.classList.remove('visible');
    btnClose.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

    btnSamples.addEventListener('click', () => {
      modal.classList.add('visible');
      if (iframe.src === 'about:blank') {
        iframe.src = ALTERNET_URL;
      }
      this._renderImportList(importList);
    });

    const addImport = () => {
      const code = importInput.value.trim();
      if (!code) return;
      this.engine.addSampleImport(code);
      importInput.value = '';
      this._renderImportList(importList);
      this._recompile();
      // Fetch sample names for Sampler module integration
      this._fetchPackSamples(code);
    };

    btnAdd.addEventListener('click', addImport);
    importInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') addImport();
    });

    btnReload.addEventListener('click', () => {
      iframe.src = ALTERNET_URL;
    });
  }

  // Parse pack name from import code and fetch its strudel.json
  async _fetchPackSamples(importCode) {
    const packName = this._parsePackName(importCode);
    if (!packName) return;

    try {
      const firstSegment = packName.split('/')[0];
      let url;
      if (firstSegment.includes('.')) {
        url = `https://${packName}/strudel.json`;
      } else {
        url = `https://raw.githubusercontent.com/${packName}/refs/heads/main/strudel.json`;
      }
      const resp = await fetch(url);
      if (!resp.ok) return;
      const data = await resp.json();
      const sampleNames = Object.keys(data).filter(k => !k.startsWith('_'));
      if (sampleNames.length > 0) {
        loadedPacks.set(packName, sampleNames);
        document.dispatchEvent(new CustomEvent('malstrom:samples-updated'));
      }
    } catch {
      // Silently ignore fetch failures
    }
  }

  _parsePackName(importCode) {
    // Extract pack name from: samples('github:user/repo') or samples('https://domain/path')
    const match = importCode.match(/samples\s*\(\s*['"](?:github:)?([^'"]+)['"]\s*\)/);
    if (!match) return null;
    let name = match[1];
    // Strip trailing /strudel.json if present
    name = name.replace(/\/strudel\.json$/, '');
    // Strip https:// prefix
    name = name.replace(/^https?:\/\//, '');
    return name;
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
