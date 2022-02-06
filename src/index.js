function roll(inputRoll = "1d6") {
	// Parse input
	const rollElements = parseRoll(inputRoll);
	if (!rollElements) return;
	const { roll, dice, modifier } = rollElements;

	const result = getResult(dice);
	result.roll = roll;
	result.total += parseInt(modifier) || 0;
	return result;
}

function parseRoll(roll) {
	// Tidy up roll
	roll = tidy(roll);

	let dice = roll;
	let modifier = 0;

	// Vet format
	if (roll.match(/^[0-9]+d[0-9]+$/)) {
		// ndn
		return { roll, dice, modifier };
	} else if (roll.match(/^[0-9]+d[0-9]+((\+|\-)[0-9]+)+$/)) {
		// ndn +/- n +/- n...
		const operatorIndex = roll.search(/[\+|\-]/);
		dice = roll.substring(0, operatorIndex);
		modifier = roll.substring(operatorIndex);

		return { roll, dice, modifier };
	} else return;
}

function tidy(roll) {
	roll = roll.toLowerCase();
	roll = roll.replace(/\s/g, "");
	roll = roll.replace("%", "100");

	if (roll.match(/^d[0-9]+$/)) roll = `1${roll}`;
	if (roll.match(/^[0-9]+$/)) roll = `1d${roll}`;
	return roll;
}

function getResult(dice) {
	const result = { roll: dice, faces: [], total: 0 };

	// Do a simple roll
	dice = dice.split("d");
	const numOfDice = parseInt(dice[0]);
	const sidesOfDice = parseInt(dice[1]);

	// Do roll
	const faces = getFaces(numOfDice, sidesOfDice);
	faces.forEach((face) => {
		result.faces.push(face);
		result.total += face;
	});

	return result;
}

function getFaces(numOfDice, numOfSides) {
	const result = [];

	for (let i = 0; i < numOfDice; i++) {
		result.push(Math.floor(Math.random() * numOfSides + 1));
	}

	return result;
}

module.exports = roll;
