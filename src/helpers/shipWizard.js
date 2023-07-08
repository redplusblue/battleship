import Ship from "../factories/Ship";
// Creates ships for random placement
export const shipCreator = () => {
  const playerCarrier = new Ship("Carrier", [0, 1, 2, 3, 4, 5]);
  const playerBattleship = new Ship("Battleship", [0, 1, 2, 3]);
  const playerCruiser = new Ship("Cruiser", [0, 1, 2]);
  const playerSubmarine = new Ship("Submarine", [0, 1, 2]);
  const playerDestroyer = new Ship("Destroyer", [0, 1]);

  const computerCarrier = new Ship("Carrier", [0, 1, 2, 3, 4, 5]);
  const computerBattleship = new Ship("Battleship", [0, 1, 2, 3]);
  const computerCruiser = new Ship("Cruiser", [0, 1, 2]);
  const computerSubmarine = new Ship("Submarine", [0, 1, 2]);
  const computerDestroyer = new Ship("Destroyer", [0, 1]);

  const playerShips = {
    playerCarrier,
    playerBattleship,
    playerCruiser,
    playerSubmarine,
    playerDestroyer,
  };
  const computerShips = {
    computerCarrier,
    computerBattleship,
    computerCruiser,
    computerSubmarine,
    computerDestroyer,
  };
  return {
    playerShips,
    computerShips,
  };
};
const randomShipCoordinates = (gameboard, ship, orientation) => {
  // Horizontal
  const shipLength = ship.length;
  let nullValues = [];
  const randomVal = Math.floor(Math.random() * 10);
  if (orientation === 0) {
    // Divide the gameboard into 10 rows, randomly pick a row and iterate through it to find continuous null values equal to the length of the ship
    // If the row is not long enough, pick another row
    // If the row is long enough, place the ship
    const row = gameboard.board[randomVal];
    for (let i = 0; i < row.length; i++) {
      if (row[i] === null) {
        nullValues.push(i);
      } else {
        nullValues = [];
      }
    }
  }
  // Vertical
  else {
    const column = gameboard.board.map((row) => row[randomVal]);
    for (let i = 0; i < column.length; i++) {
      if (column[i] === null) {
        nullValues.push(i);
      } else {
        nullValues = [];
      }
    }
  }
  if (nullValues.length >= shipLength) {
    const randomIndex = Math.floor(
      Math.random() * (nullValues.length - shipLength)
    );
    let position = nullValues.slice(randomIndex, randomIndex + shipLength);
    // Convert position into cartesian coordinates
    position = position.map((pos) => {
      if (orientation === 0) {
        return [randomVal, pos];
      }
      return [pos, randomVal];
    });
    return position;
  } else {
    randomShipCoordinates(gameboard, ship, orientation);
  }
};

// Randomly places ships on the board
export const randomShipPlacer = (gameboard, ships) => {
  // Iterate through the ships object and place each ship one by one
  for (let ship in ships) {
    // Randomly pick 0 or 1
    let random = Math.floor(Math.random() * 2);
    let position = randomShipCoordinates(gameboard, ships[ship], random);
    // In case of collision, pick another random position
    while (position === undefined) {
      random = Math.floor(Math.random() * 2);
      position = randomShipCoordinates(gameboard, ships[ship], random);
    }
    gameboard.placeShip(ships[ship], position);
  }
};
