// Audio Engine — wraps Strudel/WebAudio for pattern evaluation and playback

export class Engine {
  constructor() {
    this.initialized = false;
    this.playing = false;
    this._strudel = null;
    this._useCdnSamples = false;
  }

  async init() {
    if (this.initialized) return;

    try {
      // Import the pre-bundled strudel dist using the path from preload
      const strudelPath = window.malstrom?.strudelPath;
      if (strudelPath) {
        this._strudel = await import(strudelPath);
      } else {
        this._strudel = await import('@strudel/web');
      }

      // initStrudel sets up AudioContext, loads synth sounds, registers modules
      await this._strudel.initStrudel();
      this.initialized = true;
    } catch (err) {
      console.error('Failed to init Strudel:', err);
      this.initialized = true;
      this._fallbackMode = true;
    }
  }

  async play(code) {
    if (!this.initialized) await this.init();

    if (!code || !code.trim()) {
      throw new Error('No code to evaluate — connect modules to an Output');
    }

    if (this._fallbackMode) {
      console.log('Strudel code (fallback mode):', code);
      this.playing = true;
      return;
    }

    // Prepend CDN samples loader if needed
    let fullCode = code;
    if (this._useCdnSamples) {
      fullCode = `await samples('https://strudel-samples.alternet.site/strudel.json')\n${code}`;
    }

    await this._strudel.evaluate(fullCode);
    this.playing = true;
  }

  async stop() {
    try {
      if (this._strudel && !this._fallbackMode) {
        this._strudel.hush();
      }
    } catch (err) {
      console.error('Stop error:', err);
    }
    this.playing = false;
  }

  setBpm(bpm) {
    if (this._strudel && !this._fallbackMode && this._strudel.setcps) {
      this._strudel.setcps(bpm / 60 / 4);
    }
  }

  enableCdnSamples() {
    this._useCdnSamples = true;
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
