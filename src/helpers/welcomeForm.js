import LeftClick from "../assets/click.png";
import Gameboard from "../factories/Gameboard";
import { createLayout } from "./layout";
import { shipPlacer, clearAllListeners, resetShipSizes } from "./shipPlacer";
import { gameloop } from "./gameloop";
import { getGameResults } from "./history";

const createForm = () => {
  nameFormContent();
};

// Navigate through the form
const navigateForm = (element) => {
  let currentElement;
  switch (element) {
    case "placer-form":
      currentElement = document.querySelector("#ship-placer-form");
      currentElement.style.display = "flex";
      placerFormContent();
      break;
    case "placer":
      document.querySelector("#ship-placer-form").style.display = "none";
      currentElement = document.querySelector(".ship-placer");
      currentElement.style.display = "grid";
      shipPlacerContent();
      break;
    case "difficulty":
      document.querySelector("#ship-placer-form").style.display = "none";
      currentElement = document.querySelector(".difficulty");
      currentElement.style.display = "block";
      difficultyContent();
      break;
    case "game":
      document.querySelector(".difficulty").style.display = "none";
      currentElement = document.querySelector(".game-board-container");
      currentElement.style.display = "flex";
      document.querySelector(".form-div").style.display = "none";
      createLayout();
      if (window.GAME.placement === "random") {
        gameloop(window.GAME.playerName, "auto", window.GAME.difficulty);
      } else {
        gameloop(
          window.GAME.playerName,
          boardToGameboard(),
          window.GAME.difficulty
        );
      }
      setComputerName();
      break;
    default:
      break;
  }
  currentElement.style.animation = "reveal 1s forwards";
};

// Creates the name form
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
        navigateForm("placer-form");
        window.GAME.playerName = name.value;
      }
    }
  });

  submitButton.addEventListener("click", () => {
    if (name.value.length > 0) {
      nameForm[0].textContent = `Welcome, ${name.value}!`;
      nameForm[1].style.display = "none";
      nameForm[2].style.display = "none";
      navigateForm("placer-form");
      window.GAME.playerName = name.value;
    }
  });
  // Animation
  document.querySelector("#name-form").style.animation = "reveal 1s forwards";
  // Show high scores or old game results
  pastScoresContent();
};

// Loads the past scores table
const pastScoresContent = () => {
  const pastScores = document.querySelector(".past-games");
  let pastScoresTable = pastScores.querySelector("table");
  // Get past scores if they exist
  const pastScoresData = getGameResults();
  // pastScoresData = [gameResult {playerScore, computerScore, playerName, computerName, winner}]
  if (pastScoresData !== null) {
    // Make past scores table visible
    pastScores.style.display = "flex";
    // For every gameResult object, create a table row and append it to the table
    pastScoresData.forEach((gameResult) => {
      const row = document.createElement("tr");
      const scores = document.createElement("td");
      const winner = document.createElement("td");
      scores.textContent = `${gameResult.playerName}(${gameResult.playerScore}) vs ${gameResult.computerName}(${gameResult.computerScore})`;
      winner.textContent = gameResult.winner;
      row.appendChild(scores);
      row.appendChild(winner);
      pastScoresTable.appendChild(row);
    });
    // Add event listener to the past scores button
    const pastScoresBtn = document.querySelector("#past-hider");
    pastScoresBtn.addEventListener("click", () => {
      const table = pastScores.querySelector("table");
      if (table.classList.contains("hidden")) {
        table.style.animation = "reveal 0.5s forwards";
        pastScoresBtn.textContent = "Hide";
        table.classList.remove("hidden");
      } else {
        table.style.animation = "hide 0.25s forwards";
        pastScoresBtn.textContent = "Show";
        // Wait for animation to finish
        setTimeout(() => {
          table.classList.add("hidden");
        }, 251);
      }
    });
  }
};

// Creates the placement form (random or manual)
const placerFormContent = () => {
  const shipBtns = document.querySelector(".ship-placement-btns").children;
  const randomBtn = shipBtns[0];
  const manualBtn = shipBtns[1];
  randomBtn.addEventListener("click", () => {
    window.GAME.placement = "random";
    navigateForm("difficulty");
  });
  manualBtn.addEventListener("click", () => {
    navigateForm("placer");
  });
  // Minimize the scores table if it exists
  let button = document.querySelector("#past-hider");
  if (button.textContent === "Hide") {
    button.click();
  }
};

// Creates the manual ship placement form
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
  // Add event listeners to ships
  shipEventListeners();
  // Add event listeners to the buttons on the right
  createButtons();
};

// Creates elements for the manual ship placement form
const shipEventListeners = () => {
  const destroyer = document.getElementById("ship-destroyer");
  const submarine = document.getElementById("ship-submarine");
  const cruiser = document.getElementById("ship-cruiser");
  const battleship = document.getElementById("ship-battleship");
  const carrier = document.getElementById("ship-carrier");
  const ships = [destroyer, submarine, cruiser, battleship, carrier];
  ships.forEach((ship) => {
    ship.addEventListener("click", () => {
      // Disable mode button
      document.getElementById("mode-button").disabled = true;
      clearAllListeners();
      shipPlacer(ship.id.split("-")[1]);
      console.log(ship.id.split("-")[1]);
      // now that the ship has been placed, remove the event listener
      // const clonedShip = ship.cloneNode(true);
      // ship.replaceWith(clonedShip);
      // clonedShip.removeEventListener("click", () => {});
      // // Add placed class to the ship
      // clonedShip.classList.add("placed");
      ship.classList.add("placed");
    });
  });
};

// Creates buttons in ship placer
const createButtons = () => {
  const modeButton = document.getElementById("mode-button");
  const placeButton = document.getElementById("place-button");
  const resetButton = document.getElementById("reset-button");
  const ships = document.querySelector(".ships");
  const shipNames = document.querySelectorAll(".name-fragment");

  // Mode button: Horizontal or Vertical
  modeButton.addEventListener("click", () => {
    const currentMode = window.GAME.currentMode;
    if (currentMode === "H") {
      modeButton.textContent = "Vertical";
      window.GAME.currentMode = "V";
      // Rotate the ships element by 90 degrees to the left
      ships.style.animation = "horizontalToVertical 0.5s forwards";
      // Change the ship names to vertical
      shipNames.forEach((name) => {
        name.style.animation = "textHorizontalToVertical 0.5s forwards";
        name.parentElement.style.gap = "5px";
      });
    } else {
      modeButton.textContent = "Horizontal";
      window.GAME.currentMode = "H";
      // Set the ships element back to normal
      ships.style.animation = "verticalToHorizontal 0.5s forwards";
      // Change the ship names back to horizontal
      shipNames.forEach((name) => {
        name.style.animation = "textVerticalToHorizontal 0.5s forwards";
        name.parentElement.style.gap = "";
      });
    }
  });

  // Reset button: Reset the ship grid
  resetButton.addEventListener("click", () => {
    // Remove all ships
    // Remove all placed classes (buttons on the left)
    document.querySelectorAll(".placed").forEach((ship) => {
      ship.classList.remove("placed");
    });
    // Remove all event listeners on the grid
    clearAllListeners();
    // Reset the ship grid
    document.querySelectorAll(".occupied").forEach((cell) => {
      cell.classList.remove("occupied");
    });
    // Reset ship data structure within ship placer
    resetShipSizes();
    // Reset ship buttons
    shipEventListeners();
    // Reset mode button
    document.getElementById("mode-button").disabled = false;
    // Make ships element horizontal if it is vertical
    if (window.GAME.currentMode === "V") {
      ships.style.animation = "verticalToHorizontal 0.5s forwards";
      // Change the ship names back to horizontal
      shipNames.forEach((name) => {
        name.style.animation = "textVerticalToHorizontal 0.5s forwards";
        name.parentElement.style.gap = "";
      });
      document.getElementById("mode-button").textContent = "Horizontal";
      window.GAME.currentMode = "H";
    }
    // Disable place button
    document.getElementById("place-button").disabled = true;
  });

  // Place button: Place the ships on the board
  placeButton.addEventListener("click", () => {
    // Hide ship placer
    document.querySelector(".ship-placer").style.display = "none";
    navigateForm("difficulty");
  });
};

// Creates the difficulty form
const difficultyContent = () => {
  const difficulties = ["easy", "medium", "hard"];
  difficulties.forEach((difficulty) => {
    const difficultyButton = document.getElementById(difficulty);
    difficultyButton.addEventListener("click", () => {
      window.GAME.difficulty = difficulty;
      navigateForm("game");
    });
  });
};

// Converts the board to a gameboard
const boardToGameboard = () => {
  const locations = window.GAME.shipLocations;
  const gameboard = new Gameboard();
  gameboard.createBoard();
  // Go over each key:value pair in locations
  for (let [coords, ship] of Object.entries(locations)) {
    let coordsArray = [];
    // Coords 1,2,1,3
    // Remove commas
    coords = coords.replace(/,/g, "");
    for (let i = 0; i < coords.length; i += 2) {
      coordsArray.push([parseInt(coords[i]), parseInt(coords[i + 1])]);
    }
    gameboard.placeShip(ship, coordsArray);
  }
  return gameboard;
};

// Picks a random name for the computer
const setComputerName = () => {
  const easyNames = [
    "Whimsy",
    "Bumble",
    "Zigzag",
    "Giggles",
    "Doodle",
    "Sprinkle",
    "Wobble",
    "Noodle",
    "Squiggle",
    "Jingle",
  ];
  const mediumNames = [
    "Fizzbuzz",
    "Quirkster",
    "Zany",
    "Sillygoose",
    "Jumble",
    "Wacky",
    "Jester",
    "Peculiar",
    "Curly",
    "Chaos",
  ];
  const hardNames = [
    "Riddlesnake",
    "Mischiefmaker",
    "Kookaburra",
    "Whirlwind",
    "Fandango",
    "Pandemonium",
    "Jabberwocky",
    "Hullabaloo",
    "Discombobulator",
    "Kerfuffle",
  ];
  const name = document.querySelector(".computer-name");
  switch (window.GAME.difficulty) {
    case "easy":
      name.textContent = easyNames[Math.floor(Math.random() * 10)];
      break;
    case "medium":
      name.textContent = mediumNames[Math.floor(Math.random() * 10)];
      break;
    case "hard":
      name.textContent = hardNames[Math.floor(Math.random() * 10)];
      break;
  }
};

export default createForm;
