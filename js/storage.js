/**
 * MÓDULO DE ALMACENAMIENTO
 * Maneja persistencia de datos con localStorage
 * Soporta exportación e importación JSON
 */

const Storage = {
  // Prefijos para las claves
  PREFIX: 'desafio_',
  
  // Inicializa el almacenamiento con datos por defecto
  init() {
    if (!this.getConfig()) {
      this.setConfig({
        teams: {
          left: { name: 'Bando Izquierdo', color: '#0066cc' },
          right: { name: 'Bando Derecho', color: '#cc0000' }
        },
        soundMuted: false
      });
    }
  },

  // === CONFIG GENERAL ===
  setConfig(config) {
    localStorage.setItem(this.PREFIX + 'config', JSON.stringify(config));
  },

  getConfig() {
    const data = localStorage.getItem(this.PREFIX + 'config');
    return data ? JSON.parse(data) : null;
  },

  // === GAME 1 ===
  setGame1Rounds(rounds) {
    localStorage.setItem(this.PREFIX + 'game1_rounds', JSON.stringify(rounds));
  },

  getGame1Rounds() {
    const data = localStorage.getItem(this.PREFIX + 'game1_rounds');
    return data ? JSON.parse(data) : [];
  },

  setGame1Session(session) {
    localStorage.setItem(this.PREFIX + 'game1_session', JSON.stringify(session));
  },

  getGame1Session() {
    const data = localStorage.getItem(this.PREFIX + 'game1_session');
    return data ? JSON.parse(data) : null;
  },

  // === GAME 2 ===
  setGame2Verses(verses) {
    localStorage.setItem(this.PREFIX + 'game2_verses', JSON.stringify(verses));
  },

  getGame2Verses() {
    const data = localStorage.getItem(this.PREFIX + 'game2_verses');
    return data ? JSON.parse(data) : [];
  },

  setGame2Session(session) {
    localStorage.setItem(this.PREFIX + 'game2_session', JSON.stringify(session));
  },

  getGame2Session() {
    const data = localStorage.getItem(this.PREFIX + 'game2_session');
    return data ? JSON.parse(data) : null;
  },

  setGame2UsedVerses(usedIds) {
    localStorage.setItem(this.PREFIX + 'game2_used_verses', JSON.stringify(usedIds));
  },

  getGame2UsedVerses() {
    const data = localStorage.getItem(this.PREFIX + 'game2_used_verses');
    return data ? JSON.parse(data) : [];
  },

  // === GAME 3 ===
  setGame3Stories(stories) {
    localStorage.setItem(this.PREFIX + 'game3_stories', JSON.stringify(stories));
  },

  getGame3Stories() {
    const data = localStorage.getItem(this.PREFIX + 'game3_stories');
    return data ? JSON.parse(data) : [];
  },

  setGame3Session(session) {
    localStorage.setItem(this.PREFIX + 'game3_session', JSON.stringify(session));
  },

  getGame3Session() {
    const data = localStorage.getItem(this.PREFIX + 'game3_session');
    return data ? JSON.parse(data) : null;
  },

  // === EXPORTAR CONTENIDO ===
  exportContent() {
    const content = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      config: this.getConfig(),
      game1: this.getGame1Rounds(),
      game2: this.getGame2Verses(),
      game3: this.getGame3Stories()
    };
    return JSON.stringify(content, null, 2);
  },

  // === IMPORTAR CONTENIDO ===
  importContent(jsonString, merge = false) {
    try {
      const content = JSON.parse(jsonString);
      
      if (!content.version) {
        throw new Error('Formato inválido: falta versión');
      }

      // Si no es merge, limpiar primero
      if (!merge) {
        this.clear();
      }

      // Importar configuración
      if (content.config) {
        this.setConfig(content.config);
      }

      // Importar juegos
      if (content.game1 && content.game1.length > 0) {
        const existing = merge ? this.getGame1Rounds() : [];
        this.setGame1Rounds([...existing, ...content.game1]);
      }

      if (content.game2 && content.game2.length > 0) {
        const existing = merge ? this.getGame2Verses() : [];
        this.setGame2Verses([...existing, ...content.game2]);
      }

      if (content.game3 && content.game3.length > 0) {
        const existing = merge ? this.getGame3Stories() : [];
        this.setGame3Stories([...existing, ...content.game3]);
      }

      return true;
    } catch (error) {
      console.error('Error al importar:', error);
      return false;
    }
  },

  // === LIMPIAR DATOS ===
  clear() {
    const keys = Object.keys(localStorage).filter(key => key.startsWith(this.PREFIX));
    keys.forEach(key => localStorage.removeItem(key));
  },

  // === ESTADÍSTICAS ===
  getStorageStats() {
    let total = 0;
    const keys = Object.keys(localStorage).filter(key => key.startsWith(this.PREFIX));
    keys.forEach(key => {
      total += (localStorage.getItem(key) || '').length;
    });
    return {
      items: keys.length,
      sizeKB: Math.round(total / 1024),
      keys: keys
    };
  },

  // === LIMPIEZA COMPLETA ===
  clearAllData() {
    const keys = Object.keys(localStorage).filter(key => key.startsWith(this.PREFIX));
    keys.forEach(key => {
      localStorage.removeItem(key);
    });
    console.log('✅ Storage limpiado completamente');
  },

  clearGame2Data() {
    localStorage.removeItem(this.PREFIX + 'game2_verses');
    localStorage.removeItem(this.PREFIX + 'game2_session');
    localStorage.removeItem(this.PREFIX + 'game2_used_verses');
    console.log('✅ Datos de Game2 limpiados');
  }
};

// Inicializar al cargar
Storage.init();
