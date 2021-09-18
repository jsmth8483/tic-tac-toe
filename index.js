const displayController = (() => {
	const gameBoxes = document.querySelectorAll('.game-box');
	const messageDiv = document.querySelector('.message');

	function renderBoard(board) {
		gameBoxes.forEach((box, index) => {
			box.textContent = board[index];
		});
	}

	function renderMessage(message) {
		messageDiv.textContent = message;
	}

	return { render: renderBoard, renderMessage };
})();

const playerFactory = function (name, symbol) {
	return { name, symbol };
};

const gameBoard = (function (display) {
	let board = ['', '', '', '', '', '', '', '', ''];
	let playerWon = false;
	let catsGame = false;

	function render() {
		display.render(board);
	}

	function fillBox(index, symbol) {
		let boxWasFilled = false;
		if (board[index] == '') {
			board[index] = symbol;
			render();
			boxWasFilled = true;
			checkGameOver();
			checkCatsGame();
		} else {
			boxWasFilled = false;
		}

		return boxWasFilled;
	}

	function areAllBoxesFilled() {
		let allBoxesFilled = true;
		board.forEach((box) => {
			if (box === '') allBoxesFilled = false;
		});
		return allBoxesFilled;
	}

	function checkCatsGame() {
		if (!playerWon && areAllBoxesFilled()) {
			catsGame = true;
		}
	}

	function checkGameOver() {
		// Rows
		if (
			board[0] === board[1] &&
			board[0] === board[2] &&
			board[1] === board[2] &&
			board[0] != '' &&
			board[1] != '' &&
			board[2] != ''
		)
			playerWon = true;
		else if (
			board[3] === board[4] &&
			board[3] === board[5] &&
			board[4] === board[5] &&
			board[3] != '' &&
			board[4] != '' &&
			board[5] != ''
		)
			playerWon = true;
		else if (
			board[6] === board[7] &&
			board[6] === board[8] &&
			board[7] === board[8] &&
			board[6] != '' &&
			board[7] != '' &&
			board[8] != ''
		)
			playerWon = true;
		// Columns
		else if (
			board[0] === board[3] &&
			board[0] === board[6] &&
			board[3] === board[6] &&
			board[0] != '' &&
			board[3] != '' &&
			board[6] != ''
		)
			playerWon = true;
		else if (
			board[1] === board[4] &&
			board[1] === board[7] &&
			board[4] === board[7] &&
			board[1] != '' &&
			board[4] != '' &&
			board[7] != ''
		)
			playerWon = true;
		else if (
			board[2] === board[5] &&
			board[2] === board[8] &&
			board[5] === board[8] &&
			board[2] != '' &&
			board[5] != '' &&
			board[8] != ''
		)
			playerWon = true;
		// Diagnals
		else if (
			board[0] === board[4] &&
			board[0] === board[8] &&
			board[4] === board[8] &&
			board[0] != '' &&
			board[4] != '' &&
			board[8] != ''
		)
			playerWon = true;
		else if (
			board[2] === board[4] &&
			board[2] === board[6] &&
			board[4] === board[6] &&
			board[2] != '' &&
			board[4] != '' &&
			board[6] != ''
		)
			playerWon = true;
	}

	function hasPlayerWon() {
		return playerWon;
	}

	function isCatsGame() {
		return catsGame;
	}

	function resetBoard() {
		board = ['', '', '', '', '', '', '', '', ''];
		playerWon = false;
		catsGame = false;
		render();
	}

	render();

	return { fillBox, hasPlayerWon, isCatsGame, resetBoard };
})(displayController);

const messageBoard = (function (display) {
	function setMessage(message) {
		display.renderMessage(message);
	}

	return { setMessage };
})(displayController);

const game = (function (board, messageBoard) {
	let player1;
	let player2;
	let currentPlayer;
	bindEvents();
	startGame();

	function generatePlayer(playerNumber) {
		const name = prompt(
			`Enter name for player ${playerNumber}`,
			`Player ${playerNumber}`
		);
		const playerSymbol = playerNumber === 1 ? 'X' : '0';
		return playerFactory(name, playerSymbol);
	}

	function startGame() {
		player1 = generatePlayer(1);
		player2 = generatePlayer(2);
		currentPlayer = player1;
		board.resetBoard();
		messageBoard.setMessage(`${currentPlayer.name}'s turn`);
	}

	function bindEvents() {
		const gameBoxes = document.querySelectorAll('.game-box');
		gameBoxes.forEach((box) => {
			box.addEventListener('click', boxClickHandler);
		});
	}

	function unbindEvents() {
		const gameBoxes = document.querySelectorAll('.game-box');
		gameBoxes.forEach((box) => {
			box.removeEventListener('click', boxClickHandler);
		});
	}

	function displayWinner() {
		messageBoard.setMessage(`${currentPlayer.name} wins!`);
	}

	function displayCatsGame() {
		messageBoard.setMessage('Cats Game. No Winner!');
	}

	function hasPlayerWon() {
		return board.hasPlayerWon();
	}

	function isCatsGame() {
		return board.isCatsGame();
	}

	function boxClickHandler(box) {
		const boxFilled = board.fillBox(
			box.target.getAttribute('data-id'),
			currentPlayer.symbol
		);

		if (boxFilled) {
			if (hasPlayerWon()) {
				displayWinner();
				unbindEvents();
			} else if (isCatsGame()) {
				displayCatsGame();
				unbindEvents();
			} else {
				changePlayers();
			}
		} else {
			displayBoxFilledError();
		}
	}

	function changePlayers() {
		currentPlayer = currentPlayer == player1 ? player2 : player1;
		messageBoard.setMessage(`${currentPlayer.name}'s turn`);
	}

	function displayBoxFilledError() {
		messageBoard.setMessage('Box has already been filled');
	}

	return { startGame };
})(gameBoard, messageBoard);
