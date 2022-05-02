const { dropHighestNInArray, dropLowestNInArray, sumArray } = require("./utils");

module.exports = (roll = "1d6") => {
	roll = tightenSyntax(roll);

	let faces = [];
	let value = 0;

	const rollArray = roll.split(/(\+|-)/);

	let operator = "+";
	for (let i = 0; i < rollArray.length; i++) {

		let e = rollArray[i];
		// is it a number?
		if (/^\d+$/.test(e)) {
			value += (operator === "+") ? Number(e) : -Number(e);
		}
		// is it a dice roll, possibly exploding?
		if (/^\d*d\d*!*((h|l)\d*)*$/.test(e)) {
			const f = getFaces(e);
			value += (operator === "+") ? sumArray(f) : -sumArray(f);
			faces = faces.concat(f);
		}
		// is it an operator?
		if (/(\+|-)/.test(e)) {
			operator = e;
		} else {
			operator = "+";
		}
	}

	return { roll, faces, value }
}

function tightenSyntax(roll) {
	roll = roll.toLowerCase();
	roll = roll.replace(/\s/g, "");
	roll = roll.replace("%", "100");
	while (roll.includes("explode")) {
		// remove explode and isolate the roll segment which contained it
		roll = roll.split("explode");

		// find the first operator, the only thing which divides expressions with a roll string
		const bangIndex = roll[1].match(/(\+|-)/) ? roll[1].match(/(\+|-)/).index : roll[1].length;

		// stich it back together with a '!' inserted before the first available operator after the first explode
		roll = roll[0] + roll[1].substring(0, bangIndex) + "!" + roll[1].substring(bangIndex);
	}

	if (roll.match(/^d[0-9]+$/)) roll = `1${roll}`;
	if (roll.match(/^[0-9]+$/)) roll = `1d${roll}`;

	return roll;
}

function getFaces(roll) {
	const { dice, explode, highest, lowest } = extractFlags(roll);

	const [numOfDice, numOfSides] = dice.split("d");
	let faces = [];

	// rolling & exploding
	for (let i = 0; i < numOfDice; i++) {
		let result;
		do {
			result = Math.floor(Math.random() * numOfSides + 1);
			faces.push(result);
		} while (explode && result == numOfSides);
	}

	// keep highest
	if (highest !== undefined) {
		const drop = faces.length - highest;
		if (drop >= faces.length) {
			faces = [];
		}
		else if (drop < faces.length && drop > 0) faces = dropLowestNInArray(faces, drop);
	}

	// keep lowest
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
	v = extractFlag(roll, "!");
	if (v.flag) {
		roll = v.roll;
		explode = v.flag;
	}

	v = extractFlag(roll, /h\d*/);
	if (v.flag) {
		roll = v.roll;
		highest = v.flag.substring(1);
	}

	v = extractFlag(roll, /l\d*/);
	if (v.flag) {
		roll = v.roll;
		lowest = Number(v.flag.substring(1));
	}

	return { dice: roll, explode, highest, lowest };
}

function extractFlag(roll, flag) {
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