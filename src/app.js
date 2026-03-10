// App — main entry point, wires rack + cables + compiler + engine together

import { Rack } from './rack.js';
import { CableManager } from './cable.js';
import { Compiler } from './compiler.js';
import { Engine } from './engine.js';
import { MODULE_CATEGORIES, createModule } from './modules/index.js';
import { loadedPacks } from './modules/sampler.js';

const SAMPLE_CDN_JSON = 'https://raw.githubusercontent.com/tidalcycles/Dirt-Samples/master/strudel.json';

class App {
  constructor() {
    this.rack = null;
    this.cables = null;
    this.compiler = null;
    this.engine = null;
    this._sampleIndex = null; // cached strudel.json
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

  // ── Save / Load ──

  _getProjectState() {
    const modules = this.rack.getAllModules().map(m => m.getConfig());
    const connections = this.cables.connections.map(c => ({
      from: { moduleId: c.from.moduleId, jackName: c.from.jackName },
      to: { moduleId: c.to.moduleId, jackName: c.to.jackName }
    }));
    return { modules, connections };
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

    // Clear current state
    this.rack.clear();

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

  // ── Sample Browser ──

  _initSampleBrowser() {
    const modal = document.getElementById('sample-browser-modal');
    const btnSamples = document.getElementById('btn-samples');
    if (!modal || !btnSamples) return;

    const overlay = modal;
    const searchInput = modal.querySelector('.sb-search');
    const packList = modal.querySelector('.sb-pack-list');
    const sampleList = modal.querySelector('.sb-sample-list');
    const packTitle = modal.querySelector('.sb-pack-title');
    const btnLoad = modal.querySelector('.sb-load-btn');
    const btnClose = modal.querySelector('.sb-close');

    let selectedPack = null;
    let currentAudio = null;

    btnSamples.addEventListener('click', async () => {
      modal.classList.add('visible');
      if (!this._sampleIndex) {
        packList.innerHTML = '<div class="sb-loading">Loading sample index...</div>';
        try {
          const resp = await fetch(SAMPLE_CDN_JSON);
          if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
          const data = await resp.json();
          // Extract _base URL for sample audio preview
          this._sampleBase = data._base || SAMPLE_CDN_JSON.replace(/strudel\.json$/, '');
          // Filter out metadata keys
          this._sampleIndex = {};
          for (const [k, v] of Object.entries(data)) {
            if (!k.startsWith('_')) this._sampleIndex[k] = v;
          }
        } catch (err) {
          packList.innerHTML = `<div class="sb-loading">Failed to load sample index: ${err.message}</div>`;
          return;
        }
      }
      renderPacks('');
    });

    btnClose.addEventListener('click', () => {
      modal.classList.remove('visible');
      if (currentAudio) { currentAudio.pause(); currentAudio = null; }
    });

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        modal.classList.remove('visible');
        if (currentAudio) { currentAudio.pause(); currentAudio = null; }
      }
    });

    searchInput?.addEventListener('input', () => renderPacks(searchInput.value));

    const renderPacks = (filter) => {
      packList.innerHTML = '';
      if (!this._sampleIndex) return;
      const names = Object.keys(this._sampleIndex)
        .filter(n => !filter || n.toLowerCase().includes(filter.toLowerCase()))
        .sort();
      for (const name of names) {
        const item = document.createElement('div');
        item.className = 'sb-pack-item';
        item.textContent = name;
        if (loadedPacks.has(name)) item.classList.add('loaded');
        item.addEventListener('click', () => {
          packList.querySelectorAll('.sb-pack-item').forEach(el => el.classList.remove('selected'));
          item.classList.add('selected');
          selectedPack = name;
          renderSamples(name);
        });
        packList.appendChild(item);
      }
    };

    const renderSamples = (packName) => {
      sampleList.innerHTML = '';
      packTitle.textContent = packName;
      const samples = this._sampleIndex[packName];
      if (!samples) return;

      // samples can be an object (key -> array of URLs) or an array
      const entries = typeof samples === 'object' && !Array.isArray(samples)
        ? Object.entries(samples)
        : [['samples', Array.isArray(samples) ? samples : [samples]]];

      for (const [key, urls] of entries) {
        const urlList = Array.isArray(urls) ? urls : [urls];
        for (const url of urlList) {
          const filename = typeof url === 'string' ? url.split('/').pop() : String(url);
          const item = document.createElement('div');
          item.className = 'sb-sample-item';

          const nameEl = document.createElement('span');
          nameEl.textContent = key !== 'samples' ? `${key}: ${filename}` : filename;
          item.appendChild(nameEl);

          const previewBtn = document.createElement('button');
          previewBtn.className = 'sb-preview-btn';
          previewBtn.textContent = '\u25B6';
          previewBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (currentAudio) { currentAudio.pause(); currentAudio = null; }
            const audioUrl = typeof url === 'string' && url.startsWith('http')
              ? url
              : `${this._sampleBase}${url}`;
            currentAudio = new Audio(audioUrl);
            currentAudio.play().catch(() => {});
          });
          item.appendChild(previewBtn);

          sampleList.appendChild(item);
        }
      }
    };

    btnLoad?.addEventListener('click', () => {
      if (!selectedPack || !this._sampleIndex[selectedPack]) return;

      // Register pack with sampler modules
      const samples = this._sampleIndex[selectedPack];
      let sampleNames;
      if (typeof samples === 'object' && !Array.isArray(samples)) {
        sampleNames = Object.keys(samples);
      } else {
        sampleNames = [selectedPack];
      }
      loadedPacks.set(selectedPack, sampleNames);
      this.engine.enableCdnSamples();

      // Notify sampler modules
      document.dispatchEvent(new CustomEvent('malstrom:samples-updated'));

      // Mark as loaded in UI
      packList.querySelectorAll('.sb-pack-item').forEach(el => {
        if (el.textContent === selectedPack) el.classList.add('loaded');
      });
    });
  }
}

// Boot
const app = new App();
document.addEventListener('DOMContentLoaded', () => app.init());
