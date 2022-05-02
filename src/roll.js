const { dropLowestNInArray, sumArray } = require("./utils");

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
		if (/^\d*d\d*!*(h\d*)*$/.test(e)) {
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

function getFaces(e) {
	let explode;
	let highest;

	// exploding
	if (e.includes("!")) {
		explode = e.includes("!");
		e = e.replace("!", "");
	}

	// highest
	if (e.includes("h")) {
		highest = Number(e.match(/h\d*/)[0].substring(1));
		e = e.substring(0, e.indexOf("h"));
	}

	const [numOfDice, numOfSides] = e.split("d");
	let faces = [];

	for (let i = 0; i < numOfDice; i++) {
		let result;
		do {
			result = Math.floor(Math.random() * numOfSides + 1);
			faces.push(result);
		} while (explode && result == numOfSides);
	}

	if (highest !== undefined) {
		const drop = faces.length - highest;
		if (drop >= faces.length) {
			faces = [];
		}
		else if (drop < faces.length && drop > 0) faces = dropLowestNInArray(faces, drop);
	}
	return faces;
}