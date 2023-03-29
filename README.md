# Dice

This package provides the user with a `roll` function.
Passing this function a string such as `roll(1d6+3)` returns an object with three properties:

- The `roll` property is a string describing the roll, though the syntax may be adjusted, such as replacing `%` with `100`.
- The `faces` property lists the result of each individual die, in the order they appear in the `roll` string.
- The `value` property is the final result of your roll, after all dice and modifiers have been accounted for.

## Syntax
I wanted syntax to be forgiving, so after the standard syntax I'll list a number of options you have for flexibility.
Dice are described as `ndn`, where `n` is any integer. The number before the `d` is the number of dice, the number after `d` is the number of sides each of those dice have.

Numbers are entered normally, so `1d6+2` rolls 1 six-sided dice and adds the number `2` to the result.
Exploding dice are described with a `!` following the dice, as in `1d6!`. This must come before any modifier, hence `1d6!+2` would work, but `1d6+!2` would throw an error.

### Flexibilities
- All whitespace is ignored.
- If you are only rolling 1 die, you can leave off the 1, so `d6` is equivalent to `1d6`.
- If you are rolling 6 sided dice, you likewise can omit the last number; `2d` is equivalent to `2d6`.
`%` it equivalent to `1d100`.
- Exploding dice can be prefixed with the word `exploding`, which is case-insensitive. So `exploding 1d6` is equivalent to `1d6!`.