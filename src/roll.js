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
		if (/^\d*d\d*!*$/.test(e)) {
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
	const explode = e.endsWith("!");
	e = e.replace("!", "");
	const [numOfDice, numOfSides] = e.split("d");
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

function sumArray(array) {
	return array.reduce((a, b) => a + b, 0);
}
