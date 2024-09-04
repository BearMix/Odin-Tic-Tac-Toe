const Gameboard = (() => {
  let board = Array(9).fill("");

  const getBoard = () => board;

  const updateBoard = (index, symbol) => {
    if (board[index] === "") {
      board[index] = symbol;
      return true;
    }
    return false;
  };

  const resetBoard = () => {
    board.fill("");
  };

  return { getBoard, updateBoard, resetBoard };
})();

const DisplayController = (() => {
  const boardContainer = document.getElementById("gameboard");
  const scoreboard = document.getElementById("scoreboard");

  const createScoreElement = (id, text) => {
    const scoreElement = document.createElement("p");
    scoreElement.setAttribute("id", id);
    scoreElement.textContent = text;
    return scoreElement;
  };

  const renderScoreboard = (player1Name, player2Name) => {
    scoreboard.innerHTML = "";
    scoreboard.appendChild(
      createScoreElement("score-player1", `${player1Name}: 0`)
    );
    scoreboard.appendChild(createScoreElement("score-draws", "Draws: 0"));
    scoreboard.appendChild(
      createScoreElement("score-player2", `${player2Name}: 0`)
    );
  };

  const renderBoard = () => {
    const board = Gameboard.getBoard();
    boardContainer.innerHTML = "";

    board.forEach((cell, index) => {
      const cellDiv = document.createElement("div");
      cellDiv.classList.add("cell");
      cellDiv.textContent = cell;
      cellDiv.dataset.index = index;

      boardContainer.appendChild(cellDiv);
    });
  };

  const updateCurrentTurn = (playerName) => {
    document.getElementById(
      "current-turn"
    ).textContent = `It's ${playerName}'s turn`;
  };

  const updateScoreboard = (score, player1Name, player2Name) => {
    document.getElementById(
      "score-draws"
    ).textContent = `Draws: ${score.draws}`;
    document.getElementById(
      "score-player1"
    ).textContent = `${player1Name}: ${score.player1}`;
    document.getElementById(
      "score-player2"
    ).textContent = `${player2Name}: ${score.player2}`;
  };

  return { renderBoard, updateCurrentTurn, updateScoreboard, renderScoreboard };
})();

const GameController = (() => {
  let player1, player2, currentPlayer;
  let gameOver = false;
  let score = { player1: 0, player2: 0, draws: 0 };

  const startGame = () => {
    const player1Name =
      document.getElementById("player1-name").value || "Player 1";
    const player2Name =
      document.getElementById("player2-name").value || "Player 2";
    player1 = Player(player1Name, "X");
    player2 = Player(player2Name, "O");
    currentPlayer = player1;
    gameOver = false;

    score = { player1: 0, player2: 0, draws: 0 };

    Gameboard.resetBoard();
    DisplayController.renderBoard();
    DisplayController.renderScoreboard(player1.name, player2.name);
    DisplayController.updateCurrentTurn(currentPlayer.name);
    clearResult();
    document.getElementById("next-round-btn").style.display = "none";
  };

  const switchPlayer = () => {
    currentPlayer = currentPlayer === player1 ? player2 : player1;
    DisplayController.updateCurrentTurn(currentPlayer.name);
  };

  const playRound = (index) => {
    if (gameOver || !Gameboard.updateBoard(index, currentPlayer.symbol)) return;

    DisplayController.renderBoard();
    if (checkWinner()) {
      displayResult(`${currentPlayer.name} wins!`);
      updateScore(currentPlayer);
      endGame();
    } else if (isDraw()) {
      displayResult("It's a draw!");
      updateScore(null);
      endGame();
    } else {
      switchPlayer();
    }
  };

  const checkWinner = () => {
    const board = Gameboard.getBoard();
    const winningCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    return winningCombinations.some((combination) => {
      const [a, b, c] = combination;
      return board[a] && board[a] === board[b] && board[a] === board[c];
    });
  };

  const isDraw = () => Gameboard.getBoard().every((cell) => cell !== "");

  const updateScore = (winner) => {
    if (winner === player1) {
      score.player1++;
    } else if (winner === player2) {
      score.player2++;
    } else {
      score.draws++;
    }
    DisplayController.updateScoreboard(score, player1.name, player2.name);
  };

  const displayResult = (result) => {
    document.getElementById("game-result").textContent = result;
  };

  const clearResult = () => {
    document.getElementById("game-result").textContent = "";
  };

  const endGame = () => {
    gameOver = true;
    document.getElementById("next-round-btn").style.display = "block";
  };

  const nextRound = () => {
    Gameboard.resetBoard();
    DisplayController.renderBoard();
    currentPlayer = player1;
    gameOver = false;
    DisplayController.updateCurrentTurn(currentPlayer.name);
    clearResult();
    document.getElementById("next-round-btn").style.display = "none";
  };

  return { playRound, startGame, nextRound };
})();

const Player = (name, symbol) => ({ name, symbol });

document
  .getElementById("start-reset-btn")
  .addEventListener("click", GameController.startGame);

document
  .getElementById("next-round-btn")
  .addEventListener("click", GameController.nextRound);

document.getElementById("gameboard").addEventListener("click", (event) => {
  const index = event.target.dataset.index;
  if (index !== undefined) GameController.playRound(index);
});
