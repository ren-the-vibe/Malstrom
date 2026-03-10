// App — main entry point, wires rack + cables + compiler + engine together

import { Rack } from './rack.js';
import { CableManager } from './cable.js';
import { Compiler } from './compiler.js';
import { Engine } from './engine.js';
import { MODULE_CATEGORIES, createModule } from './modules/index.js';

class App {
  constructor() {
    this.rack = null;
    this.cables = null;
    this.compiler = null;
    this.engine = null;
    this.autoCompile = true;
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
      await this.engine.initAudio();
      audioStatus.className = 'status-dot on';
      btnInitAudio.textContent = 'Audio Ready';
      btnInitAudio.classList.add('active');
    });

    btnPlay.addEventListener('click', async () => {
      if (!this.engine.isInitialized()) {
        await this.engine.initAudio();
        audioStatus.className = 'status-dot on';
      }
      const code = this._recompile();
      if (code) {
        await this.engine.play(code);
        btnPlay.classList.add('active');
        btnStop.classList.remove('active');
      }
    });

    btnStop.addEventListener('click', async () => {
      await this.engine.stop();
      btnPlay.classList.remove('active');
      btnStop.classList.add('active');
      setTimeout(() => btnStop.classList.remove('active'), 300);
    });

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

        item.addEventListener('click', () => {
          this._addModule(modDef.type);
        });

        catDiv.appendChild(item);
      }

      container.appendChild(catDiv);
    }
  }

  _addModule(type) {
    const module = createModule(type);
    if (!module) return;

    // Wire onChange to recompile
    module.onChange = () => this._recompile();

    this.rack.addModule(module);

    // Refresh cable positions after module is added
    requestAnimationFrame(() => this.cables.refreshPositions());
  }

  _recompile() {
    const code = this.compiler.compile();
    const compiledCodeEl = document.getElementById('compiled-code');
    compiledCodeEl.textContent = code || '(no connections to output)';
    return code;
  }
}

// Boot
const app = new App();
document.addEventListener('DOMContentLoaded', () => app.init());
