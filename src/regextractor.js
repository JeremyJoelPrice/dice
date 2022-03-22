module.exports = function extractRegexFromString(regex, string) {
	const match = string.match(regex);
	if (!match) {
		return { matches: [], string };
	}
	return { matches: [match[0]], string: string.replace(match[0], "") };
};
