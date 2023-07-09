// Stores the game results in localStorage

// MDN Storage available check
function storageAvailable(type) {
  let storage;
  try {
    storage = window[type];
    const x = "__storage_test__";
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    return (
      e instanceof DOMException &&
      // everything except Firefox
      (e.code === 22 ||
        // Firefox
        e.code === 1014 ||
        // test name field too, because code might not be present
        // everything except Firefox
        e.name === "QuotaExceededError" ||
        // Firefox
        e.name === "NS_ERROR_DOM_QUOTA_REACHED") &&
      // acknowledge QuotaExceededError only if there's something already stored
      storage &&
      storage.length !== 0
    );
  }
}

// Check if there are any saved game results
const checkGameResult = () => {
  if (storageAvailable("localStorage")) {
    const gameResults = JSON.parse(localStorage.getItem("gameResults"));
    if (gameResults) {
      return true;
    }
  }
  return false;
};

// Save the game result into localStorage for later use
export const onGameOver = (playerScore, computerScore) => {
  const computerName = document.querySelector(".computer-name").textContent;
  const playerName = document.querySelector(".player-name").textContent;
  let winner;
  if (playerScore > computerScore) {
    winner = playerName;
  } else {
    winner = computerName;
  }
  const gameResult = {
    playerScore,
    computerScore,
    playerName,
    computerName,
    winner,
  };
  if (storageAvailable("localStorage")) {
    if (localStorage.getItem("gameResults")) {
      let gameResults = JSON.parse(localStorage.getItem("gameResults"));
      gameResults.push(gameResult);
      localStorage.setItem("gameResults", JSON.stringify(gameResults));
    } else {
      localStorage.setItem("gameResults", JSON.stringify([gameResult]));
    }
  }
};

// Retrieve the saved game result(s) from localStorage
export const getGameResults = () => {
  if (storageAvailable("localStorage") && checkGameResult()) {
    return JSON.parse(localStorage.getItem("gameResults"));
  }
  return null;
};
