const scoreEl = document.getElementById("score");

let board = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

let score = 0 ;
function startGame() {
  board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];
  addNewTile();
  addNewTile();
  updateBoard();
}

function resetScore() {
  score = 0; // Reset skor ke 0
  scoreEl.innerText = score; // Perbarui tampilan skor
}
const resetScoreBtn = document.getElementById("new-game-btn");
resetScoreBtn.addEventListener("click", resetScore);


function addNewTile() {
  const emptyTiles = [];

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      if (board[row][col] === 0) {
        emptyTiles.push({ row, col });
      }
    }
  }

  if (emptyTiles.length > 0) {
    const randomIndex = Math.floor(Math.random() * emptyTiles.length);
    const { row, col } = emptyTiles[randomIndex];

    const newValue = Math.random() < 0.9 ? 2 : 4;
    board[row][col] = newValue;
  }
}

function updateBoard() {
  const gameBoard = document.getElementById("game-board");
  gameBoard.innerHTML = "";

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      const tileValue = board[row][col];
      const tile = document.createElement("div");

      tile.className = "tile";
      tile.textContent = tileValue !== 0 ? tileValue : "";

      tile.style.backgroundColor = getTileColor(tileValue);
      tile.style.color = [2, 4, 8].includes(tileValue) ? "#6b6359" : "#fff";

      gameBoard.appendChild(tile);
    }
  }
}

function getTileColor(value) {
  if (value === 0) return "#c8bdae";

  const colors = ["#e7dfd3", "#E7DBBD", "#EFAC73", "#F48E5F", "#EB7A54", "#F45B38", "#E8C96A", "#ECC95C"];

  for (let i in colors) {
    if (2 ** i === value) {
      return colors[i];
    }
  }

  return "#ecc95c";
}

function moveTiles(direction) {
  let tileMoved = false;
  console.log(direction);
  const rowIndices = direction === "up" ? [0, 1, 2, 3] : [3, 2, 1, 0];
  const colIndices = direction === "left" ? [0, 1, 2, 3] : [3, 2, 1, 0];

  let canMove = false; // Variabel untuk memeriksa apakah masih ada gerakan yang mungkin

  // Looping untuk memeriksa apakah masih ada gerakan yang mungkin sebelum pemindahan ubin
  for (let row of rowIndices) {
    for (let col of colIndices) {
      const currentValue = board[row][col];
      if (currentValue === 0) {
        canMove = true;
      } else {
        // Periksa apakah ubin saat ini dapat digabungkan dengan ubin sebelahnya
        if (
          (direction === "up" && row > 0 && board[row - 1][col] === currentValue) ||
          (direction === "down" && row < 3 && board[row + 1][col] === currentValue) ||
          (direction === "left" && col > 0 && board[row][col - 1] === currentValue) ||
          (direction === "right" && col < 3 && board[row][col + 1] === currentValue)
        ) {
          canMove = true;
        }
      }
    }
  }

  // Jika tidak ada gerakan yang mungkin, tampilkan "Game Over" dan reset permainan
  if (!canMove) {
    alert("Game Over!");
    startGame();
    return;
  }

  // Jika masih ada gerakan yang mungkin, lakukan pemindahan ubin seperti biasa
  for (let row of rowIndices) {
    for (let col of colIndices) {
      const currentValue = board[row][col];

      if (currentValue === 0) continue;

      let newRow = row;
      let newCol = col;
      let currentRow = row;
      let currentCol = col;

      while (true) {
        if (direction === "up") {
          newRow--;
          currentRow = newRow + 1;
        } else if (direction === "down") {
          newRow++;
          currentRow = newRow - 1;
        } else if (direction === "left") {
          newCol--;
          currentCol = newCol + 1;
        } else if (direction === "right") {
          newCol++;
          currentCol = newCol - 1;
        }

        if (newRow < 0 || newRow >= 4 || newCol < 0 || newCol >= 4) {
          newRow -= direction === "up" ? -1 : 1;
          newCol -= direction === "left" ? -1 : 1;
          break;
        }

        const newValue = board[newRow][newCol];

        if (newValue === 0) {
          board[newRow][newCol] = currentValue;
          board[currentRow][currentCol] = 0;
          tileMoved = true;
        } else if (newValue === currentValue) {
          board[newRow][newCol] += currentValue;
          board[currentRow][currentCol] = 0;
          tileMoved = true;
          score += currentValue;
          scoreEl.innerText = score;
          break;
        } else {
          newRow -= direction === "up" ? -1 : 1;
          newCol -= direction === "left" ? -1 : 1;
          break;
        }
      }
    }
  }

  if (tileMoved) {
    addNewTile();
    updateBoard();
  }
}


document.addEventListener("keydown", function (event) {
  console.log(event.key);
  if (event.key === "ArrowUp") {
    moveTiles("up");
  } else if (event.key === "ArrowDown") {
    moveTiles("down");
  } else if (event.key === "ArrowLeft") {
    moveTiles("left");
  } else if (event.key === "ArrowRight") {
    moveTiles("right");
  }
});

const newGameBtn = document.getElementById("new-game-btn");
newGameBtn.addEventListener("click", startGame);

startGame();