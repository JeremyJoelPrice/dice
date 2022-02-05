const roll = require("../src/index");

afterEach(() => {
	jest.spyOn(Math, "random").mockRestore();
});

describe("basic funciontality", () => {
	describe("roll() returns an object with the correct keys and values", () => {
		test("roll() interprets Math.random() results correctly, given a 4-sided dice", () => {
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
		test("roll() interprets Math.random() results correctly, given a 6-sided dice", () => {
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
			function getAscendingNumbers() {
				let result = 0;
				return () => {
                    result += 0.16;
                    return result;
                };
			}
			jest.spyOn(Math, "random").mockImplementation(getAscendingNumbers());
			expect(roll("3d6").faces).toEqual([1, 2, 3]);
		});
	});
	describe("Invoke roll() for any number of dice with N sides", () => {
		// returns the correct string for roll key
		// returns the correct faces, checked by mocking Math.random()
		// returns the correct total, checked by mocking Math.random()
	});
    // invalid argument handling
	describe("Default behaviours", () => {
		test("roll() defaults to rolling '1d6'", () => {
			expect(roll().roll).toBe("1d6");
		});
	});
	// add modifiers to the roll
});

// mix different types of dice together
// drop/keep highest/lost N
// exloding dice

// advanced functionality
// remember a roll for later
// reroll the previous roll
