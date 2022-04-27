module.exports = (roll = "1d6") => {
	roll = tightenSyntax(roll);

	let faces = [];
	let value = 0;

	//split the roll into an array
	const rollArray = rollToArray(roll);

	function resovleRollArray(array, operator = "+") {
		if (array.length === 0) return;

		let e = array[0];
		// is it a number?
		if (/^\d+$/.test(e)) {
			value += (operator === "+") ? Number(e) : -Number(e);
		}
		// is it a dice roll, possibly exploding?
		if (/^\d*d\d*!*$/.test(e)) {
			const exploding = e.endsWith("!");
			e = e.replace("!", "");
			const f = getFaces(e.split("d")[0], e.split("d")[1], exploding);
			value += (operator === "+") ? sumArray(f) : -sumArray(f);
			faces = faces.concat(f);
		}
		// is it an operator?
		if (/(\+|-)/.test(e)) {
			operator = e;
		}
		// uses 'explode' keyword instead of `!`?
		// if (e.startsWith("explode")) {
		// 	array.shift();
		// 	array.unshift(e.replace("explode", "") + "!");
		// 	return resovleRollArray(array, operator);
		// }

		return resovleRollArray(array.slice(1), operator);
	}

	resovleRollArray(rollArray);

	return { roll, faces, value }
}

function tightenSyntax(roll) {
	roll = roll.toLowerCase();
	roll = roll.replace(/\s/g, "");
	roll = roll.replace("%", "100");
	roll = replaceExplode(roll);

	if (roll.match(/^d[0-9]+$/)) roll = `1${roll}`;
	if (roll.match(/^[0-9]+$/)) roll = `1d${roll}`;

	return roll;
}

function rollToArray(roll) {
	return roll.split(/(\+|-)/);
}

function sumArray(array) {
	return array.reduce((a, b) => a + b, 0);
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

function replaceExplode(roll) {
	while (roll.includes("explode")) {
		// remove explode and isolate the roll segment which contained it
		roll = roll.split("explode");

		// find the first operator, the only thing which divides expressions with a roll string
		const bangIndex = roll[1].match(/(\+|-)/) ? roll[1].match(/(\+|-)/).index : roll[1].length;

		// stich it back together with a '!' inserted before the first available operator after the first explode
		roll = roll[0] + roll[1].substring(0, bangIndex) + "!" + roll[1].substring(bangIndex);
	}

	return roll;
}


//--------------------------------------------------\\
/*
This function takes a roll string, like "1d6+3,
and returns an array of expressions, like ["1d6", 3]
*/
function parseRollString(rollString) {
	const elements = rollToArray(rollString);
	const expressions = []


	return expressions;
}

const oldRoll = (roll = "1d6") => {
	try {
		roll = tightenSyntax(roll);

		let { dice, explode, modifiers = [] } = extractRollElements(roll);

		// Handle dice
		const faces = getFaces(dice.split("d")[0], dice.split("d")[1], explode);

		// Handle modifiers
		modifiers = splitModifiers(modifiers);

		// Compute and return
		const value = getValue(faces, modifiers);

		return { roll, faces, value };
	} catch (error) {
		return;
	}
};

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



function getValue(faces, modifiers) {
	let value = 0;
	faces.forEach((face) => (value += face));
	modifiers.forEach((modifier) => (value += Number(modifier)));
	return value;
}