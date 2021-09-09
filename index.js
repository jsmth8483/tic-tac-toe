const gameBoard = (function () {
	const board = ['', '', '', '', '', '', '', '', '', ''];

	return {};
})();

const playerFactory = (name) => {
	return { name };
};

const player1 = playerFactory('James');

console.log(player1.name);
