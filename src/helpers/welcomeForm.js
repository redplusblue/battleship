import LeftClick from "../assets/click.png";

const createForm = () => {
  nameFormContent();
  // Ship Placer
  shipPlacerContent();
  // Difficulty
};

const nameFormContent = () => {
  const nameForm = document.getElementById("name-form").children;
  const name = nameForm[1];
  const submitButton = nameForm[2];
  name.addEventListener("keyup", (e) => {
    // Enter key
    if (e.keyCode === 13) {
      if (name.value.length > 0) {
        nameForm[0].textContent = `Welcome, ${name.value}!`;
        nameForm[1].style.display = "none";
        nameForm[2].style.display = "none";
      }
    }
  });

  submitButton.addEventListener("click", () => {
    if (name.value.length > 0) {
      nameForm[0].textContent = `Welcome, ${name.value}!`;
      nameForm[1].style.display = "none";
      nameForm[2].style.display = "none";
    }
  });
};

const shipPlacerContent = () => {
  // Left click image
  document.getElementById("left-click").src = LeftClick;
  // Fill ship grid
  const shipGrid = document.querySelector(".ship-grid");
  for (let i = 9; i >= 0; i--) {
    // Create row divs
    const row = document.createElement("div");
    row.className = "row";
    for (let j = 0; j < 10; j++) {
      // Create column divs
      const col = document.createElement("div");
      col.className = "col";
      col.id = `T${i}${j}`;
      row.appendChild(col);
    }
    shipGrid.appendChild(row);
  }
  const instructions = document.querySelector(".instructions");

  shipEventListeners();
};

const shipEventListeners = () => {
  const destroyer = document.getElementById("ship-destroyer");
  const submarine = document.getElementById("ship-submarine");
  const cruiser = document.getElementById("ship-cruiser");
  const battleship = document.getElementById("ship-battleship");
  const carrier = document.getElementById("ship-carrier");
  const ships = [destroyer, submarine, cruiser, battleship, carrier];
  ships.forEach((ship) => {
    ship.addEventListener("click", () => {
      shipPlacer(ship.id.split("-")[1]);
    });
  });
};

const shipPlacer = (ship) => {
  const shipSizes = {
    destroyer: 2,
    submarine: 3,
    cruiser: 3,
    battleship: 4,
    carrier: 6,
  };
  const shipSize = parseInt(shipSizes[ship]);

  // Select all ship cells that are valid for the ship size
  let currentMode = document.querySelector(".current-mode").textContent;
  let validCells;
  switch (currentMode) {
    case "H":
      validCells = validShipCells(shipSize).horizontalValid;
      break;
    case "V":
      validCells = validShipCells(shipSize).verticalValid;
      break;
    default:
      validCells = validShipCells(shipSize).horizontalValid;
      break;
  }
  // Hover effect
  validCells.forEach((cell) => {
    cell.addEventListener("mouseover", () => {
      // Colour cells upto ship size
      let currentCell = cell;
      for (let i = 0; i < shipSize; i++) {
        currentCell.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
        currentCell = currentCell.nextElementSibling;
      }
    });
    cell.addEventListener("mouseout", () => {
      let currentCell = cell;
      for (let i = 0; i < shipSize; i++) {
        currentCell.style.backgroundColor = "transparent";
        currentCell = currentCell.nextElementSibling;
      }
    });
  });

  // Add event listeners to valid cells
  validCells.forEach((cell) => {
    cell.addEventListener("click", () => {
      // Place ship
      // set color to red for now
      cell.style.backgroundColor = "red";
      // Remove event listeners from valid cells
      validCells.forEach((cell) => {
        cell.removeEventListener("click", () => {});
      });
    });
  });
};

/**
 * The validShipCells function returns an object with two arrays, horizontalValid and verticalValid.
 * Each array contains the cells that are valid for the ship size placement.
 *
 * @param {Integer} shipSize The size of the ship
 * @returns {Object} {horizontalValid: [Array], verticalValid: [Array]
 */
const validShipCells = (shipSize) => {
  const shipGrid = document.querySelector(".ship-grid");
  const shipCells = shipGrid.querySelectorAll(".col");
  let horizontal = [];
  let redCells = [];
  const vertical = [];
  shipCells.forEach((cell) => {
    if (cell.id[2] <= 10 - shipSize && cell.style.backgroundColor !== "red") {
      horizontal.push(cell);
    }
    if (cell.style.backgroundColor === "red") {
      redCells.push(cell);
    }
    if (cell.id[1] <= 10 - shipSize && cell.style.backgroundColor !== "red") {
      vertical.push(cell);
    }
  });

  const horizontalValid = horizontalValidity(horizontal, shipSize, redCells);
  const verticalValid = verticalValidity(vertical, shipSize, redCells);

  return { horizontalValid, verticalValid };
};

const horizontalValidity = (horizontal, shipSize, redCells) => {
  // horizontal validity
  let horizontalValid = [];
  let validShip = [horizontal[0]];
  let currentRow = horizontal[0].id[1];
  let currentCol = horizontal[0].id[2];
  for (let i = 0; i < horizontal.length; i++) {
    if (
      horizontal[i].id[1] == currentRow &&
      horizontal[i].id[2] == currentCol + 1
    ) {
      validShip.push(horizontal[i]);
      currentRow = parseInt(horizontal[i].id[1]);
      currentCol = parseInt(horizontal[i].id[2]);
    } else {
      validShip.forEach((cell) => {
        horizontalValid.push(cell);
      });
      validShip = [horizontal[i]];
      currentRow = horizontal[i].id[1];
      currentCol = horizontal[i].id[2];
    }

    if (validShip.length === shipSize) {
      horizontalValid.push(validShip.shift());
    }
  }

  // Add remaining valid ship cells to horizontalValid
  if (validShip.length > 0) {
    validShip.forEach((cell) => {
      horizontalValid.push(cell);
    });
  }

  let toRemove = [];
  // Check if any of the cells lead to a red cell
  horizontalValid.forEach((cell) => {
    redCells.forEach((redCell) => {
      if (
        cell.id[1] === redCell.id[1] &&
        parseInt(cell.id[2]) + shipSize > redCell.id[2]
      ) {
        toRemove.push(cell);
      }
    });
  });

  // Remove cells that lead to a red cell
  toRemove.forEach((cell) => {
    horizontalValid.splice(horizontalValid.indexOf(cell), 1);
  });

  return horizontalValid;
};

const verticalValidity = (vertical, shipSize, redCells) => {
  // Vertical validity
  let verticalValid = [];
  let validShip = [vertical[0]];
  let currentRow = vertical[0].id[1];
  let currentCol = vertical[0].id[2];
  for (let i = 0; i < vertical.length; i++) {
    if (
      vertical[i].id[1] == currentRow + 1 &&
      vertical[i].id[2] == currentCol
    ) {
      validShip.push(vertical[i]);
      currentRow = parseInt(vertical[i].id[1]);
      currentCol = parseInt(vertical[i].id[2]);
    } else {
      validShip.forEach((cell) => {
        verticalValid.push(cell);
      });
      validShip = [vertical[i]];
      currentRow = vertical[i].id[1];
      currentCol = vertical[i].id[2];
    }

    if (validShip.length === shipSize) {
      verticalValid.push(validShip.shift());
    }
  }

  // Add remaining valid ship cells to verticalValid
  if (validShip.length > 0) {
    validShip.forEach((cell) => {
      verticalValid.push(cell);
    });
  }

  let toRemove = [];

  verticalValid.forEach((cell) => {
    redCells.forEach((redCell) => {
      if (
        cell.id[2] === redCell.id[2] &&
        parseInt(cell.id[1]) + shipSize > redCell.id[1]
      ) {
        toRemove.push(cell);
      }
    });
  });

  toRemove.forEach((cell) => {
    verticalValid.splice(verticalValid.indexOf(cell), 1);
  });

  return verticalValid;
};

export default createForm;
