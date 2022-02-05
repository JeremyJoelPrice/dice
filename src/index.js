function roll(dice = "1d6") {
	const result = {
		roll: `${dice}`,
		faces: [],
		total: 0
	};

	const numOfDieToRoll = parseInt(dice.charAt(0));
    const sidesOfDice = parseInt(dice.charAt(2));

	for (let i = 0; i < numOfDieToRoll; i++) {
		const face = singleRoll(sidesOfDice);
		result.faces.push(face);
		result.total += face;
	}

	return result;
}

function singleRoll(numOfSides) {
	return Math.floor(Math.random() * numOfSides + 1);
}

module.exports = roll;
