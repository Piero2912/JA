/**
 * APLICACIÓN PRINCIPAL - Desafío de los Bandos
 * Gestión de vistas, eventos y flujo de la aplicación
 */

const App = {
  config: null,
  currentView: 'menu',
  publicMode: false,

  // === INICIALIZACIÓN ===
  init() {
    this.config = Storage.getConfig();
    this.render();
    this.setupEventListeners();
    window.addEventListener('keydown', (e) => this.handleKeyboard(e));
  },

  // === MANEJO DE TECLADO ===
  handleKeyboard(e) {
    // No ejecutar atajos si estamos escribiendo
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
      return;
    }

    // Ctrl+P: Toggle modo público
    if (e.ctrlKey && e.key === 'p') {
      e.preventDefault();
      this.togglePublicMode();
      return;
    }

    // F11: Pantalla completa
    if (e.key === 'F11') {
      e.preventDefault();
      this.toggleFullscreen();
      return;
    }

    // M: Mostrar ayuda
    if (e.key === 'm' || e.key === 'M') {
      e.preventDefault();
      this.showHelp();
      return;
    }

    // ESC: Volver al menú
    if (e.key === 'Escape') {
      e.preventDefault();
      if (this.currentView !== 'menu') {
        this.goToMenu();
      }
      return;
    }

    // Atajos específicos del juego
    if (this.currentView.startsWith('game')) {
      this.handleGameKeyboard(e);
    }
  },

  handleGameKeyboard(e) {
    const num = parseInt(e.key);
    
    if (num === 1 || num === 2 || num === 0) {
      e.preventDefault();

      if (this.currentView === 'game1-play') {
        this.handleGame1Keyboard(num);
      } else if (this.currentView === 'game2-play') {
        this.handleGame2Keyboard(num);
      }
    }
  },

  handleGame1Keyboard(num) {
    // Implementado en la vista específica
  },

  handleGame2Keyboard(num) {
    // Implementado en la vista específica
  },

  // === NAVEGACIÓN ===
  goToMenu() {
    this.currentView = 'menu';
    this.render();
  },

  goToGame(gameNum) {
    // Juego 1: Cargar imagen aleatoria directamente
    if (gameNum === 1) {
      const rounds = Game1.getRounds();
      if (rounds && rounds.length > 0) {
        // Si hay rondas guardadas, usar una al azar
        const randomRound = rounds[Math.floor(Math.random() * rounds.length)];
        return this.startGame1(randomRound.id);
      } else {
        // Si no hay rondas, cargar imagen de la carpeta al azar
        return this.playRandomImageFromFolder();
      }
    }
    
    // Juego 2: Cargar versículo al azar directamente
    if (gameNum === 2) {
      const verses = Game2.getVerses();
      if (verses && verses.length > 0) {
        return this.goToGamePlay(2, null); // Cargar al azar en el play
      } else {
        Swal.fire({
          title: 'Sin contenido',
          text: 'No hay versículos disponibles. Crea uno primero.',
          icon: 'error',
          confirmButtonColor: '#cc0000'
        });
        return;
      }
    }
    
    // Juego 3: Cargar historia al azar directamente
    if (gameNum === 3) {
      const stories = Game3.getStories();
      if (stories && stories.length > 0) {
        // Siempre tomar una historia diferente a la actual
        let randomStory;
        do {
          randomStory = stories[Math.floor(Math.random() * stories.length)];
        } while (stories.length > 1 && Game3.currentStory && randomStory.id === Game3.currentStory.id);
        return this.startGame3(randomStory.id);
      } else {
        Swal.fire({
          title: 'Sin contenido',
          text: 'No hay historias disponibles. Crea una primero.',
          icon: 'error',
          confirmButtonColor: '#cc0000'
        });
        return;
      }
    }
  },

  goToGameEditor(gameNum) {
    this.currentView = `game${gameNum}-editor`;
    this.render();
  },

  goToGamePlay(gameNum, contentId) {
    this.currentView = `game${gameNum}-play`;
    window.gamePlayContentId = contentId;
    this.render();
  },

  goToConfig() {
    this.currentView = 'config';
    this.render();
  },

  // === MODO PÚBLICO ===
  togglePublicMode() {
    this.publicMode = !this.publicMode;
    const container = document.getElementById('app').querySelector('.container');
    if (this.publicMode) {
      container.classList.add('public-mode');
      Utils.showNotification('Modo presentación activado', 'success');
    } else {
      container.classList.remove('public-mode');
      Utils.showNotification('Modo presentación desactivado', 'success');
    }
  },

  // === PANTALLA COMPLETA ===
  toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {
        Utils.showNotification('No se pudo activar pantalla completa', 'error');
      });
    } else {
      document.exitFullscreen();
    }
  },

  // === SONIDO ===
  toggleSound() {
    const muted = AudioSystem.toggleMute();
    const btn = document.querySelector('.sound-toggle');
    if (btn) {
      btn.textContent = muted ? '🔇' : '🔊';
    }
  },

  // === AYUDA ===
  showHelp() {
    const help = `
ATAJOS DE TECLADO:
━━━━━━━━━━━━━━━━━━━━━━━━━━━
Ctrl+P   - Alternar modo presentación
F11      - Pantalla completa
M        - Mostrar esta ayuda
ESC      - Volver al menú

DURANTE JUEGO:
━━━━━━━━━━━━━━━━━━━━━━━━━━━
Tecla 1  - Bando Izquierdo
Tecla 2  - Bando Derecho
Tecla 0  - Nadie acertó (Game 2)
    `;

    Utils.showNotification(help, 'success');
  },

  // === CONFIGURACIÓN ===
  saveConfig(teamLeftName, teamLeftColor, teamRightName, teamRightColor) {
    this.config.teams.left.name = teamLeftName;
    this.config.teams.left.color = teamLeftColor;
    this.config.teams.right.name = teamRightName;
    this.config.teams.right.color = teamRightColor;

    Storage.setConfig(this.config);
    document.documentElement.style.setProperty('--color-left', teamLeftColor);
    document.documentElement.style.setProperty('--color-right', teamRightColor);

    Utils.showNotification('Configuración guardada', 'success');
    this.goToMenu();
  },

  // === RENDER ===
  render() {
    const app = document.getElementById('app');
    app.innerHTML = '';

    const container = document.createElement('div');
    container.className = 'container' + (this.publicMode ? ' public-mode' : '');
    app.appendChild(container);

    // Header - SIEMPRE PRESENTE (excepto en menú)
    const header = document.createElement('div');
    header.className = 'header';
    header.innerHTML = `
      <h1>🎯 Desafío de los Bandos</h1>
      <div class="header-controls animator-only">
        <button class="sound-toggle" onclick="App.toggleSound()">🔊</button>
        <button class="help-btn" onclick="App.showHelp()">?</button>
        <button class="config-btn" onclick="App.goToConfig()">⚙️</button>
      </div>
    `;
    
    if (this.currentView !== 'menu') {
      container.appendChild(header);
    }

    // Contenido
    const content = document.createElement('div');
    content.className = 'content';

    if (this.currentView === 'menu') {
      this.renderMenu(content);
    } else if (this.currentView === 'config') {
      this.renderConfig(content);
    } else if (this.currentView === 'game1-select') {
      this.renderGame1Select(content);
    } else if (this.currentView === 'game1-editor') {
      this.renderGame1Editor(content);
    } else if (this.currentView === 'game1-play') {
      this.renderGame1Play(content);
    } else if (this.currentView === 'game2-select') {
      this.renderGame2Select(content);
    } else if (this.currentView === 'game2-editor') {
      this.renderGame2Editor(content);
    } else if (this.currentView === 'game2-play') {
      this.renderGame2Play(content);
    } else if (this.currentView === 'game3-select') {
      this.renderGame3Select(content);
    } else if (this.currentView === 'game3-editor') {
      this.renderGame3Editor(content);
    } else if (this.currentView === 'game3-play') {
      this.renderGame3Play(content);
    }

    container.appendChild(content);

    // Botón volver al menú - SIEMPRE VISIBLE Y EN POSICIÓN FIJA
    if (this.currentView !== 'menu') {
      const backBtn = document.createElement('button');
      backBtn.className = 'btn btn-secondary back-to-menu animator-only';
      backBtn.textContent = '← Volver';
      backBtn.title = 'Volver al menú principal';
      backBtn.onclick = () => this.goToMenu();
      app.appendChild(backBtn);
    }
  },

  // === VISTAS ===

  renderMenu(content) {
    content.innerHTML = `
      <div class="menu-container">
        <div class="menu-logo-section">
          <img src="img/JA.jpg" alt="Logo JA" class="menu-logo">
        </div>
        <div class="menu-title">BIENVENIDO</div>
        <div class="menu-buttons">
          <button class="btn-game" onclick="App.goToGame(1)" style="display: none;">🖼️ Adivina el Secreto</button>
          <button class="btn-game game2" onclick="App.goToGame(2)">📖 Reconstruye el Versículo</button>
          <button class="btn-game game3" onclick="App.goToGame(3)">⏱️ Arma la Historia</button>
        </div>
        <div class="animator-only" style="margin-top: 2rem;">
          <button class="btn btn-secondary" onclick="App.goToConfig()">⚙️ Configurar Bandos</button>
        </div>
      </div>
    `;
  },

  renderConfig(content) {
    content.innerHTML = `
      <div class="editor-form">
        <h2 style="margin-bottom: 2rem; font-size: 2.5rem;">Configurar Bandos</h2>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
          <div>
            <h3 style="margin-bottom: 1rem; font-size: 1.8rem;">Bando Izquierdo</h3>
            <div class="form-group">
              <label>Nombre</label>
              <input type="text" id="leftName" value="${this.config.teams.left.name}">
            </div>
            <div class="form-group">
              <label>Color</label>
              <input type="color" id="leftColor" value="${this.config.teams.left.color}">
            </div>
          </div>
          
          <div>
            <h3 style="margin-bottom: 1rem; font-size: 1.8rem;">Bando Derecho</h3>
            <div class="form-group">
              <label>Nombre</label>
              <input type="text" id="rightName" value="${this.config.teams.right.name}">
            </div>
            <div class="form-group">
              <label>Color</label>
              <input type="color" id="rightColor" value="${this.config.teams.right.color}">
            </div>
          </div>
        </div>
        
        <div style="margin-top: 2rem;">
          <button class="btn btn-success" onclick="App.saveConfigFromForm()" style="width: 100%; padding: 1.5rem; font-size: 1.8rem;">Guardar Configuración</button>
        </div>
      </div>
    `;
  },

  saveConfigFromForm() {
    const leftName = document.getElementById('leftName').value;
    const leftColor = document.getElementById('leftColor').value;
    const rightName = document.getElementById('rightName').value;
    const rightColor = document.getElementById('rightColor').value;

    this.saveConfig(leftName, leftColor, rightName, rightColor);
  },

  exportContent() {
    const json = Storage.exportContent();
    Utils.downloadJSON(json, `desafio_backup_${Date.now()}.json`);
    Utils.showNotification('Contenido exportado', 'success');
  },

  importContent() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = async (e) => {
      const file = e.target.files[0];
      const text = await file.text();
      
      Swal.fire({
        title: 'Importar contenido',
        text: '¿Deseas fusionar con contenido existente?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Fusionar',
        cancelButtonText: 'Reemplazar todo',
        confirmButtonColor: '#00aa00',
        cancelButtonColor: '#cc0000'
      }).then((result) => {
        if (Storage.importContent(text, result.isConfirmed)) {
          Swal.fire({
            title: '¡Éxito!',
            text: 'Contenido importado correctamente',
            icon: 'success',
            confirmButtonColor: '#00aa00'
          }).then(() => location.reload());
        } else {
          Swal.fire({
            title: 'Error',
            text: 'Error al importar. Verifica el archivo',
            icon: 'error',
            confirmButtonColor: '#cc0000'
          });
        }
      });
    };

    input.click();
  },

  // === GAME 1 ===
  renderGame1Select(content) {
    const rounds = Game1.getRounds();
    
    content.innerHTML = `
      <div style="text-align: center;">
        <h2 style="margin-bottom: 2rem; font-size: 3rem;">Juego 1: Imagen que se Aclara</h2>
        
        <div style="margin-bottom: 2rem; display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
          <button class="btn btn-success" id="btnJuegoRapido" onclick="App.handlePlayRandom()" style="padding: 1.5rem 2rem; font-size: 1.8rem;">
            🎲 Juego Rápido (al azar)
          </button>
          <button class="btn btn-primary" onclick="App.goToGameEditor(1)" style="padding: 1.5rem 2rem; font-size: 1.8rem;">
            ➕ Nueva Ronda
          </button>
        </div>

        <div style="max-width: 800px; margin: 0 auto;">
          ${rounds.length === 0 ? '<p style="font-size: 1.8rem; color: #999;">No hay rondas creadas. Crea una nueva para comenzar.</p>' : ''}
          ${rounds.map(r => `
            <div style="background: rgba(0,0,0,0.5); padding: 1.5rem; margin: 1rem 0; border-radius: 8px; display: flex; justify-content: space-between; align-items: center;">
              <div style="text-align: left;">
                <h3 style="font-size: 1.8rem; margin-bottom: 0.5rem;">${r.title}</h3>
                <p style="font-size: 1.2rem; opacity: 0.8;">${r.elements.length} elementos</p>
              </div>
              <div style="display: flex; gap: 1rem;">
                <button class="btn btn-success" onclick="App.startGame1('${r.id}')">Jugar</button>
                <button class="btn btn-danger btn-small" onclick="Game1.deleteRound('${r.id}'); App.goToGame(1)">Eliminar</button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  playRandomGame1() {
    const rounds = Game1.getRounds();
    if (rounds && rounds.length > 0) {
      const randomRound = rounds[Math.floor(Math.random() * rounds.length)];
      this.startGame1(randomRound.id);
    } else {
      // Si no hay rondas guardadas, cargar una imagen aleatoria de la carpeta /img
      this.playRandomImageFromFolder();
    }
  },

  playRandomImageFromFolder() {
    const images = ['Daniel.jpg', 'Jonas.jpg', 'jose.jpg'];
    const randomImage = images[Math.floor(Math.random() * images.length)];
    
    // Crear una ronda temporal con la imagen
    const reader = new FileReader();
    const xhr = new XMLHttpRequest();
    
    xhr.open('GET', `img/${randomImage}`, true);
    xhr.responseType = 'blob';
    
    xhr.onload = () => {
      const reader = new FileReader();
      reader.onload = (e) => {
        // Crear ronda temporal
        const tempRound = {
          id: Utils.generateId(),
          title: `${randomImage.split('.')[0]}`,
          image: e.target.result,
          description: 'Imagen del juego',
          elements: [
            { id: Utils.generateId(), name: 'Elemento 1', points: 10, guessedBy: null },
            { id: Utils.generateId(), name: 'Elemento 2', points: 10, guessedBy: null },
            { id: Utils.generateId(), name: 'Elemento 3', points: 10, guessedBy: null }
          ],
          clarityLevel: 0,
          leftTeamAttempted: false,
          rightTeamAttempted: false,
          winner: null,
          guessedElements: []
        };
        
        Game1.currentRound = tempRound;
        this.currentView = 'game1-play';
        this.render();
      };
      reader.readAsDataURL(xhr.response);
    };
    
    xhr.onerror = () => {
      Utils.showNotification('Error al cargar la imagen', 'error');
    };
    
    xhr.send();
  },

  handlePlayRandom() {
    const rounds = Game1.getRounds();
    if (!rounds || rounds.length === 0) {
      Utils.showNotification('No hay rondas creadas. Crea una nueva para comenzar.', 'error');
      return;
    }
    this.playRandomGame1();
  },

  renderGame1Editor(content) {
    content.innerHTML = `
      <div class="editor-form">
        <h2 style="margin-bottom: 2rem;">Nueva Ronda - Imagen que se Aclara</h2>

        <div class="form-group">
          <label>Título de la ronda</label>
          <input type="text" id="g1_title" placeholder="Ej: ¿Qué es esto?">
        </div>

        <div class="form-group">
          <label>Respuesta (descripción interna)</label>
          <input type="text" id="g1_description" placeholder="Ej: El arca de Noé">
        </div>

        <div class="form-group">
          <label>🖼️ Cargar imagen</label>
          <p style="font-size: 1.2rem; color: #999; margin: 1rem 0;">
            Haz clic en el botón para cargar desde tu computadora (JPG/PNG, máx 5MB)
          </p>
          <input type="file" id="g1_image" accept="image/jpeg,image/png" style="display: none;">
          <button class="btn btn-primary" onclick="document.getElementById('g1_image').click();" style="width: 100%; padding: 1.5rem; font-size: 1.5rem;">
            📁 Seleccionar imagen
          </button>
          <div id="g1_image_preview" style="margin-top: 1rem; max-width: 400px; text-align: center;"></div>
        </div>

        <div class="form-group">
          <label>Puntos por defecto para cada elemento</label>
          <input type="number" id="g1_default_points" value="10" min="1" max="100">
        </div>

        <h3 style="margin-top: 2rem; margin-bottom: 1rem;">Elementos en la imagen</h3>
        <div id="g1_elements" class="dynamic-list"></div>

        <button class="btn btn-secondary" onclick="App.addGame1Element()" style="margin-top: 1rem;">+ Añadir elemento</button>

        <div style="margin-top: 2rem; display: flex; gap: 1rem; justify-content: center;">
          <button class="btn btn-success" onclick="App.saveGame1Round()">Guardar Ronda</button>
          <button class="btn btn-danger" onclick="App.goToGame(1)">Cancelar</button>
        </div>
      </div>
    `;

    // Usar setTimeout para garantizar que el DOM esté listo
    setTimeout(() => {
      try {
        // Evento para preview de imagen
        const imageInput = document.getElementById('g1_image');
        if (imageInput) {
          imageInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
              const error = Utils.validateImage(file);
              if (error) {
                Utils.showNotification(error, 'error');
                return;
              }

              const reader = new FileReader();
              reader.onload = (event) => {
                const preview = document.getElementById('g1_image_preview');
                if (preview) {
                  preview.innerHTML = `
                    <div style="background: rgba(0,0,0,0.3); padding: 1rem; border-radius: 8px;">
                      <p style="margin-bottom: 1rem; font-size: 1.2rem; color: #00ff00;">✅ Imagen cargada</p>
                      <img src="${event.target.result}" style="max-width: 100%; border-radius: 8px; border: 2px solid #0066cc;">
                    </div>
                  `;
                }
                window.g1_imageData = event.target.result;
              };
              reader.readAsDataURL(file);
            }
          });
        }

        // Cargar elementos existentes o crear uno nuevo
        this.addGame1Element();
      } catch (err) {
        console.error('Error en renderGame1Editor:', err);
      }
    }, 100);
  },

  addGame1Element() {
    const container = document.getElementById('g1_elements');
    const id = Utils.generateId();
    const div = document.createElement('div');
    div.className = 'list-item';
    div.id = `elem_${id}`;
    div.innerHTML = `
      <input type="text" placeholder="Nombre del elemento" class="elem-name">
      <input type="number" placeholder="Puntos" value="10" min="1" max="100" class="elem-points" style="max-width: 100px;">
      <button class="btn btn-danger btn-small" onclick="document.getElementById('elem_${id}').remove()">X</button>
    `;
    container.appendChild(div);
  },

  saveGame1Round() {
    const title = document.getElementById('g1_title').value.trim();
    const description = document.getElementById('g1_description').value.trim();
    const imageData = window.g1_imageData;
    const defaultPoints = parseInt(document.getElementById('g1_default_points').value);

    if (!title) return Utils.showNotification('Falta el título', 'error');
    if (!imageData) return Utils.showNotification('Falta cargar la imagen', 'error');

    const elements = [];
    document.querySelectorAll('#g1_elements .list-item').forEach(item => {
      const name = item.querySelector('.elem-name').value.trim();
      const points = parseInt(item.querySelector('.elem-points').value) || defaultPoints;
      if (name) {
        elements.push({ name, points });
      }
    });

    if (elements.length < 2) {
      return Utils.showNotification('Se requieren al menos 2 elementos', 'error');
    }

    const error = Game1.createRound({
      title,
      description,
      image: imageData,
      elements
    });

    if (error) {
      Utils.showNotification(error, 'error');
    } else {
      Utils.showNotification('Ronda guardada', 'success');
      this.goToGame(1);
    }
  },

  startGame1(roundId) {
    console.log('startGame1 called with roundId:', roundId);
    const round = Game1.loadRound(roundId);
    console.log('Loaded round:', round);
    if (!round) {
      Utils.showNotification('Error al cargar la ronda', 'error');
      console.error('Game1 rounds:', Game1.getRounds());
      return;
    }
    window.gamePlayContentId = roundId;
    this.currentView = 'game1-play';
    this.render();
  },

  renderGame1Play(content) {
    const round = Game1.currentRound;
    let session = Game1.session;
    const config = this.config;

    if (!round) {
      content.innerHTML = '<div style="text-align: center; margin-top: 3rem;"><p style="font-size: 2rem; color: #ff6666;">❌ Error: Ronda no cargada</p></div>';
      return;
    }

    // Inicializar sesión si no existe
    if (!session) {
      Game1.init();
      session = Game1.session;
    }

    const blurClass = Game1.getBlurClass();
    
    // Construir HTML de elementos
    const elementsHTML = round.elements.map(elem => {
      const guessedClass = elem.guessedBy ? `guessed by-${elem.guessedBy}` : '';
      const guessedInfo = elem.guessedBy ? ` (${config.teams[elem.guessedBy].name})` : '';
      return `<li class="element-item ${guessedClass}" onclick="App.selectElement('${elem.id}')" id="elem_${elem.id}">
                <strong>${elem.name}</strong> - ${elem.points} pts${guessedInfo}
              </li>`;
    }).join('');

    const html = `<div style="display: flex; flex-direction: column; height: 100%; gap: 1.5rem;">
      <div class="game1-container">
        <div class="game1-image-area">
          <h2 style="margin: 0; font-size: 2.5rem;">${round.title}</h2>
          <div class="game1-image-container">
            <img id="gameImage" src="${round.image}" class="game1-image ${blurClass}" style="width: 100%; height: 100%; object-fit: contain;">
          </div>
          <p style="margin: 0; opacity: 0.7; font-size: 1.2rem;">Adivinanzas: ${round.guessedElements.length}/${round.elements.length}</p>
        </div>

        <div class="game1-controls-panel animator-only">
          <h3 style="margin: 0 0 1rem 0;">Elementos</h3>
          <ul class="elements-list">
            ${elementsHTML}
          </ul>

          <div style="margin-top: auto; display: flex; flex-direction: column; gap: 1rem;">
            <div id="selectedElementInfo" style="background: rgba(255,255,255,0.1); padding: 1rem; border-radius: 8px; min-height: 60px; font-size: 1.2rem;">Selecciona un elemento</div>

            <div style="display: flex; gap: 0.5rem;">
              <button class="btn btn-success" style="flex: 1; padding: 1rem;" onclick="App.markElementGame1('left')">✓ ${config.teams.left.name}</button>
              <button class="btn btn-danger" style="flex: 1; padding: 1rem;" onclick="App.markElementGame1('right')">✓ ${config.teams.right.name}</button>
            </div>

            <hr style="opacity: 0.3; margin: 0;">

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <button class="btn btn-primary" onclick="App.guessImageGame1('left')" style="padding: 1rem;">Adivina ${config.teams.left.name}</button>
              <button class="btn btn-danger" onclick="App.guessImageGame1('right')" style="padding: 1rem;">Adivina ${config.teams.right.name}</button>
            </div>

            <button class="btn btn-secondary" onclick="App.closeRoundGame1()" style="padding: 1rem;">Cerrar Ronda</button>
            <button class="btn btn-danger" onclick="App.restartGame1()" style="padding: 1rem;">Reiniciar</button>
          </div>
        </div>
      </div>

      <div class="scoreboard game1-scoreboard">
        <div class="team-score left">
          <div class="team-name">${config.teams.left.name}</div>
          <div class="team-score-value">${session.leftTeamPoints}</div>
          <div class="team-score-label">Puntos por elementos</div>
          <div class="rounds-won">Rondas ganadas: ${session.roundsWon.left}</div>
          <div style="margin-top: 1rem; display: flex; gap: 0.5rem; justify-content: center;" class="animator-only">
            <button class="btn btn-success btn-small" onclick="Game1.adjustPoints('left', 1); App.render()">+1</button>
            <button class="btn btn-danger btn-small" onclick="Game1.adjustPoints('left', -1); App.render()">-1</button>
          </div>
        </div>
        <div class="team-score right">
          <div class="team-name">${config.teams.right.name}</div>
          <div class="team-score-value">${session.rightTeamPoints}</div>
          <div class="team-score-label">Puntos por elementos</div>
          <div class="rounds-won">Rondas ganadas: ${session.roundsWon.right}</div>
          <div style="margin-top: 1rem; display: flex; gap: 0.5rem; justify-content: center;" class="animator-only">
            <button class="btn btn-success btn-small" onclick="Game1.adjustPoints('right', 1); App.render()">+1</button>
            <button class="btn btn-danger btn-small" onclick="Game1.adjustPoints('right', -1); App.render()">-1</button>
          </div>
        </div>
      </div>
    </div>`;

    content.innerHTML = html;

    // Configurar interactividad después de renderizar
    setTimeout(() => {
      window.selectedElementId = null;
      window.updateElementInfo = () => {
        const info = document.getElementById('selectedElementInfo');
        if (window.selectedElementId) {
          const elem = round.elements.find(e => e.id === window.selectedElementId);
          if (elem) {
            info.innerHTML = `<strong>Seleccionado:</strong> ${elem.name} (${elem.points} puntos)`;
          }
        } else {
          info.innerHTML = 'Selecciona un elemento';
        }
      };
      window.updateElementInfo();
    }, 50);
  },

  selectElement(elementId) {
    window.selectedElementId = elementId;
    window.updateElementInfo();
    document.querySelectorAll('.element-item').forEach(e => e.style.background = '');
    document.getElementById(`elem_${elementId}`).style.background = 'rgba(255,255,0,0.3)';
  },

  markElementGame1(teamSide) {
    if (!window.selectedElementId) {
      Utils.showNotification('Selecciona un elemento', 'error');
      return;
    }

    const error = Game1.markElement(window.selectedElementId, teamSide);
    if (error) {
      Utils.showNotification(error, 'error');
    } else {
      this.render();
    }
  },

  guessImageGame1(teamSide) {
    const error = Game1.attemptGuessImage(teamSide);
    if (error) {
      Swal.fire({
        title: 'No permitido',
        text: error,
        icon: 'warning',
        confirmButtonColor: '#0066cc'
      });
      return;
    }

    Swal.fire({
      title: `¿${this.config.teams[teamSide].name} adivina?`,
      text: `"${Game1.currentRound.description}"`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, adivinamos',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#00aa00',
      cancelButtonColor: '#999'
    }).then((result) => {
      if (result.isConfirmed) {
        Game1.winByGuess(teamSide);
        Swal.fire({
          title: '¡Correcto!',
          text: `¡${this.config.teams[teamSide].name} adivinó la imagen!`,
          icon: 'success',
          confirmButtonColor: '#00aa00'
        }).then(() => {
          Swal.fire({
            title: '¿Jugar otra ronda?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí',
            cancelButtonText: 'No, volver al menú',
            confirmButtonColor: '#00aa00',
            cancelButtonColor: '#cc0000'
          }).then((result2) => {
            if (result2.isConfirmed) {
              this.goToGame(1);
            } else {
              this.goToMenu();
            }
          });
        });
      } else {
        Game1.failGuess(teamSide);
        Swal.fire({
          title: 'Incorrecto',
          text: `${this.config.teams[teamSide].name} falló`,
          icon: 'error',
          confirmButtonColor: '#cc0000'
        }).then(() => {
          this.render();
        });
      }
    });
  },

  closeRoundGame1() {
    Game1.closeRound();
    const winner = Game1.currentRound.winner;
    let message = '';

    if (winner === 'tie') {
      message = '¡EMPATE!';
    } else {
      message = `¡${this.config.teams[winner].name} gana la ronda!`;
    }

    Swal.fire({
      title: 'Ronda cerrada',
      text: message,
      icon: 'success',
      confirmButtonColor: '#00aa00'
    }).then(() => {
      Swal.fire({
        title: '¿Jugar otra ronda?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí',
        cancelButtonText: 'No, volver al menú',
        confirmButtonColor: '#00aa00',
        cancelButtonColor: '#cc0000'
      }).then((result) => {
        if (result.isConfirmed) {
          this.goToGame(1);
        } else {
          this.goToMenu();
        }
      });
    });
  },

  restartGame1() {
    Utils.showConfirm('Reiniciar', '¿Reiniciar el juego? Los puntos se pondrán a cero.').then((confirmed) => {
      if (confirmed) {
        Game1.restartRound();
        this.render();
      }
    });
  },

  // === GAME 2 ===
  renderGame2Select(content) {
    const verses = Game2.getVerses();
    
    content.innerHTML = `
      <div style="text-align: center;">
        <h2 style="margin-bottom: 2rem; font-size: 3rem;">Juego 2: Completa el Versículo</h2>
        
        <button class="btn btn-primary" onclick="App.goToGameEditor(2)" style="width: 300px; padding: 1.5rem; font-size: 1.8rem; margin-bottom: 2rem;">
          ➕ Nuevo Versículo
        </button>

        <div style="max-width: 900px; margin: 0 auto;">
          ${verses.map(v => `
            <div style="background: rgba(0,0,0,0.5); padding: 1.5rem; margin: 1rem 0; border-radius: 8px; display: flex; justify-content: space-between; align-items: center;">
              <div style="text-align: left; flex: 1;">
                <h3 style="font-size: 1.6rem; margin-bottom: 0.5rem;">${v.citation}</h3>
                <p style="font-size: 1.2rem; opacity: 0.8;">Dificultad: ${v.difficulty === 'kids' ? 'Niños' : v.difficulty === 'youth' ? 'Jóvenes' : 'Adultos'}
                ${v.example ? ' <span style="color: #ff9900;">[Ejemplo]</span>' : ''}</p>
              </div>
              <div style="display: flex; gap: 1rem;">
                <button class="btn btn-success" onclick="App.startGame2('${v.id}')">Jugar</button>
                ${!v.example ? `<button class="btn btn-danger btn-small" onclick="Game2.deleteVerse('${v.id}'); App.goToGame(2)">Eliminar</button>` : ''}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  renderGame2Editor(content) {
    content.innerHTML = `
      <div class="editor-form">
        <h2 style="margin-bottom: 2rem;">Nuevo Versículo</h2>

        <div class="form-group">
          <label>Referencia bíblica</label>
          <input type="text" id="g2_citation" placeholder="Ej: Salmos 23:1">
        </div>

        <div class="form-group">
          <label>Texto completo</label>
          <textarea id="g2_text" placeholder="Marca palabras con [corchetes]&#10;Ej: El Señor es mi [pastor]; nada me [faltará]"></textarea>
        </div>

        <div class="form-group">
          <label>Dificultad</label>
          <select id="g2_difficulty">
            <option value="kids">Niños (1-2 palabras)</option>
            <option value="youth" selected>Jóvenes (3-4 palabras)</option>
            <option value="adults">Adultos (5+ palabras)</option>
          </select>
        </div>

        <div class="form-group">
          <label>Puntos por palabra</label>
          <input type="number" id="g2_points" value="1" min="1" max="10">
        </div>

        <button class="btn btn-secondary" onclick="App.generateAutoHiddenGame2()">Generar automáticamente</button>

        <div style="margin-top: 2rem; display: flex; gap: 1rem; justify-content: center;">
          <button class="btn btn-success" onclick="App.saveGame2Verse()">Guardar Versículo</button>
          <button class="btn btn-danger" onclick="App.goToGame(2)">Cancelar</button>
        </div>
      </div>
    `;
  },

  generateAutoHiddenGame2() {
    const text = document.getElementById('g2_text').value.trim();
    const difficulty = document.getElementById('g2_difficulty').value;

    if (!text) {
      Utils.showNotification('Escribe el texto primero', 'error');
      return;
    }

    const modified = Game2.generateAutoHiddenWords(text, difficulty);
    document.getElementById('g2_text').value = modified;
    Utils.showNotification('Palabras generadas automáticamente', 'success');
  },

  saveGame2Verse() {
    const citation = document.getElementById('g2_citation').value.trim();
    const fullText = document.getElementById('g2_text').value.trim();
    const difficulty = document.getElementById('g2_difficulty').value;
    const pointsPerWord = parseInt(document.getElementById('g2_points').value);

    if (!citation || !fullText) {
      Utils.showNotification('Faltan datos', 'error');
      return;
    }

    const error = Game2.createVerse({
      citation,
      fullText,
      difficulty,
      pointsPerWord
    });

    if (error) {
      Utils.showNotification(error, 'error');
    } else {
      Utils.showNotification('Versículo guardado', 'success');
      this.goToGame(2);
    }
  },

  startGame2(verseId) {
    // Recargar versículos del storage para asegurar que tenemos los más actualizados
    Game2.verses = Storage.getGame2Verses();
    
    const verse = Game2.loadVerseById(verseId);
    if (!verse) {
      Swal.fire({
        title: 'Error',
        text: 'No se pudo cargar el versículo',
        icon: 'error',
        confirmButtonColor: '#cc0000'
      });
      return;
    }
    window.gamePlayContentId = verseId;
    this.currentView = 'game2-play';
    this.render();
  },

  renderGame2Play(content) {
    let verse = Game2.currentVerseParsed;
    let session = Game2.session;
    const config = this.config;

    // Si no hay versículo cargado, cargar uno al azar
    if (!verse) {
      verse = Game2.loadRandomVerse();
      session = Game2.session;
    }

    if (!verse) {
      content.innerHTML = '<p style="text-align: center; font-size: 2rem; color: #ff6666;">Error: versículo no cargado</p>';
      return;
    }

    const blank = verse.blanks[verse.currentBlankIndex];
    const hiddenWordsHtml = verse.fullText.replace(/\[([^\]]+)\]/g, (match, word) => {
      const idx = verse.blanks.findIndex(b => b.word === word);
      const revealed = verse.blanks[idx]?.revealed;
      const guessedBy = verse.blanks[idx]?.guessedBy;
      
      if (revealed) {
        const color = guessedBy === 'left' ? 'var(--color-left)' : guessedBy === 'right' ? 'var(--color-right)' : '#999';
        return `<span style="color: ${color}; font-weight: bold;">[${word}]</span>`;
      } else {
        return `<span class="word-blank ${idx === verse.currentBlankIndex ? 'selected' : ''}" onclick="App.selectBlankGame2(${idx})" style="cursor: pointer;">____</span>`;
      }
    });

    const html = `<div style="display: flex; flex-direction: column; height: 100%; gap: 2rem;">
      <div class="game2-container">
        <div class="verse-citation">${verse.citation}</div>
        
        <div class="verse-text" id="verseDisplay">${hiddenWordsHtml}</div>

        <div class="game2-controls animator-only">
          <div style="display: flex; gap: 1rem; justify-content: center;">
            <button class="btn btn-success" onclick="App.guessGame2('left')" style="flex: 1;">✓ ${config.teams.left.name}</button>
            <button class="btn btn-danger" onclick="App.guessGame2('right')" style="flex: 1;">✓ ${config.teams.right.name}</button>
            <button class="btn btn-secondary" onclick="App.guessGame2('none')" style="flex: 1;">⊘ Nadie</button>
          </div>

          <div style="display: flex; gap: 1rem; justify-content: center;">
            <button class="btn btn-primary" onclick="App.prevBlankGame2()" style="flex: 1;">← Anterior Palabra</button>
            <button class="btn btn-primary" onclick="App.nextBlankGame2()" style="flex: 1;">Siguiente Palabra →</button>
          </div>

          <div style="display: flex; gap: 1rem; justify-content: center;">
            <button class="btn btn-danger" onclick="App.restartGame2()" style="flex: 1;">Reiniciar</button>
            <button class="btn btn-secondary" onclick="App.endGameGame2()" style="flex: 1;">Cerrar Juego</button>
          </div>
        </div>
      </div>

      <div class="scoreboard game1-scoreboard">
        <div class="team-score left">
          <div class="team-name">${config.teams.left.name}</div>
          <div class="team-score-value">${session.leftTeamPoints}</div>
          <div class="team-score-label">Puntos</div>
        </div>
        <div class="team-score right">
          <div class="team-name">${config.teams.right.name}</div>
          <div class="team-score-value">${session.rightTeamPoints}</div>
          <div class="team-score-label">Puntos</div>
        </div>
      </div>
    </div>`;

    content.innerHTML = html;
  },

  selectBlankGame2(index) {
    Game2.currentVerseParsed.currentBlankIndex = index;
    this.render();
  },

  guessGame2(teamSide) {
    const error = Game2.revealWord(teamSide === 'none' ? null : teamSide);
    if (error) {
      Utils.showNotification(error, 'error');
      return;
    }

    const isLast = Game2.nextBlank();
    if (isLast) {
      // PASO 1: Mostrar el versículo COMPLETO (sin modal)
      this.render();
      
      // PASO 2: Esperar 2 segundos y luego mostrar puntajes
      setTimeout(() => {
        const leftPts = Game2.session.leftTeamPoints;
        const rightPts = Game2.session.rightTeamPoints;
        
        let winnerName = '';
        let winnerColor = '#00aa00';
        let winnerIcon = '🏆';
        let htmlContent = '';
        
        if (leftPts > rightPts) {
          winnerName = this.config.teams.left.name;
          winnerColor = this.config.teams.left.color;
          htmlContent = `
            <div style="text-align: center;">
              <div style="font-size: 3rem; margin-bottom: 1rem;">${winnerIcon}</div>
              <h2 style="color: ${winnerColor}; font-size: 2rem; margin-bottom: 1rem;">¡${winnerName} gana!</h2>
              <div style="background: rgba(0,0,0,0.5); padding: 2rem; border-radius: 12px; margin-bottom: 1rem;">
                <div style="display: flex; justify-content: space-around; align-items: center; gap: 2rem;">
                  <div style="flex: 1;">
                    <div style="font-size: 1.2rem; margin-bottom: 0.5rem; opacity: 0.8;">${this.config.teams.left.name}</div>
                    <div style="font-size: 3rem; font-weight: bold; color: ${this.config.teams.left.color};">${leftPts}</div>
                    <div style="font-size: 0.9rem; opacity: 0.7; margin-top: 0.5rem;">puntos</div>
                  </div>
                  <div style="font-size: 2rem; opacity: 0.5;">vs</div>
                  <div style="flex: 1;">
                    <div style="font-size: 1.2rem; margin-bottom: 0.5rem; opacity: 0.8;">${this.config.teams.right.name}</div>
                    <div style="font-size: 3rem; font-weight: bold; color: ${this.config.teams.right.color};">${rightPts}</div>
                    <div style="font-size: 0.9rem; opacity: 0.7; margin-top: 0.5rem;">puntos</div>
                  </div>
                </div>
              </div>
            </div>
          `;
        } else if (rightPts > leftPts) {
          winnerName = this.config.teams.right.name;
          winnerColor = this.config.teams.right.color;
          htmlContent = `
            <div style="text-align: center;">
              <div style="font-size: 3rem; margin-bottom: 1rem;">${winnerIcon}</div>
              <h2 style="color: ${winnerColor}; font-size: 2rem; margin-bottom: 1rem;">¡${winnerName} gana!</h2>
              <div style="background: rgba(0,0,0,0.5); padding: 2rem; border-radius: 12px; margin-bottom: 1rem;">
                <div style="display: flex; justify-content: space-around; align-items: center; gap: 2rem;">
                  <div style="flex: 1;">
                    <div style="font-size: 1.2rem; margin-bottom: 0.5rem; opacity: 0.8;">${this.config.teams.left.name}</div>
                    <div style="font-size: 3rem; font-weight: bold; color: ${this.config.teams.left.color};">${leftPts}</div>
                    <div style="font-size: 0.9rem; opacity: 0.7; margin-top: 0.5rem;">puntos</div>
                  </div>
                  <div style="font-size: 2rem; opacity: 0.5;">vs</div>
                  <div style="flex: 1;">
                    <div style="font-size: 1.2rem; margin-bottom: 0.5rem; opacity: 0.8;">${this.config.teams.right.name}</div>
                    <div style="font-size: 3rem; font-weight: bold; color: ${this.config.teams.right.color};">${rightPts}</div>
                    <div style="font-size: 0.9rem; opacity: 0.7; margin-top: 0.5rem;">puntos</div>
                  </div>
                </div>
              </div>
            </div>
          `;
        } else {
          winnerName = 'EMPATE';
          winnerIcon = '⚖️';
          htmlContent = `
            <div style="text-align: center;">
              <div style="font-size: 3rem; margin-bottom: 1rem;">${winnerIcon}</div>
              <h2 style="color: #ffaa00; font-size: 2rem; margin-bottom: 1rem;">¡EMPATE!</h2>
              <div style="background: rgba(0,0,0,0.5); padding: 2rem; border-radius: 12px; margin-bottom: 1rem;">
                <div style="display: flex; justify-content: space-around; align-items: center; gap: 2rem;">
                  <div style="flex: 1;">
                    <div style="font-size: 1.2rem; margin-bottom: 0.5rem; opacity: 0.8;">${this.config.teams.left.name}</div>
                    <div style="font-size: 3rem; font-weight: bold; color: ${this.config.teams.left.color};">${leftPts}</div>
                    <div style="font-size: 0.9rem; opacity: 0.7; margin-top: 0.5rem;">puntos</div>
                  </div>
                  <div style="font-size: 2rem; opacity: 0.5;">=</div>
                  <div style="flex: 1;">
                    <div style="font-size: 1.2rem; margin-bottom: 0.5rem; opacity: 0.8;">${this.config.teams.right.name}</div>
                    <div style="font-size: 3rem; font-weight: bold; color: ${this.config.teams.right.color};">${rightPts}</div>
                    <div style="font-size: 0.9rem; opacity: 0.7; margin-top: 0.5rem;">puntos</div>
                  </div>
                </div>
              </div>
            </div>
          `;
        }

        // PASO 3: Mostrar modal de puntajes
        Swal.fire({
          html: htmlContent,
          icon: 'success',
          confirmButtonColor: winnerColor,
          confirmButtonText: 'Siguiente',
          allowOutsideClick: false,
          allowEscapeKey: false
        }).then(() => {
          // Cargar siguiente versículo SIN REINICIAR PUNTOS (se acumulan)
          this.nextVerseGame2Auto();
        });
      }, 2000);
    } else {
      this.render();
    }
  },

  prevBlankGame2() {
    Game2.prevBlank();
    this.render();
  },

  nextBlankGame2() {
    Game2.nextBlank();
    this.render();
  },

  nextVerseGame2() {
    // Cargar el siguiente versículo sin repetir
    // IMPORTANTE: NO reinicia puntos (se acumulan)
    const verse = Game2.loadRandomVerse();
    if (verse) {
      this.render();
    } else {
      Utils.showNotification('No hay más versículos disponibles. Reinicia para volver a jugar.', 'info');
    }
  },

  nextVerseGame2Auto() {
    // Cargar el siguiente versículo automáticamente (después de completar)
    // IMPORTANTE: NO reinicia puntos (se acumulan entre versículos)
    const verse = Game2.loadRandomVerse();
    if (verse) {
      this.render();
    } else {
      Utils.showNotification('No hay más versículos disponibles. Reinicia para volver a jugar.', 'info');
    }
  },

  endGameGame2() {
    const result = Game2.endGame();
    let winnerColor = '#00aa00';
    let winnerIcon = '🏆';
    
    let htmlContent = '';
    
    if (result.winner === 'tie') {
      winnerIcon = '⚖️';
      winnerColor = '#ffaa00';
      htmlContent = `<div style="text-align: center; padding: 0;"><div style="font-size: 5rem; margin: 2rem 0 1rem 0; animation: bounce 1s infinite;">${winnerIcon}</div><h1 style="color: ${winnerColor}; font-size: 3.5rem; margin: 1rem 0 2rem 0; font-weight: 900; letter-spacing: 2px;">¡EMPATE!</h1><div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin: 2rem 0; padding: 0 1rem;"><div style="background: linear-gradient(135deg, rgba(0,102,204,0.3), rgba(0,102,204,0.1)); padding: 2.5rem 1.5rem; border-radius: 20px; border: 3px solid #0066cc; position: relative; overflow: hidden;"><div style="position: absolute; top: -50%; right: -50%; width: 200%; height: 200%; background: radial-gradient(circle, rgba(0,102,204,0.1) 0%, transparent 70%); pointer-events: none;"></div><div style="position: relative; z-index: 1;"><div style="font-size: 1.8rem; margin-bottom: 1rem; opacity: 0.9; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">${this.config.teams.left.name}</div><div style="font-size: 5rem; font-weight: 900; color: #0066cc; line-height: 1; margin: 1rem 0;">${result.leftPoints}</div><div style="font-size: 1.2rem; opacity: 0.8; margin-top: 1rem; text-transform: uppercase; font-weight: bold;">Puntos</div></div></div><div style="display: flex; align-items: center; justify-content: center;"><div style="font-size: 3rem; opacity: 0.4; font-weight: bold;">=</div></div><div style="grid-column: 2; background: linear-gradient(135deg, rgba(204,0,0,0.3), rgba(204,0,0,0.1)); padding: 2.5rem 1.5rem; border-radius: 20px; border: 3px solid #cc0000; position: relative; overflow: hidden;"><div style="position: absolute; top: -50%; right: -50%; width: 200%; height: 200%; background: radial-gradient(circle, rgba(204,0,0,0.1) 0%, transparent 70%); pointer-events: none;"></div><div style="position: relative; z-index: 1;"><div style="font-size: 1.8rem; margin-bottom: 1rem; opacity: 0.9; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">${this.config.teams.right.name}</div><div style="font-size: 5rem; font-weight: 900; color: #cc0000; line-height: 1; margin: 1rem 0;">${result.rightPoints}</div><div style="font-size: 1.2rem; opacity: 0.8; margin-top: 1rem; text-transform: uppercase; font-weight: bold;">Puntos</div></div></div></div><div style="background: linear-gradient(135deg, #ffaa00, #ff8800); padding: 2rem; border-radius: 16px; margin: 2rem 0; position: relative; overflow: hidden; box-shadow: 0 0 40px #ffaa0099;"><div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: radial-gradient(circle at 50% 0%, rgba(255,255,255,0.1), transparent); pointer-events: none;"></div><div style="position: relative; z-index: 1;"><div style="font-size: 1.2rem; opacity: 0.9; margin-bottom: 0.5rem; text-transform: uppercase; font-weight: bold; letter-spacing: 1px;">Resultado Final</div><div style="font-size: 2.5rem; font-weight: 900;">EMPATE PERFECTO</div></div></div></div>`;
    } else {
      const winner = result.winner === 'left' ? this.config.teams.left.name : this.config.teams.right.name;
      const winnerPoints = result.winner === 'left' ? result.leftPoints : result.rightPoints;
      const leftBg = result.winner === 'left' ? 'box-shadow: 0 0 30px rgba(0,102,204,0.5), inset 0 0 20px rgba(0,102,204,0.2);' : '';
      const rightBg = result.winner === 'right' ? 'box-shadow: 0 0 30px rgba(204,0,0,0.5), inset 0 0 20px rgba(204,0,0,0.2);' : '';
      winnerColor = result.winner === 'left' ? this.config.teams.left.color : this.config.teams.right.color;
      const gradient = result.winner === 'left' ? 'linear-gradient(135deg, #0066cc, #003d99)' : 'linear-gradient(135deg, #cc0000, #990000)';
      
      htmlContent = `<div style="text-align: center; padding: 0;"><div style="font-size: 5rem; margin: 2rem 0 1rem 0; animation: bounce 1s infinite;">${winnerIcon}</div><h1 style="color: ${winnerColor}; font-size: 3.5rem; margin: 1rem 0 0.5rem 0; font-weight: 900; letter-spacing: 2px;">¡${winner}</h1><p style="font-size: 1.8rem; opacity: 0.7; margin-bottom: 2rem; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">GANA!</p><div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin: 2rem 0; padding: 0 1rem;"><div style="background: linear-gradient(135deg, rgba(0,102,204,0.3), rgba(0,102,204,0.1)); padding: 2.5rem 1.5rem; border-radius: 20px; border: 3px solid #0066cc; position: relative; overflow: hidden; ${leftBg}"><div style="position: absolute; top: -50%; right: -50%; width: 200%; height: 200%; background: radial-gradient(circle, rgba(0,102,204,0.1) 0%, transparent 70%); pointer-events: none;"></div><div style="position: relative; z-index: 1;"><div style="font-size: 1.8rem; margin-bottom: 1rem; opacity: 0.9; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">${this.config.teams.left.name}</div><div style="font-size: 5rem; font-weight: 900; color: #0066cc; line-height: 1; margin: 1rem 0;">${result.leftPoints}</div><div style="font-size: 1.2rem; opacity: 0.8; margin-top: 1rem; text-transform: uppercase; font-weight: bold;">Puntos</div></div></div><div style="display: flex; align-items: center; justify-content: center;"><div style="font-size: 3rem; opacity: 0.4; font-weight: bold;">vs</div></div><div style="grid-column: 2; background: linear-gradient(135deg, rgba(204,0,0,0.3), rgba(204,0,0,0.1)); padding: 2.5rem 1.5rem; border-radius: 20px; border: 3px solid #cc0000; position: relative; overflow: hidden; ${rightBg}"><div style="position: absolute; top: -50%; right: -50%; width: 200%; height: 200%; background: radial-gradient(circle, rgba(204,0,0,0.1) 0%, transparent 70%); pointer-events: none;"></div><div style="position: relative; z-index: 1;"><div style="font-size: 1.8rem; margin-bottom: 1rem; opacity: 0.9; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">${this.config.teams.right.name}</div><div style="font-size: 5rem; font-weight: 900; color: #cc0000; line-height: 1; margin: 1rem 0;">${result.rightPoints}</div><div style="font-size: 1.2rem; opacity: 0.8; margin-top: 1rem; text-transform: uppercase; font-weight: bold;">Puntos</div></div></div></div><div style="background: ${gradient}; padding: 2rem; border-radius: 16px; margin: 2rem 0; position: relative; overflow: hidden; box-shadow: 0 0 40px ${winnerColor}99;"><div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: radial-gradient(circle at 50% 0%, rgba(255,255,255,0.1), transparent); pointer-events: none;"></div><div style="position: relative; z-index: 1;"><div style="font-size: 1.2rem; opacity: 0.9; margin-bottom: 0.5rem; text-transform: uppercase; font-weight: bold; letter-spacing: 1px;">Victoria con</div><div style="font-size: 3rem; font-weight: 900;">${winnerPoints} Puntos</div></div></div></div>`;
    }

    Swal.fire({
      html: htmlContent,
      icon: false,
      confirmButtonColor: winnerColor,
      confirmButtonText: '← Volver al Menú',
      allowOutsideClick: false,
      allowEscapeKey: false,
      width: '90%',
      padding: '2rem',
      backdrop: 'rgba(0,0,0,0.9)',
      didOpen: () => {
        const style = document.createElement('style');
        style.textContent = `@keyframes bounce { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.15); } }`;
        document.head.appendChild(style);
      }
    }).then(() => {
      this.goToMenu();
    });
  },

  restartGame2() {
    Swal.fire({
      title: 'Reiniciar',
      text: '¿Reiniciar el juego? Los puntos vuelven a 0-0',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#00aa00',
      cancelButtonColor: '#cc0000',
      allowOutsideClick: false,
      allowEscapeKey: false
    }).then((result) => {
      if (result.isConfirmed) {
        // Limpiar TODO: versículos usados, puntos, sesión actual
        Game2.usedVerseIds = [];
        Storage.setGame2UsedVerses([]);
        
        // REINICIAR PUNTOS A 0-0
        Game2.session.leftTeamPoints = 0;
        Game2.session.rightTeamPoints = 0;
        Game2.session.completedVerses = [];
        Storage.setGame2Session(Game2.session);
        
        Game2.currentVerse = null;
        Game2.currentVerseParsed = null;
        
        // Cargar versículo nuevo sin repetir
        if (Game2.verses.length > 0) {
          const verse = Game2.loadRandomVerse();
          if (verse) {
            this.render();
          }
        }
      }
    });
  },

  // === GAME 3 ===
  renderGame3Select(content) {
    const stories = Game3.getStories();
    
    content.innerHTML = `
      <div style="text-align: center;">
        <h2 style="margin-bottom: 2rem; font-size: 3rem;">Juego 3: Ordena la Historia</h2>
        
        <button class="btn btn-primary" onclick="App.goToGameEditor(3)" style="width: 300px; padding: 1.5rem; font-size: 1.8rem; margin-bottom: 2rem;">
          ➕ Nueva Historia
        </button>

        <div style="max-width: 900px; margin: 0 auto;">
          ${stories.map(s => `
            <div style="background: rgba(0,0,0,0.5); padding: 1.5rem; margin: 1rem 0; border-radius: 8px; display: flex; justify-content: space-between; align-items: center;">
              <div style="text-align: left; flex: 1;">
                <h3 style="font-size: 1.6rem; margin-bottom: 0.5rem;">${s.title}</h3>
                <p style="font-size: 1.2rem; opacity: 0.8;">${s.facts.length} hechos
                ${s.example ? ' <span style="color: #ff9900;">[Ejemplo]</span>' : ''}</p>
              </div>
              <div style="display: flex; gap: 1rem;">
                <button class="btn btn-success" onclick="App.startGame3('${s.id}')">Jugar</button>
                ${!s.example ? `<button class="btn btn-danger btn-small" onclick="Game3.deleteStory('${s.id}'); App.goToGame(3)">Eliminar</button>` : ''}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  renderGame3Editor(content) {
    content.innerHTML = `
      <div class="editor-form">
        <h2 style="margin-bottom: 2rem;">Nueva Historia</h2>

        <div class="form-group">
          <label>Título de la historia</label>
          <input type="text" id="g3_title" placeholder="Ej: La historia de José">
        </div>

        <h3 style="margin-top: 2rem; margin-bottom: 1rem;">5 Hechos en orden cronológico correcto</h3>
        <div id="g3_facts" class="dynamic-list"></div>

        <div class="form-group" style="margin-top: 2rem;">
          <label>Tiempo límite (minutos)</label>
          <input type="number" id="g3_time_min" value="2" min="0" max="10">
          <small>Pon 0 para sin límite</small>
        </div>

        <div class="form-group">
          <label>Penalización por error (segundos)</label>
          <input type="number" id="g3_penalty" value="5" min="0" max="30">
        </div>

        <div style="margin-top: 2rem; display: flex; gap: 1rem; justify-content: center;">
          <button class="btn btn-success" onclick="App.saveGame3Story()">Guardar Historia</button>
          <button class="btn btn-danger" onclick="App.goToGame(3)">Cancelar</button>
        </div>
      </div>
    `;

    // Crear 5 textareas para hechos
    const container = document.getElementById('g3_facts');
    for (let i = 1; i <= 5; i++) {
      const div = document.createElement('div');
      div.className = 'form-group';
      div.innerHTML = `
        <label>Hecho ${i}</label>
        <textarea class="g3_fact" placeholder="Describe el hecho..." style="min-height: 60px;"></textarea>
      `;
      container.appendChild(div);
    }
  },

  saveGame3Story() {
    const title = document.getElementById('g3_title').value.trim();
    const facts = [];
    document.querySelectorAll('.g3_fact').forEach(ta => {
      const text = ta.value.trim();
      if (text) facts.push(text);
    });
    const timeMin = parseInt(document.getElementById('g3_time_min').value) || 0;
    const penalty = parseInt(document.getElementById('g3_penalty').value) || 5;

    if (!title) return Utils.showNotification('Falta el título', 'error');
    if (facts.length < 2) return Utils.showNotification('Se requieren al menos 2 hechos', 'error');

    const error = Game3.createStory({
      title,
      facts,
      timeLimit: timeMin * 60 * 1000,
      penaltyPerError: penalty * 1000
    });

    if (error) {
      Utils.showNotification(error, 'error');
    } else {
      Utils.showNotification('Historia guardada', 'success');
      this.goToGame(3);
    }
  },

  startGame3(storyId) {
    // Recargar historias del storage para asegurar que tenemos las más actualizadas
    Game3.stories = Storage.getGame3Stories();
    
    const story = Game3.loadStory(storyId);
    if (!story) {
      Swal.fire({
        title: 'Error',
        text: 'No se pudo cargar la historia',
        icon: 'error',
        confirmButtonColor: '#cc0000'
      });
      return;
    }
    window.gamePlayContentId = storyId;
    this.currentView = 'game3-play';
    this.render();
  },

  renderGame3Play(content) {
    const story = Game3.currentStory;
    const timers = Game3.timers;
    const config = this.config;

    if (!story || !timers) {
      content.innerHTML = '<p>Error: historia no cargada</p>';
      return;
    }

    const leftTime = Utils.formatTime(timers.left.elapsed + timers.left.penalty);
    const rightTime = Utils.formatTime(timers.right.elapsed + timers.right.penalty);

    content.innerHTML = `
      <h1 style="text-align: center; margin-bottom: 2rem;">${story.title}</h1>

      <div class="game3-container">
        <div class="game3-team-column left">
          <div class="game3-team-header">${config.teams.left.name}</div>
          <div class="game3-timer" id="timer_left">${leftTime}</div>
          <ul class="facts-list" id="left-facts">
            ${story.leftOrder.map((fact, idx) => `
              <li class="fact-item" draggable="true" data-index="${idx}" data-team="left">
                <span class="fact-number">${idx + 1}</span>
                <span>${fact.text}</span>
              </li>
            `).join('')}
          </ul>
          <div class="fact-controls animator-only">
            <button class="btn btn-secondary" onclick="App.moveFactGame3('left', -1)">↑ Subir</button>
            <button class="btn btn-secondary" onclick="App.moveFactGame3('left', 1)">↓ Bajar</button>
          </div>
          <button class="game3-ready-btn" onclick="App.readyGame3('left')">¡${config.teams.left.name} Listo!</button>
        </div>

        <div class="game3-team-column right">
          <div class="game3-team-header">${config.teams.right.name}</div>
          <div class="game3-timer" id="timer_right">${rightTime}</div>
          <ul class="facts-list" id="right-facts">
            ${story.rightOrder.map((fact, idx) => `
              <li class="fact-item" draggable="true" data-index="${idx}" data-team="right">
                <span class="fact-number">${idx + 1}</span>
                <span>${fact.text}</span>
              </li>
            `).join('')}
          </ul>
          <div class="fact-controls animator-only">
            <button class="btn btn-secondary" onclick="App.moveFactGame3('right', -1)">↑ Subir</button>
            <button class="btn btn-secondary" onclick="App.moveFactGame3('right', 1)">↓ Bajar</button>
          </div>
          <button class="game3-ready-btn" onclick="App.readyGame3('right')">¡${config.teams.right.name} Listo!</button>
        </div>
      </div>

      <div style="text-align: center; margin-top: 2rem; animator-only" class="animator-only">
        <button class="btn btn-primary" onclick="App.startTimerGame3()" id="startBtn">Iniciar Cronómetro</button>
      </div>
    `;

    // Actualizar timers cada 10ms
    window.game3TimerInterval = setInterval(() => {
      const leftTime = Utils.formatTime(timers.left.elapsed + timers.left.penalty);
      const rightTime = Utils.formatTime(timers.right.elapsed + timers.right.penalty);
      
      const leftEl = document.getElementById('timer_left');
      const rightEl = document.getElementById('timer_right');
      
      if (leftEl) leftEl.textContent = leftTime;
      if (rightEl) rightEl.textContent = rightTime;

      if (timers.left.elapsed >= story.timeLimit && story.timeLimit > 0) {
        timers.left.elapsed = story.timeLimit;
      }
      if (timers.right.elapsed >= story.timeLimit && story.timeLimit > 0) {
        timers.right.elapsed = story.timeLimit;
      }
    }, 10);

    // Setup drag and drop (simplificado)
    setTimeout(() => {
      document.querySelectorAll('.fact-item').forEach(item => {
        item.addEventListener('dragstart', (e) => {
          e.dataTransfer.effectAllowed = 'move';
          e.dataTransfer.setData('text/html', e.target.innerHTML);
          window.draggedElement = e.target;
        });

        item.addEventListener('dragover', (e) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = 'move';
          e.target.style.opacity = '0.5';
        });

        item.addEventListener('dragleave', (e) => {
          e.target.style.opacity = '1';
        });

        item.addEventListener('drop', (e) => {
          e.preventDefault();
          e.target.style.opacity = '1';
          
          if (window.draggedElement && window.draggedElement !== e.target) {
            const parent = e.target.parentNode;
            const allItems = Array.from(parent.children);
            const draggedIndex = allItems.indexOf(window.draggedElement);
            const targetIndex = allItems.indexOf(e.target);
            
            if (draggedIndex < targetIndex) {
              e.target.parentNode.insertBefore(window.draggedElement, e.target.nextSibling);
            } else {
              e.target.parentNode.insertBefore(window.draggedElement, e.target);
            }

            App.updateGame3Order();
          }
        });
      });
    }, 100);
  },

  startTimerGame3() {
    const startBtn = document.getElementById('startBtn');
    if (startBtn) startBtn.disabled = true;
    
    // Countdown 3-2-1
    let count = 3;
    const countdown = setInterval(() => {
      count--;
      if (count < 0) {
        clearInterval(countdown);
        Game3.startTimer();
      }
    }, 1000);
  },

  moveFactGame3(team, direction) {
    const list = document.getElementById(`${team}-facts`);
    const items = Array.from(list.children);
    
    // Encontrar el seleccionado o usar el primero
    let selectedIndex = items.findIndex(i => i.style.background === 'rgba(255,255,0,0.3)');
    if (selectedIndex === -1) selectedIndex = 0;

    if (direction === -1 && selectedIndex > 0) {
      [items[selectedIndex - 1], items[selectedIndex]] = [items[selectedIndex], items[selectedIndex - 1]];
    } else if (direction === 1 && selectedIndex < items.length - 1) {
      [items[selectedIndex], items[selectedIndex + 1]] = [items[selectedIndex + 1], items[selectedIndex]];
    }

    list.innerHTML = '';
    items.forEach(item => list.appendChild(item));
    App.updateGame3Order();
  },

  updateGame3Order() {
    const story = Game3.currentStory;
    
    const leftItems = Array.from(document.getElementById('left-facts').children);
    const rightItems = Array.from(document.getElementById('right-facts').children);

    story.leftOrder = leftItems.map((item, idx) => ({
      text: item.textContent.replace(/^\d+\.\s/, ''),
      correct: false
    }));

    story.rightOrder = rightItems.map((item, idx) => ({
      text: item.textContent.replace(/^\d+\.\s/, ''),
      correct: false
    }));
  },

  readyGame3(team) {
    const isCorrect = Game3.validateOrder(team);
    Game3.timers[team].ready = true;

    const result = Game3.getResult();
    
    if (result.winner || (Game3.timers.left.ready && Game3.timers.right.ready)) {
      Game3.stopTimer();
      clearInterval(window.game3TimerInterval);
      Game3.recordResult(result);

      let message = '';
      if (result.winner === 'tie') {
        message = `¡EMPATE!\n${this.config.teams.left.name}: ${Utils.formatTime(result.leftTime)}\n${this.config.teams.right.name}: ${Utils.formatTime(result.rightTime)}`;
      } else if (result.winner) {
        const winnerName = result.winner === 'left' ? this.config.teams.left.name : this.config.teams.right.name;
        message = `¡${winnerName} gana!\nTiempo: ${Utils.formatTime(result[result.winner === 'left' ? 'leftTime' : 'rightTime'])}`;
      }

      setTimeout(() => {
        const correctOrder = result.correctOrder.map((f, i) => `${i + 1}. ${f}`).join('\n');
        Swal.fire({
          title: 'Resultado',
          html: `<p>${message}</p><hr/><p><strong>Orden correcto:</strong></p><p style="text-align: left; font-family: monospace;">${correctOrder}</p>`,
          icon: result.winner === 'tie' ? 'info' : 'success',
          confirmButtonColor: '#00aa00'
        }).then(() => {
          Swal.fire({
            title: '¿Otra historia?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí',
            cancelButtonText: 'No',
            confirmButtonColor: '#00aa00',
            cancelButtonColor: '#cc0000'
          }).then((result2) => {
            if (result2.isConfirmed) {
              this.goToGame(3);
            } else {
              this.goToMenu();
            }
          });
        });
      }, 1000);
    } else {
      this.render();
    }
  },

  setupEventListeners() {
    // Eventos ya configurados inline en HTML
  }
};

// Iniciar aplicación
window.addEventListener('DOMContentLoaded', () => {
  App.init();
});
