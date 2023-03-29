const { dropHighestNInArray, dropLowestNInArray, sumArray } = require("./utils");

module.exports = (roll = "1d6") => {
	const rollString = forgiveRollStringSyntax(roll);

	const rollElements = rollString.split(/(\+|-)/);


	let faces = [];
	let value = 0;
	let operator = "+";
	for (let i = 0; i < rollElements.length; i++) {
		let e = rollElements[i];

		// is %
		if (e === "%" || e === "d%") e = "1d100";
		if (/^\d+d%$/.test(e)) e = e.replace("%", "100");
		// is df
		if (e === "dF") e = "4dF";
		// is a number
		if (/^\d+$/.test(e)) {
			value += (operator === "+") ? Number(e) : -Number(e);
		}
		// is a dice roll
		if (e.includes("d")) {
			e = forgiveDiceElementSyntax(e);
			const f = executeDiceElement(e);
			value += (operator === "+") ? sumArray(f) : -sumArray(f);
			faces = faces.concat(f);
		}
		// is an operator
		operator = /(\+|-)/.test(e) ? e : "+";
	}

	return { roll, faces, value }
}

function forgiveRollStringSyntax(rollString) {
	rollString = rollString.toLowerCase();
	rollString = rollString.replace("f", "F");
	rollString = rollString.replace(/\s/g, "");
	// rollString = rollString.replace("%", "100");
	if (rollString.match(/^[0-9]+$/)) rollString = `1d${rollString}`;

	while (rollString.includes("explode")) {
		// remove explode and isolate the roll segment which contained it
		rollString = rollString.split("explode");

		// find the first operator, the only thing which divides expressions within a roll string
		const bangIndex = rollString[1].match(/(\+|-)/) ? rollString[1].match(/(\+|-)/).index : rollString[1].length;

		// stitch it back together with a '!' inserted before the first available operator after the first explode
		rollString = rollString[0] + rollString[1].substring(0, bangIndex) + "!" + rollString[1].substring(bangIndex);
	}

	return rollString;
}

function forgiveDiceElementSyntax(diceElement) {
	if (diceElement.match(/^d[0-9]+$/)) diceElement = `1${diceElement}`;
	return diceElement;
}

function executeDiceElement(diceElement) {
	// extract any and all flags from the roll expression
	const { dice, explode, highest, lowest } = extractAllFlags(diceElement);

	const [numOfDice, numOfSides] = dice.split("d");
	let faces = [];

	// roll the dice, exploding if necessary
	for (let i = 0; i < numOfDice; i++) {
		let result;
		do {
			result =rollDie(numOfSides);
			faces.push(result);
		} while (explode && result == numOfSides);
	}

	// filter the highest dice
	if (highest !== undefined) {
		const drop = faces.length - highest;
		if (drop >= faces.length) {
			faces = [];
		}
		else if (drop < faces.length && drop > 0) faces = dropLowestNInArray(faces, drop);
	}

	// filter the lowest dice
	if (lowest !== undefined) {
		const drop = faces.length - lowest;
		if (drop >= faces.length) {
			faces = [];
		}
		else if (drop < faces.length && drop > 0) faces = dropHighestNInArray(faces, drop);
	}

	return faces;
}

function extractAllFlags(roll) {
	// extracts flags like `!` for explode, and `h2` for keep highest 2
	let explode;
	let highest;
	let lowest;

	let v;
	v = extractGivenFlag(roll, "!");
	if (v.flag) {
		roll = v.roll;
		explode = v.flag;
	}

	v = extractGivenFlag(roll, /h\d*/);
	if (v.flag) {
		roll = v.roll;
		highest = v.flag.substring(1);
	}

	v = extractGivenFlag(roll, /l\d*/);
	if (v.flag) {
		roll = v.roll;
		lowest = Number(v.flag.substring(1));
	}

	return { dice: roll, explode, highest, lowest };
}

function extractGivenFlag(roll, flag) {
	// extracts the given flag, and returns the roll and the flag, if found.
	// If no flag found, returns the original roll and the flag property is undefined.

	const match = roll.match(flag);
	if (match) {
		flag = match[0];
		roll = roll.replace(match[0], "");
	}
	else { flag = undefined; }

	return { roll, flag }
}

function rollDie(numOfSides) {
	if (numOfSides === "F") {
		return Math.floor(Math.random() * 3 - 1);
	}
	return Math.floor(Math.random() * numOfSides + 1);
}