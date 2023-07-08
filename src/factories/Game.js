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
    if (this.playerScore === 18) {
      return this.player.name;
    } else if (this.computerScore === 18) {
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
