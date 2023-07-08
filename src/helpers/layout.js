import AI from "../factories/AI";
import Player from "../factories/Player";
import { loop } from "./gameloop";

// Creates the layout for the boards
const createLayout = () => {
  // Player Side
  const playerGameBoard = document.querySelector(".player-side").children[0];
  for (let i = 9; i >= 0; i--) {
    // Create row divs
    const row = document.createElement("div");
    row.className = "row";

    for (let j = 0; j < 10; j++) {
      // Create column divs
      const col = document.createElement("div");
      col.className = "col";
      col.id = `P${i}${j}`;
      row.appendChild(col);
    }

    playerGameBoard.appendChild(row);
  }
  // Computer Side
  const computerGameBoard =
    document.querySelector(".computer-side").children[0];
  for (let i = 9; i >= 0; i--) {
    // Create row divs
    const row = document.createElement("div");
    row.className = "row";

    for (let j = 0; j < 10; j++) {
      // Create column divs
      const col = document.createElement("div");
      col.className = "col";
      col.id = `C${i}${j}`;
      row.appendChild(col);
    }

    computerGameBoard.appendChild(row);
  }
};

// Function to place the ships from the gameboard into the board on the DOM
const gameboardToBoard = (player) => {
  // Show Player name
  document.querySelector(".player-name").innerText = player.name;
  let playerBoard = player.gameboard.board;

  // Loop through the player's board and for non-empty cells, add a class of occupied
  for (let i = 0; i < playerBoard.length; i++) {
    for (let j = 0; j < playerBoard[i].length; j++) {
      if (playerBoard[i][j] !== null) {
        let cell = document.getElementById(`P${i}${j}`);
        cell.classList.add("occupied");
      }
    }
  }
};

const addEventListeners = (player, ai, game) => {
  const computerBoard = document.querySelector(".computer-board");
  // Add event listener to every cell of the computerBoard to listen for clicks
  // Get all the children of .computer-board with the class of .col
  const computerBoardCells = computerBoard.querySelectorAll(".col");
  computerBoardCells.forEach((cell) => {
    cell.addEventListener("click", () => {
      // Cell ID -> C00
      let cellId = cell.id;
      let cellRow = cellId.split("")[1];
      let cellCol = cellId.split("")[2];
      // Check if the cell has already been clicked
      let status = ai.gameboard.getHitOrMiss([cellRow, cellCol]);
      if (status == "hit" || status == "miss") {
        return;
      }
      // If not, attack the cell
      else {
        player.attack(ai, [cellRow, cellCol]);
        updateBoard(player, ai);
      }
      // Swap turns
      game.switchTurns();
      setTurn("computer");
      loop(player, ai, game);
    });
  });
};

/**
 * The updateBoard function updates the board on the
 * DOM with the player's and the AI's hits and misses
 *
 * @param {Player} player The player object
 * @param {AI} ai The AI object
 */
const updateBoard = (player, ai) => {
  const playerHits = player.gameboard.hits;
  const playerMisses = player.gameboard.missedShots;
  const aiHits = ai.gameboard.hits;
  const aiMisses = ai.gameboard.missedShots;

  for (let i = 0; i < playerHits.length; i++) {
    let cell = document.getElementById(
      `P${playerHits[i][0]}${playerHits[i][1]}`
    );
    cell.classList.add("hit");
    cell.removeEventListener("click", () => {});
  }
  for (let i = 0; i < playerMisses.length; i++) {
    let cell = document.getElementById(
      `P${playerMisses[i][0]}${playerMisses[i][1]}`
    );
    cell.classList.add("miss");
    cell.removeEventListener("click", () => {});
  }
  for (let i = 0; i < aiHits.length; i++) {
    let cell = document.getElementById(`C${aiHits[i][0]}${aiHits[i][1]}`);
    cell.classList.add("hit");
    cell.removeEventListener("click", () => {});
  }
  for (let i = 0; i < aiMisses.length; i++) {
    let cell = document.getElementById(`C${aiMisses[i][0]}${aiMisses[i][1]}`);
    cell.classList.add("miss");
    cell.removeEventListener("click", () => {});
  }
  updateScore(player, ai);
};

const updateScore = (player, ai) => {
  const playerScore = document.querySelector(".player-score");
  const computerScore = document.querySelector(".computer-score");
  playerScore.textContent = "Score: " + ai.gameboard.hits.length;
  computerScore.textContent = "Score: " + player.gameboard.hits.length;
  // Get playerboard and computerboard
  const playerBoard = document.querySelector(".player-side").children[0];
  const computerBoard = document.querySelector(".computer-side").children[0];

  // Update player status: hit or miss
  const playerStatus = document.querySelector(".player-status");
  const computerStatus = document.querySelector(".computer-status");
  let playerLastMove = null || player.moves[player.moves.length - 1];
  let computerLastMove = null || ai.moves[ai.moves.length - 1];
  if (playerLastMove == null) {
    playerStatus.textContent = "";
  } else {
    let playerLastMoveStatus = ai.gameboard.getHitOrMiss(playerLastMove);
    if (playerLastMoveStatus == "hit") {
      playerStatus.textContent = "Hit!";
      playerStatus.style.color = "#ff0000";
      computerBoard.style.animation = "hit 3.5s ease-in-out";
      computerBoard.addEventListener("animationend", () => {
        computerBoard.style.animation = "";
      });
    } else {
      playerStatus.textContent = "Miss!";
      playerStatus.style.color = "white";
    }
  }
  if (computerLastMove == null) {
    computerStatus.textContent = "";
  } else {
    let computerLastMoveStatus =
      player.gameboard.getHitOrMiss(computerLastMove);
    if (computerLastMoveStatus == "hit") {
      computerStatus.textContent = "Hit!";
      computerStatus.style.color = "#ff0000";
      playerBoard.style.animation = "hit 3.5s ease-in-out";
      playerBoard.addEventListener("animationend", () => {
        playerBoard.style.animation = "";
      });
    } else {
      computerStatus.textContent = "Miss!";
      computerStatus.style.color = "white";
    }
  }
};

const setTurn = (s) => {
  if (s == "player") {
    document.querySelector(".computer-side").classList.remove(".not-allowed");
  } else {
    document.querySelector(".computer-side").classList.add(".not-allowed");
  }
};

const setWinner = (winner) => {
  // Dont Allow clicks on the computer board
  document.querySelector(".computer-side").style.pointerEvents = "none";
  // Display the winner
  const winnerDisplay = document.querySelector(".winner-display");
  winnerDisplay.textContent = winner + " wins!";
  winnerDisplay.style.animation = "enlarge 3s infinite";
  document.body.appendChild(winnerDisplay);
  // Animate winner's board
  if (winner == "Player") {
    document.querySelector(".player-side").children[0].style.animation =
      "rainbow 3s ease-in-out infinite";
    document.querySelector(".computer-side").children[0].style.opacity = 0.5;
    document.querySelector(".player-name").style.animation =
      "textRainbow 3s ease-in-out infinite";
  } else {
    document.querySelector(".computer-side").children[0].style.animation =
      "rainbow 3s ease-in-out infinite";
    document.querySelector(".player-side").children[0].style.opacity = 0.5;
    document.querySelector(".computer-name").style.animation =
      "textRainbow 3s ease-in-out infinite";
  }
  // Enable reset button
  const resetButton = document.querySelector("#game-reset-btn");
  resetButton.style.display = "block";
  resetButton.addEventListener("click", () => {
    location.reload();
  });
};

export {
  createLayout,
  addEventListeners,
  gameboardToBoard,
  updateBoard,
  setTurn,
  setWinner,
};
