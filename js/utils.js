/**
 * MÓDULO DE UTILIDADES
 * Funciones auxiliares, validaciones, animaciones
 */

const Utils = {
  // Generar UUID simple
  generateId() {
    return 'id_' + Math.random().toString(36).substr(2, 9) + Date.now();
  },

  // Validar imagen
  validateImage(file) {
    const validTypes = ['image/jpeg', 'image/png'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      return 'Formato inválido (JPG/PNG requerido)';
    }

    if (file.size > maxSize) {
      return 'Imagen muy pesada (máximo 5MB)';
    }

    return null;
  },

  // Convertir archivo a base64
  fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  },

  // Crear confeti
  createConfetti(x, y, color) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.left = x + 'px';
    confetti.style.top = y + 'px';
    confetti.style.background = color;
    confetti.style.animation = `fall ${2 + Math.random() * 1}s linear forwards`;
    document.body.appendChild(confetti);

    setTimeout(() => confetti.remove(), 3000);
  },

  // Generar confeti masivo para victoria
  celebrateVictory(color) {
    const count = 50;
    for (let i = 0; i < count; i++) {
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight * 0.2;
      
      setTimeout(() => {
        this.createConfetti(x, y, color);
      }, i * 20);
    }
  },

  // Mostrar notificación
  showNotification(message, type = 'success') {
    const notif = document.createElement('div');
    notif.className = 'notification';
    notif.textContent = message;
    notif.style.background = type === 'success' ? '#00aa00' : '#ff6600';
    document.body.appendChild(notif);

    setTimeout(() => notif.remove(), 3000);
  },

  // Mostrar modal de confirmación
  showConfirm(title, message) {
    return new Promise((resolve) => {
      const modal = document.createElement('div');
      modal.className = 'modal';
      modal.innerHTML = `
        <div class="modal-content">
          <h2>${title}</h2>
          <p>${message}</p>
          <div class="modal-buttons">
            <button class="btn btn-danger" onclick="this.closest('.modal').remove(); window.confirmResolve(false)">Cancelar</button>
            <button class="btn btn-success" onclick="this.closest('.modal').remove(); window.confirmResolve(true)">Confirmar</button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);

      window.confirmResolve = (result) => {
        resolve(result);
        window.confirmResolve = null;
      };
    });
  },

  // Extraer palabras entre corchetes
  extractBracketedWords(text) {
    const regex = /\[([^\]]+)\]/g;
    const words = [];
    let match;
    
    while ((match = regex.exec(text)) !== null) {
      words.push(match[1]);
    }
    
    return words;
  },

  // Crear versículo con espacios en blanco
  createVerseDisplay(fullText, hiddenWords) {
    let display = fullText;
    hiddenWords.forEach(word => {
      const placeholder = '_'.repeat(Math.max(word.length, 3));
      display = display.replace(`[${word}]`, `<span class="word-blank">${placeholder}</span>`);
    });
    return display;
  },

  // Generar palabras ocultas automáticas
  generateHiddenWords(text, level) {
    const words = text.split(/\s+/).filter(w => w.length > 0);
    
    // Palabras frecuentes a evitar
    const stopWords = ['de', 'y', 'la', 'el', 'a', 'en', 'es', 'un', 'una', 'los', 'las', 'o'];
    
    const candidatos = words.filter(word => {
      const clean = word.toLowerCase().replace(/[.,;:\-()]/g, '');
      return !stopWords.includes(clean) && clean.length > 2;
    });

    let count;
    if (level === 'kids') count = Math.max(1, Math.min(2, Math.ceil(candidatos.length * 0.15)));
    else if (level === 'youth') count = Math.max(3, Math.min(4, Math.ceil(candidatos.length * 0.25)));
    else count = Math.max(5, Math.ceil(candidatos.length * 0.4));

    return candidatos.slice(0, count);
  },

  // Mezclar array (Fisher-Yates)
  shuffleArray(array) {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  },

  // Formato de tiempo MM:SS.DD
  formatTime(milliseconds) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const deciseconds = Math.floor((milliseconds % 1000) / 100);

    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${deciseconds}`;
  },

  // Validar JSON
  validateJSON(jsonString) {
    try {
      JSON.parse(jsonString);
      return true;
    } catch {
      return false;
    }
  },

  // Limpiar nombre de archivo
  sanitizeFilename(filename) {
    return filename.replace(/[^a-zA-Z0-9_-]/g, '_');
  },

  // Descargar archivo
  downloadJSON(data, filename) {
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || `desafio_backup_${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }
};
