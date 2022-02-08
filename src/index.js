function roll(roll = "1d6") {
	try {
		let [dice, modifiers] = extractRollElements(roll);

		// Handle dice
		const faces = getFaces(...dice.split("d"));

		// Handle modifiers
		modifiers = splitModifiers(modifiers);

		// Compute and return
		const total = getTotal(faces, modifiers);
		return { roll, faces, total };
	} catch (error) {
		return;
	}
}

function extractRollElements(roll) {
	roll = tidy(roll);
	const i = roll.search(/\+|\-/);
	return [roll.substring(0, i), roll.substring(i)];
}

function tidy(roll) {
	roll = roll.toLowerCase();
	roll = roll.replace(/\s/g, "");
	roll = roll.replace("%", "100");

	if (roll.match(/^d[0-9]+$/)) roll = `1${roll}`;
	if (roll.match(/^[0-9]+$/)) roll = `1d${roll}`;
	return roll;
}

function getFaces(numOfDice, numOfSides) {
	const result = [];

	for (let i = 0; i < numOfDice; i++) {
		result.push(Math.floor(Math.random() * numOfSides + 1));
	}

	return result;
}

function splitModifiers(modifiers) {
	const result = [];

	function extractModifiers(modStr) {
		for (let i = 1; i < modStr.length; i++) {
			if (modStr[i] === "+" || modStr[i] === "-") {
				result.push(modStr.substring(0, i));
				return extractModifiers(modStr.substring(i));
			}
		}
		result.push(modStr);
		return;
	}

	extractModifiers(modifiers);

	return result;
}

function getTotal(faces, modifiers) {
	let total = 0;
	faces.forEach((face) => (total += face));
	modifiers.forEach((modifier) => (total += Number(modifier)));
	return total;
}

// function getRollElements(roll) {
// 	// Vet format
// 	if (roll.match(/^[0-9]+d[0-9]+$/)) {
// 		// ndn
// 		return { roll, dice, modifier };
// 	} else if (roll.match(/^[0-9]+d[0-9]+((\+|\-)[0-9]+)+$/)) {
// 		// ndn +/- n +/- n...
// 		const operatorIndex = roll.search(/[\+|\-]/);
// 		dice = roll.substring(0, operatorIndex);
// 		modifier = roll.substring(operatorIndex);

// 		return { roll, dice, modifier };
// 	} else return;
// }

// function getDiceResult(dice) {
// 	const result = { roll: dice, faces: [], total: 0 };

// 	// Parse dice
// 	dice = dice.split("d");
// 	const numOfDice = parseInt(dice[0]);
// 	const sidesOfDice = parseInt(dice[1]);

// 	// Do roll
// 	const faces = getDiceFaces(numOfDice, sidesOfDice);
// 	faces.forEach((face) => {
// 		result.faces.push(face);
// 		result.total += face;
// 	});

// 	return result;
// }
module.exports = roll;
