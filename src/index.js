module.exports = function roll(roll = "1d6") {
	try {
		roll = tightenSyntax(roll);

		let { dice, explode, modifiers = [] } = extractRollElements(roll);

		// Handle dice
		const faces = getFaces(dice.split("d")[0], dice.split("d")[1], explode);

		// Handle modifiers
		modifiers = splitModifiers(modifiers);

		// Compute and return
		const total = getTotal(faces, modifiers);

		return { roll, faces, total };
	} catch (error) {
		return;
	}
};

function tightenSyntax(roll) {
	roll = roll.toLowerCase();
	roll = roll.replace(/\s/g, "");
	roll = roll.replace("explode", "explode ");
	roll = roll.replace("%", "100");

	if (roll.match(/^d[0-9]+$/)) roll = `1${roll}`;
	if (roll.match(/^[0-9]+$/)) roll = `1d${roll}`;

	if (
		roll.match(/^[0-9]+d[0-9]+((\+|\-)[0-9]+)+$/) ||
		roll.match(/^[0-9]+d[0-9]+$/)
	)
		return roll;
	else if (roll.match(/^explode [0-9]+d[0-9]+/)) return roll;

	return;
}

function extractRollElements(roll) {
	let explode = false;
	if (roll.startsWith("explode ")) {
		roll = roll.split("explode ")[1];
		explode = true;
	}

	const i = roll.search(/\+|\-/);
	if (i > 0) {
		return {
			dice: roll.substring(0, i),
			explode,
			modifiers: roll.substring(i)
		};
	} else {
		return { dice: roll, explode };
	}
}

function getFaces(numOfDice, numOfSides, explode) {
	const faces = [];

	for (let i = 0; i < numOfDice; i++) {
		let result;
		do {
			result = Math.floor(Math.random() * numOfSides + 1);
			faces.push(result);
		} while (explode && result == numOfSides);
	}

	return faces;
}

function splitModifiers(modifiers) {
	const modifiersArray = [];

	function extractModifiers(modStr) {
		for (let i = 1; i < modStr.length; i++) {
			if (modStr[i] === "+" || modStr[i] === "-") {
				modifiersArray.push(modStr.substring(0, i));
				return extractModifiers(modStr.substring(i));
			}
		}
		modifiersArray.push(modStr);
		return;
	}

	extractModifiers(modifiers);

	return modifiersArray;
}

function getTotal(faces, modifiers) {
	let total = 0;
	faces.forEach((face) => (total += face));
	modifiers.forEach((modifier) => (total += Number(modifier)));
	return total;
}
