/**
 * GAME 1: IMAGEN QUE SE ACLARA
 */

const Game1 = {
  rounds: [],
  currentRound: null,
  session: null,

  // Inicializar
  init() {
    this.rounds = Storage.getGame1Rounds();
    this.session = {
      leftTeamPoints: 0,
      rightTeamPoints: 0,
      roundsWon: { left: 0, right: 0 },
      completedRounds: [],
      currentImageClarity: 0
    };
    Storage.setGame1Session(this.session);
  },

  // Crear nueva ronda
  createRound(data) {
    if (!data.image || !data.title || !data.elements || data.elements.length < 2) {
      return 'Faltan datos: imagen, título y al menos 2 elementos';
    }

    const round = {
      id: Utils.generateId(),
      title: data.title,
      image: data.image,
      description: data.description || '',
      elements: data.elements.map(e => ({
        id: Utils.generateId(),
        name: e.name,
        points: e.points || 10,
        guessedBy: null
      }))
    };

    this.rounds.push(round);
    Storage.setGame1Rounds(this.rounds);
    return null;
  },

  // Obtener lista de rondas
  getRounds() {
    return this.rounds;
  },

  // Cargar ronda para jugar
  loadRound(roundId) {
    const round = this.rounds.find(r => r.id === roundId);
    if (!round) return null;

    this.currentRound = {
      id: round.id,
      title: round.title,
      image: round.image,
      description: round.description,
      elements: round.elements.map(e => ({ ...e })),
      clarityLevel: 0,
      leftTeamAttempted: false,
      rightTeamAttempted: false,
      winner: null,
      guessedElements: []
    };

    return this.currentRound;
  },

  // Obtener nivel de desenfoque CSS
  getBlurClass() {
    const totalElements = this.currentRound.elements.length;
    const guessed = this.currentRound.guessedElements.length;
    const percentage = (guessed / totalElements) * 100;

    if (percentage === 0) return 'blur-5';
    if (percentage < 20) return 'blur-4';
    if (percentage < 40) return 'blur-3';
    if (percentage < 60) return 'blur-2';
    if (percentage < 80) return 'blur-1';
    return 'blur-0';
  },

  // Marcar elemento adivinado
  markElement(elementId, teamSide) {
    const element = this.currentRound.elements.find(e => e.id === elementId);
    if (!element) return 'Elemento no encontrado';

    if (element.guessedBy) return 'Este elemento ya fue adivinado';

    // Marcar elemento
    element.guessedBy = teamSide;
    this.currentRound.guessedElements.push(elementId);

    // Sumar puntos
    if (teamSide === 'left') {
      this.session.leftTeamPoints += element.points;
    } else {
      this.session.rightTeamPoints += element.points;
    }

    Storage.setGame1Session(this.session);
    AudioSystem.playSuccess();

    return null;
  },

  // Intentar adivinar imagen completa
  attemptGuessImage(teamSide) {
    if (teamSide === 'left' && this.currentRound.leftTeamAttempted) {
      return 'El Bando Izquierdo ya intentó adivinar esta ronda';
    }
    if (teamSide === 'right' && this.currentRound.rightTeamAttempted) {
      return 'El Bando Derecho ya intentó adivinar esta ronda';
    }

    if (teamSide === 'left') {
      this.currentRound.leftTeamAttempted = true;
    } else {
      this.currentRound.rightTeamAttempted = true;
    }

    return null;
  },

  // Confirmar victoria por adivinanza
  winByGuess(teamSide) {
    this.currentRound.winner = teamSide;
    this.session.roundsWon[teamSide]++;
    this.session.completedRounds.push({
      title: this.currentRound.title,
      winner: teamSide,
      leftPoints: this.session.leftTeamPoints,
      rightPoints: this.session.rightTeamPoints
    });

    Storage.setGame1Session(this.session);
    AudioSystem.playVictory();
    Utils.celebrateVictory(teamSide === 'left' ? '#0066cc' : '#cc0000');

    return null;
  },

  // Fallar en intento de adivinanza
  failGuess(teamSide) {
    if (teamSide === 'left') {
      this.currentRound.leftTeamAttempted = true;
    } else {
      this.currentRound.rightTeamAttempted = true;
    }

    AudioSystem.playError();
    return null;
  },

  // Cerrar ronda
  closeRound() {
    if (!this.currentRound.winner) {
      const leftPts = this.session.leftTeamPoints;
      const rightPts = this.session.rightTeamPoints;

      if (leftPts === rightPts) {
        this.currentRound.winner = 'tie';
      } else if (leftPts > rightPts) {
        this.currentRound.winner = 'left';
        this.session.roundsWon.left++;
      } else {
        this.currentRound.winner = 'right';
        this.session.roundsWon.right++;
      }

      this.session.completedRounds.push({
        title: this.currentRound.title,
        winner: this.currentRound.winner,
        leftPoints: this.session.leftTeamPoints,
        rightPoints: this.session.rightTeamPoints
      });

      Storage.setGame1Session(this.session);
    }

    return null;
  },

  // Reiniciar ronda
  restartRound() {
    this.session = {
      leftTeamPoints: 0,
      rightTeamPoints: 0,
      roundsWon: this.session.roundsWon,
      completedRounds: this.session.completedRounds,
      currentImageClarity: 0
    };
    Storage.setGame1Session(this.session);
    this.currentRound = null;
  },

  // Ajustar puntos
  adjustPoints(teamSide, amount) {
    if (teamSide === 'left') {
      this.session.leftTeamPoints = Math.max(0, this.session.leftTeamPoints + amount);
    } else {
      this.session.rightTeamPoints = Math.max(0, this.session.rightTeamPoints + amount);
    }
    Storage.setGame1Session(this.session);
  },

  // Eliminar ronda
  deleteRound(roundId) {
    this.rounds = this.rounds.filter(r => r.id !== roundId);
    Storage.setGame1Rounds(this.rounds);
  }
};

Game1.init();
