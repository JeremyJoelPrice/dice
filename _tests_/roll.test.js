const roll = require("../src/roll");
const extractRegexFromString = require("../src/regextractor");

beforeEach(() => jest.spyOn(Math, "random").mockReturnValue(0.49999));
afterEach(() => jest.spyOn(Math, "random").mockRestore());

describe("Basic functionality", () => {
	describe("roll() relies on Math.random() for fair and even probabilities", () => {
		test("parses Math.random() results correctly, given a 4-sided dice", () => {
			jest.spyOn(Math, "random").mockReturnValue(0.000001);
			expect(roll("1d4").value).toBe(1);
			jest.spyOn(Math, "random").mockReturnValue(0.25);
			expect(roll("1d4").value).toBe(2);
			jest.spyOn(Math, "random").mockReturnValue(0.5);
			expect(roll("1d4").value).toBe(3);
			jest.spyOn(Math, "random").mockReturnValue(0.75);
			expect(roll("1d4").value).toBe(4);
			jest.spyOn(Math, "random").mockReturnValue(0.9999999);
			expect(roll("1d4").value).toBe(4);
		});
		test("parses Math.random() results correctly, given a 6-sided dice", () => {
			jest.spyOn(Math, "random").mockReturnValue(0.000001);
			expect(roll("1d6").value).toBe(1);
			jest.spyOn(Math, "random").mockReturnValue(0.17);
			expect(roll("1d6").value).toBe(2);
			jest.spyOn(Math, "random").mockReturnValue(0.34);
			expect(roll("1d6").value).toBe(3);
			jest.spyOn(Math, "random").mockReturnValue(0.5);
			expect(roll("1d6").value).toBe(4);
			jest.spyOn(Math, "random").mockReturnValue(0.67);
			expect(roll("1d6").value).toBe(5);
			jest.spyOn(Math, "random").mockReturnValue(0.84);
			expect(roll("1d6").value).toBe(6);
			jest.spyOn(Math, "random").mockReturnValue(0.9999999);
			expect(roll("1d6").value).toBe(6);
		});
	});
	describe("unmodified rolls with a single type of dice", () => {
		test("total is correct when rolling dice with fewer than 10 sides", () => {
			expect(roll("2d4").value).toBe(4);
			expect(roll("2d8").value).toBe(8);
		});
		test("total is correct when rolling dice with more than 10 sides", () => {
			expect(roll("3d10").value).toBe(15);
			expect(roll("3d100").value).toBe(150);
		});
	});
	describe("roll() single type of dice with simple addtion/subtraction modifiers", () => {
		describe("single modifier", () => {
			test("2d6+1", () => {
				expect(roll("2d6+1")).toMatchObject({
					roll: "2d6+1",
					faces: [3, 3],
					value: 7
				});
			});
			test("2d6+10", () => {
				expect(roll("2d6+10")).toMatchObject({
					roll: "2d6+10",
					faces: [3, 3],
					value: 16
				});
			});
			test("2d6-1", () => {
				expect(roll("2d6-1")).toMatchObject({
					roll: "2d6-1",
					faces: [3, 3],
					value: 5
				});
			});
			test("3d6-10", () => {
				expect(roll("3d6-10")).toMatchObject({
					roll: "3d6-10",
					faces: [3, 3, 3],
					value: -1
				});
			});
		});
		describe("multiple modifiers", () => {
			test("3d6+1-20", () => {
				expect(roll("3d6+1-20")).toMatchObject({
					roll: "3d6+1-20",
					faces: [3, 3, 3],
					value: -10
				});
			});
			test("3d6+1-2+3-4+5-6", () => {
				expect(roll("3d6+1-2+3-4+5-6")).toMatchObject({
					roll: "3d6+1-2+3-4+5-6",
					faces: [3, 3, 3],
					value: 6
				});
			});
		});
	});
});

describe("Advanced functionality", () => {
	describe("roll() exploding dice", () => {
		
	});
	// drop/keep highest/lost N
	// mix different types of dice together
});

describe("flexible syntax", () => {
	test("roll() defaults to rolling '1d6'", () => {
		expect(roll()).toMatchObject({
			roll: "1d6",
			faces: [3],
			value: 3
		});
	});
	test("roll(dn) rolls a single dice with 'n' sides", () => {
		expect(roll("d8")).toMatchObject({
			roll: "1d8",
			faces: [4],
			value: 4
		});
	});
	test("passing '%' is identitcal to passing '1d100'", () => {
		expect(roll("%")).toMatchObject({
			roll: "1d100",
			faces: [50],
			value: 50
		});
	});
	test("passing 'nd%' is identitcal to passing 'nd100'", () => {
		expect(roll("1d%")).toMatchObject({
			roll: "1d100",
			faces: [50],
			value: 50
		});
		expect(roll("2d%")).toMatchObject({
			roll: "2d100",
			faces: [50, 50],
			value: 100
		});
		expect(roll("10d%")).toMatchObject({
			roll: "10d100",
			faces: [50, 50, 50, 50, 50, 50, 50, 50, 50, 50],
			value: 500
		});
	});
	test("roll() ignores whitespace", () => {
		expect(roll(" 1 d 6 ")).toMatchObject({
			roll: "1d6",
			faces: [3],
			value: 3
		});
		expect(roll(" % ")).toMatchObject({
			roll: "1d100",
			faces: [50],
			value: 50
		});
	});
	describe("Accepts `explode` keyword, and explodes on a maximum value roll", () => {
		test("1d4 explodes", () => {
			const results = [0.5, 0.9, 0.5, 0.5];
			let index = 0;
			jest.spyOn(Math, "random").mockImplementation(() => results[index++]);
			expect(roll("explode 1d4")).toMatchObject({
				roll: "explode 1d4",
				faces: [3],
				value: 3
			});
			expect(roll("explode 1d4")).toMatchObject({
				roll: "explode 1d4",
				faces: [4, 3],
				value: 7
			});
			expect(roll("explode 1d4")).toMatchObject({
				roll: "explode 1d4",
				faces: [3],
				value: 3
			});
		});
		test("1d6 explodes", () => {
			const results = [0.49, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.82, 0.9, 0.01];
			let index = 0;
			jest.spyOn(Math, "random").mockImplementation(() => results[index++]);
			expect(roll("explode 1d6")).toMatchObject({
				roll: "explode 1d6",
				faces: [3],
				value: 3
			});
			expect(roll("explode 1d6")).toMatchObject({
				roll: "explode 1d6",
				faces: [6, 6, 6, 6, 6, 6, 5],
				value: 41
			});
			expect(roll("explode 1d6")).toMatchObject({
				roll: "explode 1d6",
				faces: [6, 1],
				value: 7
			});
		});
		test("2d8 explodes", () => {
			const results = [0.02, 0.6, 0.9, 0.01, 0.01, 0.8, 0.9, 0.9, 0.01];
			let index = 0;
			jest.spyOn(Math, "random").mockImplementation(() => results[index++]);
			expect(roll("explode 2d8")).toMatchObject({
				roll: "explode 2d8",
				faces: [1, 5],
				value: 6
			});
			expect(roll("explode 2d8")).toMatchObject({
				roll: "explode 2d8",
				faces: [8, 1, 1],
				value: 10
			});
			expect(roll("explode 2d8")).toMatchObject({
				roll: "explode 2d8",
				faces: [7, 8, 8, 1],
				value: 24
			});
		});
	});
});

describe("Utility functionality", () => {
	// invalid input
	describe("util functions", () => {
		describe("extractRegexFromString", () => {
			it("removes the pattern from the string, returning both", () => {
				const string = "applesbananasapples";
				const { matches, string: newString } = extractRegexFromString(
					/bananas/,
					string
				);
				expect(matches).toEqual(["bananas"]);
				expect(newString).toBe("applesapples");
			});
			it("removes only the first instance of the pattern from the string, returning both", () => {
				const string = "applesbananasapples";
				const { matches, string: newString } = extractRegexFromString(
					/apples/,
					string
				);
				expect(matches).toEqual(["apples"]);
				expect(newString).toBe("bananasapples");
			});
			it("returns entire string if no match is found", () => {
				const string = "applesbananas";
				const { matches, string: newString } = extractRegexFromString(
					/cheese/,
					string
				);
				expect(matches).toEqual([]);
				expect(newString).toBe(string);
			});
		});
	});
	// remember a roll for later
	// reroll the previous roll
});
