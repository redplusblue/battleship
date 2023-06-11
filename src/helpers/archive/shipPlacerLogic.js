shipCells.forEach((cell) => {
  cell.addEventListener("mouseover", () => {
    let cellId = cell.id;
    let cellRow = cellId.split("")[1];
    let cellCol = cellId.split("")[2];
    let cellRowNum = parseInt(cellRow);
    let cellColNum = parseInt(cellCol);

    // Check if the ship can fit without applying the color
    let canFit = true;
    for (let i = 0; i < shipSize; i++) {
      let cell = document.getElementById(`T${cellRowNum}${cellColNum + i}`);
      if (cell === null || cell.style.backgroundColor === "red") {
        canFit = false;
        break;
      }
    }

    if (canFit) {
      shipGrid.style.cursor = "pointer";
      cell.addEventListener("click", () => {
        let cellId = cell.id;
        let cellRow = cellId.split("")[1];
        let cellCol = cellId.split("")[2];
        let cellRowNum = parseInt(cellRow);
        let cellColNum = parseInt(cellCol);

        for (let i = 0; i < shipSize; i++) {
          let cell = document.getElementById(`T${cellRowNum}${cellColNum + i}`);
          if (cell !== null && cell.style.backgroundColor !== "red") {
            cell.style.backgroundColor = "red";
          }
        }
        // Once the ship is placed, remove all event listeners
        shipCells.forEach((cell) => {
          cell.removeEventListener("mouseover", () => {});
          cell.removeEventListener("click", () => {});
        });
      });
    } else {
      shipGrid.style.cursor = "not-allowed";
      cell.addEventListener("click", () => {});
    }
  });
});

// Reset cursor and cell colors on mouseout
shipGrid.addEventListener("mouseout", () => {
  shipGrid.style.cursor = "auto";
});
