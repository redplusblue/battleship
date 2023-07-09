import Ship from "../factories/Ship";
/**
 * The ship placer module is responsible for placing ships on the board
 * @param {*} ship is the name of the ship to be placed
 */

const shipSizes = {
  destroyer: 2,
  submarine: 3,
  cruiser: 3,
  battleship: 4,
  carrier: 6,
};

export const resetShipSizes = () => {
  shipSizes.destroyer = 2;
  shipSizes.submarine = 3;
  shipSizes.cruiser = 3;
  shipSizes.battleship = 4;
  shipSizes.carrier = 6;
};

export const shipPlacer = (ship) => {
  const shipSize = parseInt(shipSizes[ship]);
  console.log(shipSize);
  console.log(shipSizes);
  console.log(ship);
  // Select all ship cells that are valid for the ship size
  let currentMode = window.GAME.currentMode;
  let validCells;
  switch (currentMode) {
    case "H":
      validCells = validShipCells(shipSize).horizontalValid;
      horizontalHover(validCells, shipSize);
      break;
    case "V":
      validCells = validShipCells(shipSize).verticalValid;
      verticalHover(validCells, shipSize);
      break;
    default:
      validCells = validShipCells(shipSize).horizontalValid;
      break;
  }
};

// Adds event listeners to the cells that are valid for the ship size and mode
const horizontalHover = (validCells, shipSize) => {
  const getAllowedCells = (cell) => {
    const allowedCells = [];
    // of the form T00
    let currentId = cell.id;
    for (let i = 0; i < shipSize; i++) {
      allowedCells.push(currentId);
      currentId =
        currentId[0] + currentId[1] + (parseInt(currentId[2]) + 1).toString();
    }
    return allowedCells;
  };
  // Hover effect
  validCells.forEach((cell) => {
    let allowedCells = getAllowedCells(cell);
    cell.addEventListener("mouseover", () => {
      // Colour cells upto ship size
      allowedCells.forEach((allowedCell) => {
        let currentCell = document.getElementById(allowedCell);
        if (currentCell) {
          currentCell.classList.add("hovered");
        }
      });
    });
    cell.addEventListener("mouseout", () => {
      // Remove colour from cells upto ship size
      allowedCells.forEach((allowedCell) => {
        let currentCell = document.getElementById(allowedCell);
        if (currentCell) {
          currentCell.classList.remove("hovered");
        }
      });
    });
  });

  // Add event listeners to valid cells
  validCells.forEach((cell) => {
    cell.addEventListener("click", () => {
      // Place ship
      let allowedCells = getAllowedCells(cell);
      allowedCells.forEach((allowedCell) => {
        let currentCell = document.getElementById(allowedCell);
        if (currentCell) {
          currentCell.classList.remove("hovered");
          currentCell.classList.add("occupied");
        }
      });
      // Add ship to shipLocations
      let currentSize = [];
      for (let i = 0; i < shipSize; i++) {
        currentSize.push(i);
      }
      // Find key in shipSizes object with value shipSize
      let shipName = Object.keys(shipSizes).find(
        (k) => shipSizes[k] === shipSize
      );
      let currentShip = new Ship(shipName, currentSize);
      let currentCoords = [];
      allowedCells.forEach((id) => {
        currentCoords.push([id[1], id[2]]);
      });
      window.GAME.shipLocations[currentCoords] = currentShip;
      // Delete the placed ship from shipSizes
      delete shipSizes[shipName];
      clearAllListeners();
      // Re enable mode button
      document.getElementById("mode-button").disabled = false;
      // Check if all ships have been placed
      if (checkIfAllShipsPlaced()) {
        // Enable place button
        document.getElementById("place-button").disabled = false;
        // Disable mode button
        document.getElementById("mode-button").disabled = true;
      }
    });
  });
};

// Adds event listeners to the cells that are valid for the ship size and mode
const verticalHover = (validCells, shipSize) => {
  const shipLocations = window.GAME.shipLocations;
  const getAllowedCells = (cell) => {
    const allowedCells = [];
    // of the form T00
    let currentId = cell.id;
    for (let i = 0; i < shipSize; i++) {
      if (currentId) {
        allowedCells.push(currentId);
        currentId =
          currentId[0] + (parseInt(currentId[1]) + 1).toString() + currentId[2];
      }
    }
    return allowedCells;
  };
  // Hover effect
  validCells.forEach((cell) => {
    const allowedCells = getAllowedCells(cell);
    cell.addEventListener("mouseover", () => {
      allowedCells.forEach((id) => {
        const cell = document.getElementById(id);
        if (cell) {
          cell.classList.add("hovered");
        }
      });
    });
    cell.addEventListener("mouseout", () => {
      allowedCells.forEach((id) => {
        const cell = document.getElementById(id);
        if (cell) {
          cell.classList.remove("hovered");
        }
      });
    });
  });

  // Add event listeners to valid cells
  validCells.forEach((cell) => {
    const allowedCells = getAllowedCells(cell);
    cell.addEventListener("click", () => {
      // Place ship
      allowedCells.forEach((id) => {
        const cell = document.getElementById(id);
        if (cell) {
          cell.classList.remove("hovered");
          cell.classList.add("occupied");
        }
      });
      // Record ship location
      let currentSize = [];
      for (let i = 0; i < shipSize; i++) {
        currentSize.push(i);
      }
      // Find key in shipSizes object with value shipSize
      let shipName = Object.keys(shipSizes).find(
        (k) => shipSizes[k] === shipSize
      );
      let currentShip = new Ship(shipName, currentSize);
      let currentCoords = [];
      allowedCells.forEach((id) => {
        currentCoords.push([id[1], id[2]]);
      });
      window.GAME.shipLocations[currentCoords] = currentShip;
      // Delete the placed ship from shipSizes
      delete shipSizes[shipName];
      clearAllListeners();
      // Re enable mode button
      document.getElementById("mode-button").disabled = false;
      // Check if all ships have been placed
      if (checkIfAllShipsPlaced()) {
        // Enable place button
        document.getElementById("place-button").disabled = false;
        // Disable mode button
        document.getElementById("mode-button").disabled = true;
      }
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
    if (cell.classList.contains("occupied") === true) {
      redCells.push(cell);
    } else {
      if (cell.id[2] <= 10 - shipSize) {
        horizontal.push(cell);
      }
      if (cell.id[1] <= 10 - shipSize) {
        vertical.push(cell);
      }
    }
  });

  const horizontalValid = horizontalValidity(horizontal, shipSize, redCells);
  const verticalValid = verticalValidity(vertical, shipSize, redCells);

  return { horizontalValid, verticalValid };
};

// Returns all the cells that are valid for the ship size and mode
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

  const hasRed = (cellX, shipsize, redX) => {
    let coords = [];
    // Generate all coordinates from cellX to shipsize
    for (let i = 0; i < shipsize; i++) {
      coords.push(cellX + i);
    }
    // Check if any of the coordinates match the redX
    if (coords.indexOf(redX) !== -1) {
      return true;
    } else {
      return false;
    }
  };

  let toRemove = [];
  // Check if any of the cells lead to a red cell
  horizontalValid.forEach((cell) => {
    redCells.forEach((redCell) => {
      if (
        cell.id[1] === redCell.id[1] &&
        hasRed(parseInt(cell.id[2]), shipSize, parseInt(redCell.id[2])) &&
        toRemove.indexOf(cell) === -1
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

// Returns all the cells that are valid for the ship size and mode
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

  const hasRed = (cellY, shipsize, redY) => {
    let coords = [];
    // Generate all coordinates from cellY to shipsize
    for (let i = 0; i < shipsize; i++) {
      coords.push(cellY + i);
    }
    // Check if any of the coordinates match the redY
    if (coords.indexOf(redY) !== -1) {
      return true;
    } else {
      return false;
    }
  };

  let toRemove = [];

  verticalValid.forEach((cell) => {
    redCells.forEach((redCell) => {
      if (
        cell.id[2] === redCell.id[2] &&
        hasRed(parseInt(cell.id[1]), shipSize, parseInt(redCell.id[1])) &&
        toRemove.indexOf(cell) === -1
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

export const clearAllListeners = () => {
  const shipGrid = document.querySelector(".ship-grid");
  const shipCells = shipGrid.querySelectorAll(".col");

  shipCells.forEach((cell) => {
    const clonedCell = cell.cloneNode(true);
    cell.replaceWith(clonedCell);

    clonedCell.removeEventListener("click", () => {});
    clonedCell.removeEventListener("mouseover", () => {});
    clonedCell.removeEventListener("mouseout", () => {});
  });
};

const checkIfAllShipsPlaced = () => {
  return document.querySelectorAll(".placed").length === 5;
};
