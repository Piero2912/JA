/**
 * MÓDULO DE AUDIO
 * Genera sonidos mediante Web Audio API
 */

const AudioSystem = {
  audioContext: null,
  isMuted: false,

  // Inicializar contexto de audio
  init() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    this.isMuted = Storage.getConfig().soundMuted || false;
  },

  // Reproducir sonido de acierto
  playSuccess() {
    if (this.isMuted) return;
    this.init();
    
    const now = this.audioContext.currentTime;
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    
    osc.connect(gain);
    gain.connect(this.audioContext.destination);
    
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.setValueAtTime(600, now + 0.1);
    
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
    
    osc.start(now);
    osc.stop(now + 0.2);
  },

  // Reproducir sonido de error
  playError() {
    if (this.isMuted) return;
    this.init();
    
    const now = this.audioContext.currentTime;
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    
    osc.connect(gain);
    gain.connect(this.audioContext.destination);
    
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.setValueAtTime(200, now + 0.1);
    
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
    
    osc.start(now);
    osc.stop(now + 0.3);
  },

  // Reproducir sonido de victoria
  playVictory() {
    if (this.isMuted) return;
    this.init();
    
    const now = this.audioContext.currentTime;
    const notes = [800, 600, 1000];
    
    notes.forEach((freq, idx) => {
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();
      
      osc.connect(gain);
      gain.connect(this.audioContext.destination);
      
      const startTime = now + idx * 0.15;
      osc.frequency.setValueAtTime(freq, startTime);
      gain.gain.setValueAtTime(0.2, startTime);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.2);
      
      osc.start(startTime);
      osc.stop(startTime + 0.2);
    });
  },

  // Reproducir sonido de final
  playFinal() {
    if (this.isMuted) return;
    this.init();
    
    const now = this.audioContext.currentTime;
    const notes = [600, 800, 1000, 1200];
    
    notes.forEach((freq, idx) => {
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();
      
      osc.connect(gain);
      gain.connect(this.audioContext.destination);
      
      const startTime = now + idx * 0.1;
      osc.frequency.setValueAtTime(freq, startTime);
      gain.gain.setValueAtTime(0.3, startTime);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);
      
      osc.start(startTime);
      osc.stop(startTime + 0.3);
    });
  },

  // Alternar silencio
  toggleMute() {
    this.isMuted = !this.isMuted;
    const config = Storage.getConfig();
    config.soundMuted = this.isMuted;
    Storage.setConfig(config);
    return this.isMuted;
  }
};

AudioSystem.init();
