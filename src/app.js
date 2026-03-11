// App — main entry point, wires rack + cables + compiler + engine together

import { Rack } from './rack.js';
import { CableManager } from './cable.js';
import { Compiler } from './compiler.js';
import { Engine } from './engine.js';
import { MODULE_CATEGORIES, createModule } from './modules/index.js';
import { loadedPacks } from './modules/sampler.js';

const ALTERNET_URL = 'https://strudel-samples.alternet.site';

// Embedded snapshot of strudel-samples.alternet.site pack list (fallback when Cloudflare blocks fetch)
const EMBEDDED_PACKS = [
  ['strudel.cc/tidal-drum-machines', 683], ['strudel.cc/vcsl', 128], ['strudel.cc/uzu-drumkit', 16],
  ['strudel.cc/mridangam', 13], ['strudel.cc/piano', 1], ['samples.grbt.com.au', 629],
  ['sonidosingapura/blu-mar-ten/Breaks', 448], ['sonidosingapura/blu-mar-ten/Riffs_Arps_Hits', 260],
  ['sonidosingapura/blu-mar-ten/FX', 240], ['tidalcycles/Dirt-Samples', 218],
  ['sonidosingapura/blu-mar-ten/Pads', 152], ['sonidosingapura/blu-mar-ten/Vocals', 136],
  ['Bubobubobubobubo/Dough-Amiga', 116], ['sonidosingapura/blu-mar-ten/Bass', 114],
  ['yaxu/spicule', 75], ['Bubobubobubobubo/Dough-Waveforms', 65],
  ['Bubobubobubobubo/Dough-Fox', 63], ['Bubobubobubobubo/Dough-Bourges', 45],
  ['neshanjo/strudel-producer-space-samples', 37], ['MartinMaguna/samplesKzur', 35],
  ['mmmgarlic/randumsample', 35], ['mistipher/studel-beats', 32],
  ['sandpills/v10101a-samples', 32], ['yaxu/clean-breaks', 32],
  ['AustinOliverHaskell/ms-teams-sounds-strudel', 31], ['proudly-music/breaks', 28],
  ['terrorhank/samples', 28], ['Bubobubobubobubo/Dough-Samples', 27],
  ['k09/samples', 27], ['heavy-lifting/a-maze', 26], ['dagurkris/Tidalcycles', 25],
  ['sound.intercrap.com/strudel/mellotron', 24], ['eddyflux/wax', 21],
  ['bsssssss/strudel-samples/bs-breaks', 20], ['felixroos/estuary-samples', 19],
  ['mamalLivecoder/samples', 19], ['alfredojarry/samples_eddyflux_crate', 18],
  ['eddyflux/crate', 18], ['sonidosingapura/rochormatic', 18], ['felixroos/samples', 17],
  ['tidalcycles/uzu-drumkit', 16], ['pavlovpavlov/samples', 15], ['emptyflash/samples', 13],
  ['mot4i/garden', 13], ['yaxu/mrid', 13], ['indiepaleale/strudel-samples', 12],
  ['sarefo/strudel', 12], ['Naaeeen/LENS', 11], ['algorave-dave/samples', 10],
  ['byolim/breaks', 10], ['azhadsyed/strudel-samples', 9],
  ['kyrsive/glorkglunk-wavetables', 9], ['creativenucleus/strudel-m8-168-dnb-jungle', 8],
  ['KakuyaShiraishi/samples', 8], ['SutterChristian/sampuru', 8],
  ['vasilymilovidov/samples', 8], ['ross-sec-audio/dsamples', 7],
  ['tedthetrumpet/testpage/strudelsamples', 7],
  ['bruveping/RepositorioDESonido_N_3/Codigo_Spectrum_2025', 6],
  ['mot4i/loom/garden_of_possibilities', 6], ['mot4i/loom/velvet_blues', 6],
  ['Prof12200/strudel_repo', 6], ['sonidosingapura/blu-mar-ten', 6],
  ['bsssssss/strudel-samples/bs-sounds', 5],
  ['Emanuel-de-Jong/L1C0-B3nLib_x86_EXE/assets/audio', 5],
  ['mot4i/joyinerror/loopy_youpy', 5], ['kaiye10/strudelSamples', 4],
  ['mysinglelise/msl-strudel-samples', 4], ['prismograph/departure', 4],
  ['salsicha/capoeira_strudel', 4], ['TodePond/samples/v4', 4], ['TodePond/samples/v5', 4],
  ['TristanCacqueray/mirus', 4], ['absentfriend2025/samples', 3], ['boggodan/bflute', 3],
  ['Bubobubobubobubo/Dough-Amen', 3], ['hvillase/cavlp-25p', 3],
  ['mot4i/loom/manganese_bubble_bath', 3],
  ['bruveping/RepositorioDESonido_N_3/guitarra_experimental0001', 2],
  ['ibleedicare/strudel-bank', 2], ['janpc01/samples', 2],
  ['jessicaaaaaaaaaaaa/strudel-samples', 2], ['mot4i/loom/alpaca_2025', 2],
  ['mot4i/loom/the_void_is_growing/vox', 2], ['smaudd/joonies-dnb-collection-strudel', 2],
  ['bruveping/RepositorioDesonidosParaExperimentar02', 1], ['Bubobubobubobubo/Dough-Juj', 1],
  ['chickenalibi/music', 1], ['cleary/samples-flbass', 1], ['cosmiclavaflow/samples', 1],
  ['davidshipp/dtl', 1], ['edcrub/samp', 1], ['EloMorelo/samples', 1],
  ['fstiffo/polifonia-samples', 1], ['gerzytet/strudel-samples', 1],
  ['HelveticaScenario/trick-shot', 1], ['jpalcala/tidal', 1], ['kyrsive/gc-glitches', 1],
  ['kyrsive/gc-glitches2', 1], ['kyrsive/gc-wavetables', 1], ['luvl4ne/breaks', 1],
  ['MartinMaguna/luzmilacarpiosamples', 1], ['mot4i/joyinerror/fraxional_edit', 1],
  ['mot4i/loom/a_damn_fine_cup_of_coffee', 1], ['mot4i/loom/chill', 1],
  ['Nikeryms/Samples', 1], ['norrischris/samples', 1], ['potatoboiler/bolero', 1],
  ['QuantumVillage/quantum-music', 1], ['reema7667/strudel-sounds', 1],
  ['Samplesbit/Plucks', 1], ['Samplesbit/strudel_samples', 1], ['superbuggy/samples', 1],
  ['switchangel/breaks', 1], ['switchangel/pad', 1], ['TorenUK/breaks', 1],
  ['valjason/barrel', 1], ['YAGORAYMOND/samples', 1], ['yaxu/svgs', 1]
];

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
  // Fetches pack list from strudel-samples.alternet.site, lets user browse
  // and load packs. Loading a pack adds samples('github:...') to the engine preamble.

  _initSampleBrowser() {
    const modal = document.getElementById('sample-browser-modal');
    const btnSamples = document.getElementById('btn-samples');
    if (!modal || !btnSamples) return;

    const searchInput = modal.querySelector('.sb-search');
    const packList = modal.querySelector('.sb-pack-list');
    const detailPane = modal.querySelector('.sb-detail');
    const btnClose = modal.querySelector('.sb-close');

    let packs = null; // [{name, count, builtin}]
    let selectedPack = null;

    // Close modal
    const closeModal = () => modal.classList.remove('visible');
    btnClose.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

    // Open modal and fetch pack list
    btnSamples.addEventListener('click', async () => {
      modal.classList.add('visible');
      if (!packs) {
        packList.innerHTML = '<div class="sb-loading">Loading packs from strudel-samples.alternet.site...</div>';
        try {
          packs = await this._fetchPackList();
        } catch (err) {
          packList.innerHTML = `<div class="sb-loading">Failed to load packs: ${err.message}</div>`;
          return;
        }
      }
      renderPacks('');
    });

    searchInput?.addEventListener('input', () => renderPacks(searchInput.value));

    const renderPacks = (filter) => {
      packList.innerHTML = '';
      if (!packs) return;
      const filtered = packs.filter(p =>
        !filter || p.name.toLowerCase().includes(filter.toLowerCase())
      );
      for (const pack of filtered) {
        const item = document.createElement('div');
        item.className = 'sb-pack-item';
        if (this.engine.getSampleImports().some(s => s.includes(pack.name))) {
          item.classList.add('loaded');
        }
        if (pack.builtin) item.classList.add('builtin');

        const nameEl = document.createElement('span');
        nameEl.className = 'sb-pack-name';
        nameEl.textContent = pack.name;
        item.appendChild(nameEl);

        const countEl = document.createElement('span');
        countEl.className = 'sb-pack-count';
        countEl.textContent = pack.count;
        item.appendChild(countEl);

        item.addEventListener('click', () => {
          packList.querySelectorAll('.sb-pack-item').forEach(el => el.classList.remove('selected'));
          item.classList.add('selected');
          selectedPack = pack;
          renderDetail(pack);
        });
        packList.appendChild(item);
      }
    };

    const renderDetail = (pack) => {
      const isBuiltin = pack.name.startsWith('strudel.cc/');
      const importCode = isBuiltin ? null : this._getImportCode(pack.name);
      const isLoaded = importCode && this.engine.getSampleImports().includes(importCode);

      detailPane.innerHTML = '';

      const title = document.createElement('h3');
      title.className = 'sb-detail-title';
      title.textContent = pack.name;
      detailPane.appendChild(title);

      const meta = document.createElement('div');
      meta.className = 'sb-detail-meta';
      meta.textContent = `${pack.count} samples`;
      detailPane.appendChild(meta);

      // Strudel code block
      const codeBlock = document.createElement('div');
      codeBlock.className = 'sb-code-block';
      const codeLabel = document.createElement('span');
      codeLabel.className = 'sb-code-label';
      codeLabel.textContent = 'strudel code:';
      codeBlock.appendChild(codeLabel);
      const codeEl = document.createElement('code');
      codeEl.className = 'sb-code';
      if (isBuiltin) {
        codeEl.textContent = '// Already included in Strudel';
        codeEl.classList.add('dim');
      } else {
        codeEl.textContent = importCode;
      }
      codeBlock.appendChild(codeEl);
      detailPane.appendChild(codeBlock);

      // Load button
      if (!isBuiltin) {
        const btnLoad = document.createElement('button');
        btnLoad.className = 'sb-load-btn transport-btn accent';
        if (isLoaded) {
          btnLoad.textContent = 'Loaded';
          btnLoad.disabled = true;
          btnLoad.classList.remove('accent');
          btnLoad.classList.add('active');
        } else {
          btnLoad.textContent = 'Load Pack';
          btnLoad.addEventListener('click', () => {
            this.engine.addSampleImport(importCode);

            // Fetch strudel.json to get sample names for the Sampler module
            this._fetchPackSamples(pack.name).then(sampleNames => {
              if (sampleNames.length > 0) {
                loadedPacks.set(pack.name, sampleNames);
                document.dispatchEvent(new CustomEvent('malstrom:samples-updated'));
              }
            });

            btnLoad.textContent = 'Loaded';
            btnLoad.disabled = true;
            btnLoad.classList.remove('accent');
            btnLoad.classList.add('active');

            // Update pack list item
            packList.querySelectorAll('.sb-pack-item').forEach(el => {
              if (el.querySelector('.sb-pack-name')?.textContent === pack.name) {
                el.classList.add('loaded');
              }
            });
          });
        }
        detailPane.appendChild(btnLoad);
      } else {
        const note = document.createElement('div');
        note.className = 'sb-detail-meta';
        note.textContent = 'These samples are available by default — no import needed.';
        detailPane.appendChild(note);
      }

      // Link to alternet site
      const link = document.createElement('a');
      link.className = 'sb-alternet-link';
      link.href = ALTERNET_URL;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.textContent = 'Browse on strudel-samples.alternet.site';
      detailPane.appendChild(link);
    };
  }

  // Fetch and parse the pack list HTML from strudel-samples.alternet.site
  // Falls back to an embedded snapshot if the site is behind Cloudflare challenge
  async _fetchPackList() {
    try {
      const resp = await fetch(ALTERNET_URL);
      if (resp.ok) {
        const html = await resp.text();
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const rows = doc.querySelectorAll('.packs-table tbody tr');
        if (rows.length > 0) {
          const packs = [];
          for (const row of rows) {
            const nameBtn = row.querySelector('.pack-name-btn');
            const countEl = row.querySelector('.pack-count');
            if (!nameBtn) continue;
            const name = nameBtn.textContent.trim();
            const count = parseInt(countEl?.textContent || '0', 10);
            packs.push({ name, count, builtin: name.startsWith('strudel.cc/') });
          }
          return packs;
        }
      }
    } catch { /* Cloudflare challenge or network error — fall through to embedded list */ }

    // Embedded snapshot of packs from strudel-samples.alternet.site
    return EMBEDDED_PACKS.map(([name, count]) => ({
      name, count, builtin: name.startsWith('strudel.cc/')
    }));
  }

  // Build the strudel import code for a pack name
  _getImportCode(packName) {
    // packs with dots in first segment are URL-based (e.g. samples.grbt.com.au)
    const firstSegment = packName.split('/')[0];
    if (firstSegment.includes('.')) {
      // URL-based pack — use the full URL
      return `samples('https://${packName}/strudel.json')`;
    }
    // GitHub pack — use github: shorthand
    return `samples('github:${packName}')`;
  }

  // Fetch the strudel.json for a pack to get sample names
  async _fetchPackSamples(packName) {
    try {
      const firstSegment = packName.split('/')[0];
      let url;
      if (firstSegment.includes('.')) {
        url = `https://${packName}/strudel.json`;
      } else {
        url = `https://raw.githubusercontent.com/${packName}/refs/heads/main/strudel.json`;
      }
      const resp = await fetch(url);
      if (!resp.ok) return [];
      const data = await resp.json();
      // Return sample names (keys that aren't metadata)
      return Object.keys(data).filter(k => !k.startsWith('_'));
    } catch {
      return [];
    }
  }
}

// Boot
const app = new App();
document.addEventListener('DOMContentLoaded', () => app.init());
