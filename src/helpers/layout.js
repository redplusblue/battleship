const createLayout = () => {
  const gameBoardContainer = document.createElement("div");
  gameBoardContainer.className = "game-board-container";
  document.body.appendChild(gameBoardContainer);

  const playerSide = document.createElement("div");
  playerSide.className = "player-side";
  const playerGameBoard = document.createElement("div");
  playerGameBoard.className = "game-board";
  for (let i = 0; i < 10; i++) {
    // Create row divs
    const row = document.createElement("div");
    row.className = "row";

    for (let j = 0; j < 10; j++) {
      // Create column divs
      const col = document.createElement("div");
      col.className = "col";
      col.id = `${i}${j}`;
      row.appendChild(col);
    }

    playerGameBoard.appendChild(row);
  }
  playerSide.appendChild(playerGameBoard);

  const computerSide = document.createElement("div");
  computerSide.className = "computer-side";
  const computerGameBoard = document.createElement("div");
  computerGameBoard.className = "game-board";
  for (let i = 0; i < 10; i++) {
    // Create row divs
    const row = document.createElement("div");
    row.className = "row";

    for (let j = 0; j < 10; j++) {
      // Create column divs
      const col = document.createElement("div");
      col.className = "col";
      col.id = `${i}${j}`;
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

export { createLayout };
