/**
 * GAME 3: ORDENA LA HISTORIA CON CRONÓMETRO
 */

const Game3 = {
  stories: [],
  session: null,
  currentStory: null,
  timers: null,
  timerInterval: null,

  // Inicializar
  init() {
    this.stories = Storage.getGame3Stories();
    
    // Cargar ejemplo si está vacío
    if (this.stories.length === 0) {
      this.stories = [{
        id: Utils.generateId(),
        title: 'La historia de José (Ejemplo)',
        facts: [
          'Sus hermanos lo venden a unos mercaderes',
          'Es llevado a Egipto como esclavo',
          'Interpreta los sueños del faraón',
          'Es nombrado gobernador de Egipto',
          'Se reencuentra con sus hermanos'
        ],
        timeLimit: 120000, // 2 minutos
        penaltyPerError: 5000, // 5 segundos
        example: true
      }];
      Storage.setGame3Stories(this.stories);
    }

    this.session = {
      roundsWon: { left: 0, right: 0 },
      completedRounds: []
    };
    Storage.setGame3Session(this.session);
  },

  // Crear historia
  createStory(data) {
    if (!data.title || !data.facts || data.facts.length < 2) {
      return 'Se requieren título y al menos 2 hechos';
    }

    const story = {
      id: Utils.generateId(),
      title: data.title,
      facts: data.facts,
      timeLimit: data.timeLimit || 120000,
      penaltyPerError: data.penaltyPerError || 5000,
      example: false
    };

    this.stories.push(story);
    Storage.setGame3Stories(this.stories);
    return null;
  },

  // Obtener historias
  getStories() {
    return this.stories;
  },

  // Cargar historia
  loadStory(storyId) {
    const story = this.stories.find(s => s.id === storyId);
    if (!story) return null;

    const shuffled = Utils.shuffleArray(story.facts);

    this.currentStory = {
      id: story.id,
      title: story.title,
      correctOrder: story.facts,
      timeLimit: story.timeLimit,
      penaltyPerError: story.penaltyPerError,
      leftOrder: shuffled.map(f => ({ text: f, correct: false })),
      rightOrder: shuffled.map(f => ({ text: f, correct: false }))
    };

    this.timers = {
      left: { elapsed: 0, started: false, ready: false, penalty: 0, correct: false },
      right: { elapsed: 0, started: false, ready: false, penalty: 0, correct: false }
    };

    return this.currentStory;
  },

  // Iniciar cronómetro
  startTimer() {
    if (this.timerInterval) clearInterval(this.timerInterval);

    this.timers.left.started = true;
    this.timers.right.started = true;

    this.timerInterval = setInterval(() => {
      if (!this.timers.left.correct) {
        this.timers.left.elapsed += 10;
        if (this.timers.left.elapsed >= this.currentStory.timeLimit) {
          this.timers.left.elapsed = this.currentStory.timeLimit;
        }
      }

      if (!this.timers.right.correct) {
        this.timers.right.elapsed += 10;
        if (this.timers.right.elapsed >= this.currentStory.timeLimit) {
          this.timers.right.elapsed = this.currentStory.timeLimit;
        }
      }

      // Si ambos están listos, detener
      if (this.timers.left.ready && this.timers.right.ready) {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
      }
    }, 10);
  },

  // Detener cronómetro
  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  },

  // Reordenar hechos
  reorderFact(teamSide, index, direction) {
    const order = teamSide === 'left' ? this.currentStory.leftOrder : this.currentStory.rightOrder;
    
    if (direction === 'up' && index > 0) {
      [order[index - 1], order[index]] = [order[index], order[index - 1]];
    } else if (direction === 'down' && index < order.length - 1) {
      [order[index], order[index + 1]] = [order[index + 1], order[index]];
    }
  },

  // Validar orden
  validateOrder(teamSide) {
    const order = teamSide === 'left' ? this.currentStory.leftOrder : this.currentStory.rightOrder;
    const ordered = order.map(item => item.text);
    const isCorrect = JSON.stringify(ordered) === JSON.stringify(this.currentStory.correctOrder);

    if (isCorrect) {
      this.timers[teamSide].correct = true;
      AudioSystem.playSuccess();
    } else {
      this.timers[teamSide].penalty += this.currentStory.penaltyPerError;
      AudioSystem.playError();
    }

    return isCorrect;
  },

  // Obtener resultado final
  getResult() {
    const leftTime = this.timers.left.elapsed + this.timers.left.penalty;
    const rightTime = this.timers.right.elapsed + this.timers.right.penalty;
    const leftCorrect = this.timers.left.correct;
    const rightCorrect = this.timers.right.correct;

    let winner = null;

    if (leftCorrect && !rightCorrect) {
      winner = 'left';
    } else if (rightCorrect && !leftCorrect) {
      winner = 'right';
    } else if (leftCorrect && rightCorrect) {
      if (leftTime < rightTime) winner = 'left';
      else if (rightTime < leftTime) winner = 'right';
      else winner = 'tie';
    }

    return {
      winner,
      leftCorrect,
      rightCorrect,
      leftTime,
      rightTime,
      correctOrder: this.currentStory.correctOrder
    };
  },

  // Registrar resultado
  recordResult(result) {
    if (result.winner === 'left') {
      this.session.roundsWon.left++;
    } else if (result.winner === 'right') {
      this.session.roundsWon.right++;
    }

    this.session.completedRounds.push(result);
    Storage.setGame3Session(this.session);

    if (result.winner === 'left' || result.winner === 'right') {
      AudioSystem.playVictory();
      Utils.celebrateVictory(result.winner === 'left' ? '#0066cc' : '#cc0000');
    }
  },

  // Reiniciar
  restart() {
    this.stopTimer();
    this.session = {
      roundsWon: this.session.roundsWon,
      completedRounds: this.session.completedRounds
    };
    Storage.setGame3Session(this.session);
    this.currentStory = null;
    this.timers = null;
  },

  // Eliminar historia
  deleteStory(storyId) {
    this.stories = this.stories.filter(s => s.id !== storyId && !s.example);
    Storage.setGame3Stories(this.stories);
  }
};

Game3.init();
