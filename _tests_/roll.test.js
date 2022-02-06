const roll = require("../src/index");

beforeEach(() => jest.spyOn(Math, "random").mockReturnValue(0.49));
afterEach(() => jest.spyOn(Math, "random").mockRestore());

describe("roll() unmodified rolls with a single type of dice", () => {
	describe("returns an object with the correct keys and values", () => {
		test("roll key's value is the argument given", () => {
			expect(roll("1d6").roll).toBe("1d6");
			expect(roll("2d6").roll).toBe("2d6");
			expect(roll("1d8").roll).toBe("1d8");
		});
		test("total key's value is correct", () => {
			jest.spyOn(Math, "random").mockReturnValue(0.0000001);
			expect(roll("2d6").total).toBe(2);
			expect(roll("3d6").total).toBe(3);

			jest.spyOn(Math, "random").mockReturnValue(0.9999999);
			expect(roll("2d6").total).toBe(12);
			expect(roll("3d6").total).toBe(18);
		});
		test("faces key has correct value", () => {
			expect(roll("3d6").faces).toEqual([3, 3, 3]);
		});
	});
	describe("roll() relies on Math.random() for fair and even probabilities", () => {
		test("parses Math.random() results correctly, given a 4-sided dice", () => {
			jest.spyOn(Math, "random").mockReturnValue(0.000001);
			expect(roll("1d4").total).toBe(1);
			jest.spyOn(Math, "random").mockReturnValue(0.25);
			expect(roll("1d4").total).toBe(2);
			jest.spyOn(Math, "random").mockReturnValue(0.5);
			expect(roll("1d4").total).toBe(3);
			jest.spyOn(Math, "random").mockReturnValue(0.75);
			expect(roll("1d4").total).toBe(4);
			jest.spyOn(Math, "random").mockReturnValue(0.9999999);
			expect(roll("1d4").total).toBe(4);
		});
		test("parses Math.random() results correctly, given a 6-sided dice", () => {
			jest.spyOn(Math, "random").mockReturnValue(0.000001);
			expect(roll("1d6").total).toBe(1);
			jest.spyOn(Math, "random").mockReturnValue(0.17);
			expect(roll("1d6").total).toBe(2);
			jest.spyOn(Math, "random").mockReturnValue(0.34);
			expect(roll("1d6").total).toBe(3);
			jest.spyOn(Math, "random").mockReturnValue(0.5);
			expect(roll("1d6").total).toBe(4);
			jest.spyOn(Math, "random").mockReturnValue(0.67);
			expect(roll("1d6").total).toBe(5);
			jest.spyOn(Math, "random").mockReturnValue(0.84);
			expect(roll("1d6").total).toBe(6);
			jest.spyOn(Math, "random").mockReturnValue(0.9999999);
			expect(roll("1d6").total).toBe(6);
		});
	});
	describe("parses any number of dice with any number of sides", () => {
		test("total is correct when rolling dice with fewer than 10 sides", () => {
			expect(roll("2d4").total).toBe(4);
			expect(roll("2d8").total).toBe(8);
		});
		test("total is correct when rolling dice with more than 10 sides", () => {
			expect(roll("3d10").total).toBe(15);
			expect(roll("3d100").total).toBe(150);
		});
	});
	describe("inavlid input handling", () => {
		test("returns undefined if input isn't valid", () => {
			expect(roll("1dP")).toBe(undefined);
			expect(roll("Pd6")).toBe(undefined);
			expect(roll("Pd%")).toBe(undefined);
			expect(roll("1d6d")).toBe(undefined);
			expect(roll("1dd6")).toBe(undefined);
		});
	});
});

describe("roll() single type of dice with simple addtion/subtraction modifiers", () => {
	test("2d6+1", () => {
		expect(roll("2d6+1")).toMatchObject({
			roll: "2d6+1",
			faces: [3, 3],
			total: 7
		});
	});
	test("2d6+10", () => {
		expect(roll("2d6+10")).toMatchObject({
			roll: "2d6+10",
			faces: [3, 3],
			total: 16
		});
	});
	test("2d6-1", () => {
		expect(roll("2d6-1")).toMatchObject({
			roll: "2d6-1",
			faces: [3, 3],
			total: 5
		});
	});
	test("3d6-10", () => {
		expect(roll("3d6-10")).toMatchObject({
			roll: "3d6-10",
			faces: [3, 3, 3],
			total: -1
		});
	});
	test("3d6+1-20", () => {
		expect(roll("3d6+1-20")).toMatchObject({
			roll: "3d6+1-20",
			faces: [3, 3, 3],
			total: -10
		});
	});
	test("3d6+ -1", () => {
		expect(roll("3d6+ -1")).toMatchObject({
			roll: "3d6+ -1",
			faces: [3, 3, 3],
			total: 8
		});
	});
});

// drop/keep highest/lost N
// exloding dice
// mix different types of dice together

// advanced functionality
// remember a roll for later
// reroll the previous roll

describe("default & shorthand behaviours", () => {
	test("roll() defaults to rolling '1d6'", () => {
		expect(roll()).toMatchObject({
			roll: "1d6",
			faces: [3],
			total: 3
		});
	});
	test("roll(dn) rolls a single dice with 'n' sides", () => {
		expect(roll("d8")).toMatchObject({
			roll: "1d8",
			faces: [4],
			total: 4
		});
	});
	test("passing '%' is identitcal to passing '1d100'", () => {
		expect(roll("%")).toMatchObject({
			roll: "1d100",
			faces: [50],
			total: 50
		});
	});
	test("passing 'nd%' is identitcal to passing 'nd100'", () => {
		expect(roll("1d%")).toMatchObject({
			roll: "1d100",
			faces: [50],
			total: 50
		});
		expect(roll("2d%")).toMatchObject({
			roll: "2d100",
			faces: [50, 50],
			total: 100
		});
		expect(roll("10d%")).toMatchObject({
			roll: "10d100",
			faces: [50, 50, 50, 50, 50, 50, 50, 50, 50, 50],
			total: 500
		});
	});
	test("roll() ignores whitespace", () => {
		expect(roll(" 1 d 6 ")).toMatchObject({
			roll: "1d6",
			faces: [3],
			total: 3
		});
		expect(roll(" % ")).toMatchObject({
			roll: "1d100",
			faces: [50],
			total: 50
		});
	});
});
