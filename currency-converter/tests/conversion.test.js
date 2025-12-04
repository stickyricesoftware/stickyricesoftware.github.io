// currency-converter/tests/conversion.test.js
// Basic unit tests for conversion logic

const { convertCurrency } = require('../script');

describe('Currency Conversion', () => {
  test('should convert correctly with valid rate', () => {
    expect(convertCurrency(100, 2)).toBe(200);
    expect(convertCurrency(50, 0.5)).toBe(25);
  });

  test('should handle zero and negative amounts', () => {
    expect(convertCurrency(0, 1.5)).toBe(0);
    expect(convertCurrency(-10, 2)).toBe(-20);
  });

  test('should handle edge cases', () => {
    expect(convertCurrency(1e10, 1)).toBe(1e10);
    expect(convertCurrency(1, 0)).toBe(0);
  });
});
