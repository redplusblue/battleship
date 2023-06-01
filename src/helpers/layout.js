import AI from "../factories/AI";
import Player from "../factories/Player";

const createLayout = () => {
  const gameBoardContainer = document.createElement("div");
  gameBoardContainer.className = "game-board-container";
  document.body.appendChild(gameBoardContainer);

  const playerSide = document.createElement("div");
  playerSide.className = "player-side";
  const playerGameBoard = document.createElement("div");
  playerGameBoard.className = "game-board";
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
  playerSide.appendChild(playerGameBoard);

  const computerSide = document.createElement("div");
  computerSide.className = "computer-side";
  const computerGameBoard = document.createElement("div");
  computerGameBoard.className = "game-board";
  computerGameBoard.classList.add("computer-board");
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
  computerSide.appendChild(computerGameBoard);

  // Show player names
  const playerName = document.createElement("div");
  playerName.className = "player-name";
  playerName.textContent = "Player";
  playerSide.appendChild(playerName);

  // Show computer names
  const computerName = document.createElement("div");
  computerName.className = "computer-name";
  computerName.textContent = "Computer";
  computerSide.appendChild(computerName);

  gameBoardContainer.appendChild(playerSide);
  gameBoardContainer.appendChild(computerSide);
};

// Function to place the ships from the gameboard into the board on the DOM
const gameboardToBoard = (player) => {
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
};

const setTurn = (s) => {
  if (s == "player") {
    document.querySelector(".computer-side").classList.remove(".not-allowed");
  } else {
    document.querySelector(".computer-side").classList.add(".not-allowed");
  }
};

export {
  createLayout,
  addEventListeners,
  gameboardToBoard,
  updateBoard,
  setTurn,
};
