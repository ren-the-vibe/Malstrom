// Audio Engine — wraps Strudel/WebAudio for pattern evaluation and playback

export class Engine {
  constructor() {
    this.initialized = false;
    this.playing = false;
    this._strudel = null;   // module-level exports (evaluate, hush, initStrudel, samples)
    this._repl = null;      // repl object returned by initStrudel (has setcps, setCps)
    this._sampleImports = new Set(); // e.g. "samples('github:user/repo')"
  }

  async init() {
    if (this.initialized) return;

    // Import strudel using a relative path from src/ to node_modules/
    // (bare specifiers like '@strudel/web' don't work in browser import(),
    //  and absolute paths from preload don't resolve as valid module URLs)
    this._strudel = await import('../node_modules/@strudel/web/dist/index.mjs');

    // initStrudel sets up AudioContext, loads synth sounds, registers modules
    // It returns a repl object with { evaluate, hush, setcps, setCps, ... }
    this._repl = await this._strudel.initStrudel();
    this.initialized = true;
  }

  async play(code) {
    if (!this.initialized) await this.init();

    if (!code || !code.trim()) {
      throw new Error('No code to evaluate — connect modules to an Output');
    }

    // Prepend sample pack imports
    let fullCode = code;
    if (this._sampleImports.size > 0) {
      const imports = [...this._sampleImports].map(s => `await ${s}`).join('\n');
      fullCode = imports + '\n' + code;
    }

    await this._strudel.evaluate(fullCode);
    this.playing = true;
  }

  async stop() {
    try {
      if (this._strudel && this.initialized) {
        this._strudel.hush();
      }
    } catch (err) {
      console.error('Stop error:', err);
    }
    this.playing = false;
  }

  setBpm(bpm) {
    // setcps is on the repl object, not a module-level export
    if (this._repl?.setcps) {
      this._repl.setcps(bpm / 60 / 4);
    }
  }

  addSampleImport(importCode) {
    this._sampleImports.add(importCode);
  }

  getSampleImports() {
    return [...this._sampleImports];
  }

  async initAudio() {
    await this.init();
  }

  isPlaying() {
    return this.playing;
  }

  isInitialized() {
    return this.initialized;
  }
}
