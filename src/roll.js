const { dropHighestNInArray, dropLowestNInArray, sumArray } = require("./utils");

module.exports = (roll = "1d6") => {
	// Amend syntax
	roll = tightenSyntax(roll);

	// Split roll string into array of expressions
	const rollArray = roll.split(/(\+|-)/);

	
	// Parse each expression
	let faces = [];
	let value = 0;
	let operator = "+";
	for (let i = 0; i < rollArray.length; i++) {
		const e = rollArray[i];

		// is a number
		if (/^\d+$/.test(e)) {
			value += (operator === "+") ? Number(e) : -Number(e);
		}
		// is a dice roll
		if (e.includes("d")) {
			const f = getFaces(e);
			value += (operator === "+") ? sumArray(f) : -sumArray(f);
			faces = faces.concat(f);
		}
		// is an operator
		operator = /(\+|-)/.test(e) ? e : "+";
	}

	return { roll, faces, value }
}

function tightenSyntax(roll) {
	roll = roll.toLowerCase();
	roll = roll.replace(/\s/g, "");
	roll = roll.replace("%", "100");
	if (roll.match(/^d[0-9]+$/)) roll = `1${roll}`;
	if (roll.match(/^[0-9]+$/)) roll = `1d${roll}`;


	while (roll.includes("explode")) {
		// remove explode and isolate the roll segment which contained it
		roll = roll.split("explode");

		// find the first operator, the only thing which divides expressions with a roll string
		const bangIndex = roll[1].match(/(\+|-)/) ? roll[1].match(/(\+|-)/).index : roll[1].length;

		// stitch it back together with a '!' inserted before the first available operator after the first explode
		roll = roll[0] + roll[1].substring(0, bangIndex) + "!" + roll[1].substring(bangIndex);
	}

	return roll;
}

function getFaces(roll) {
	// extract any and all flags from the roll expression
	const { dice, explode, highest, lowest } = extractFlags(roll);

	const [numOfDice, numOfSides] = dice.split("d");
	let faces = [];

	// roll the dice, exploding if necessary
	for (let i = 0; i < numOfDice; i++) {
		let result;
		do {
			result = Math.floor(Math.random() * numOfSides + 1);
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

function extractFlags(roll) {
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