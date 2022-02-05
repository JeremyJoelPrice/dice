let result;

function roll(dice = "1d6") {
	result = { roll: dice, faces: [], total: 0 };

	let numOfDice;
	let sidesOfDice;

	// Parse input
	dice = dice.replace(/\s/g, "");
	dice = dice.replace("%", "100");
	if (dice.match(/^d/)) dice = `1${dice}`;
	if (dice.match(/^[0-9]+$/)) dice = `1d${dice}`;

	if (dice.match(/^[0-9]+d[0-9]+$/i)) {
		// unmodified roll with 1 type of dice
		dice = dice.split("d");
		numOfDice = parseInt(dice[0] || 1);
		sidesOfDice = parseInt(dice[1]);
		result.roll = `${dice[0] ? dice[0] : 1}d${dice[1]}`;
	} else return;

	// Do roll
	const faces = unmodifiedRoll(numOfDice, sidesOfDice);
	faces.forEach((face) => {
		result.faces.push(face);
		result.total += face;
	});

	// Return result
	return result;
}

function unmodifiedRoll(numOfDice, numOfSides) {
	const result = [];

	for (let i = 0; i < numOfDice; i++) {
		result.push(Math.floor(Math.random() * numOfSides + 1));
	}

	return result;
}

module.exports = roll;
