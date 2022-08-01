exports.createRollQueries = (maxNumOfSides = 6, maxNumOfDice = 1) => {
	const queries = [];
	for (let numOfSides = 2; numOfSides <= maxNumOfSides; numOfSides++) {
		for (let numOfDice = 1; numOfDice <= maxNumOfDice; numOfDice++) {
			queries.push(`${numOfDice}d${numOfSides}`);
		}
	}
	return queries;
};
