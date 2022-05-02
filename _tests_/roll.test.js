const roll = require("../src/roll");

beforeEach(() => jest.spyOn(Math, "random").mockReturnValue(0.49999));
afterEach(() => jest.spyOn(Math, "random").mockRestore());

describe("Basic functionality", () => {
	test("roll() returns an object with the correct properties", () => {
		expect(roll()).toMatchObject({
			roll: expect.any(String),
			faces: expect.any(Array),
			value: expect.any(Number)
		});
	})
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
	describe("mixing multiple types of dice together", () => {
		test("3d6+1d20", () => {
			expect(roll("3d6+1d20")).toMatchObject({
				roll: "3d6+1d20",
				faces: [3, 3, 3, 10],
				value: 19
			});
		});
		test("3d6+5-1d20", () => {
			expect(roll("3d6+5-1d20")).toMatchObject({
				roll: "3d6+5-1d20",
				faces: [3, 3, 3, 10],
				value: 4
			});
		});
	});
});

describe("Advanced functionality", () => {
	describe("roll() exploding dice", () => {
		test("1d4!", () => {
			const results = [0.5, 0.9, 0.5, 0.5];
			let index = 0;
			jest.spyOn(Math, "random").mockImplementation(() => results[index++]);
			expect(roll("1d4!")).toMatchObject({
				roll: "1d4!",
				faces: [3],
				value: 3
			});
			expect(roll("1d4!")).toMatchObject({
				roll: "1d4!",
				faces: [4, 3],
				value: 7
			});
			expect(roll("1d4!")).toMatchObject({
				roll: "1d4!",
				faces: [3],
				value: 3
			});
		});
		test("1d6!", () => {
			const results = [0.49, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.82, 0.9, 0.01];
			let index = 0;
			jest.spyOn(Math, "random").mockImplementation(() => results[index++]);
			expect(roll("1d6!")).toMatchObject({
				roll: "1d6!",
				faces: [3],
				value: 3
			});
			expect(roll("1d6!")).toMatchObject({
				roll: "1d6!",
				faces: [6, 6, 6, 6, 6, 6, 5],
				value: 41
			});
			expect(roll("1d6!")).toMatchObject({
				roll: "1d6!",
				faces: [6, 1],
				value: 7
			});
		});
		test("2d8!", () => {
			const results = [0.02, 0.6, 0.9, 0.01, 0.01, 0.8, 0.9, 0.9, 0.01];
			let index = 0;
			jest.spyOn(Math, "random").mockImplementation(() => results[index++]);
			expect(roll("2d8!")).toMatchObject({
				roll: "2d8!",
				faces: [1, 5],
				value: 6
			});
			expect(roll("2d8!")).toMatchObject({
				roll: "2d8!",
				faces: [8, 1, 1],
				value: 10
			});
			expect(roll("2d8!")).toMatchObject({
				roll: "2d8!",
				faces: [7, 8, 8, 1],
				value: 24
			});
		});
	});
	describe("keep highest N results", () => {
		beforeEach(() => jest.spyOn(Math, "random").mockReturnValueOnce(0.99).mockReturnValueOnce(0.49).mockReturnValue(0.01));
		test("2d6h1", () => {
			expect(roll("2d6h1")).toMatchObject({
				roll: "2d6h1",
				faces: [6],
				value: 6
			});
		});
		test("3d6h2", () => {
			expect(roll("3d6h2")).toMatchObject({
				roll: "3d6h2",
				faces: [6, 3],
				value: 9
			});
		});
		test("2d6h0", () => {
			expect(roll("2d6h0")).toMatchObject({
				roll: "2d6h0",
				faces: [],
				value: 0
			});
		});
		test("2d6h2", () => {
			expect(roll("2d6h2")).toMatchObject({
				roll: "2d6h2",
				faces: [6, 3],
				value: 9
			});
		});
		test("2d6h12", () => {
			expect(roll("2d6h12")).toMatchObject({
				roll: "2d6h12",
				faces: [6, 3],
				value: 9
			});
		});
	});
	// describe("keep lowest N results");
	// remember a roll for later
	// reroll the previous roll
	// Fudge dice
});

describe("flexible syntax", () => {
	test("ignores whitespace", () => {
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
	test("case insensitive", () => {
		expect(roll("1D6")).toMatchObject({
			roll: "1d6",
			faces: [3],
			value: 3
		});
	});
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
	describe("Accepts `explode` keyword instead of `!`", () => {
		test("explode 1d4", () => {
			const results = [0.5, 0.9, 0.5, 0.5];
			let index = 0;
			jest.spyOn(Math, "random").mockImplementation(() => results[index++]);
			expect(roll("explode 1d4")).toMatchObject({
				roll: "1d4!",
				faces: [3],
				value: 3
			});
			expect(roll("explode 1d4 + 5")).toMatchObject({
				roll: "1d4!+5",
				faces: [4, 3],
				value: 12
			});
			expect(roll("5 + explode 1d4")).toMatchObject({
				roll: "5+1d4!",
				faces: [3],
				value: 8
			});
		});
	});
	// 2d6h3 === h3 of 2d6
	// `h` and `highest` are interchangeable
});
