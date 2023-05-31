class Game {
  constructor(player, computer) {
    this.player = player;
    this.computer = computer;
    this.playerScore = 0;
    this.computerScore = 0;
    this.currentTurn = player;
    this.otherPlayer = computer;
  }

  checkWin() {
    if (this.playerScore === 17) {
      return "Player";
    } else if (this.computerScore === 17) {
      return "Computer";
    }
    return false;
  }

  switchTurns() {
    if (this.currentTurn === this.player) {
      this.currentTurn = this.computer;
      this.otherPlayer = this.player;
    } else {
      this.currentTurn = this.player;
      this.otherPlayer = this.computer;
    }
  }
}

export default Game;
