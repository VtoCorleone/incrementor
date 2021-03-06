const { incrementorType } = require('./enums');

/** Increment the given value
 *
 * @param {object} options - the options used by the incrementor
 * @param {incrementorType} options.type - what type of object is being incremented
 * @param {number} options.leftPadLength - set the amount of padding to the left of a numeric value
 * @param {number} options.leftPadValue - the character to set the padding with
 * @param {string | number} value - the value to be incremented
 * @returns {object} results
 * @returns {string | number} results.value - incremented value passed in
 * @returns {Error} results.error - error while trying to increment the value
 */
const increment = ({ type, leftPadLength, leftPadValue }, value) => {
  if (leftPadLength && typeof leftPadLength !== 'number') {
    return {
      value: null,
      error: new Error('options.leftPadLength has to be a number'),
    };
  }

  if (type === incrementorType.INTEGER) {
    if (typeof value !== 'number') {
      return {
        value: null,
        error: new Error('Value with options.type \'integer\' must be of type \'number\''),
      };
    }

    return {
      value: value + 1,
      error: null,
    };
  }

  if (type === incrementorType.NUMERIC) {
    const numberValidator = new RegExp('^[0-9]+$');

    if (!numberValidator.test(value)) {
      return {
        value: null,
        error: new Error('Value needs to be a numeric value represented as a string'),
      };
    }

    const num = Number.parseInt(value, 10);

    const incremented = `${num + 1}`;

    if (leftPadLength > 0) {
      const padValue = leftPadValue || '0';
      if (!numberValidator.test(`${padValue}`)) {
        return {
          error: new Error('options.leftPadValue must only have string representations of numbers'),
          value: null,
        };
      }

      if (incremented.length < leftPadLength) {
        return {
          value: incremented.padStart(leftPadLength, padValue),
          error: null,
        };
      }

      return {
        value: incremented,
        error: null,
      };
    }

    return {
      value: incremented,
      error: null,
    };
  }

  if (type === incrementorType.ALPHA) {
    // NOTE: validate that the value is an english alphabet character
    // TODO: pass in flag to handle other non-english characters
    if (!new RegExp('^[a-zA-Z]+$').test(value)) {
      return {
        error: new Error(`The value for type ${incrementorType.ALPHA} must only have characters between a-z and A-Z`),
        value: null,
      };
    }

    const { reversedCharacters } = value.split('').reverse().reduce((result, character) => {
      const accumulator = result;

      if (!accumulator.doesIncrement) {
        accumulator.reversedCharacters.push(character);
        return accumulator;
      }

      const code = character.charCodeAt(0);

      // if the value is 'z', increment it to 'A' and return
      if (code === 122) {
        const incrementedValue = String.fromCharCode(65);
        accumulator.reversedCharacters.push(incrementedValue);
        accumulator.doesIncrement = false;
        return accumulator;
      }

      // if the value is 'Z', increment it to 'a' and keep the
      // doesIncrement flag to true so that we "carry the 1"
      if (code === 90) {
        const incrementedValue = String.fromCharCode(97);
        accumulator.reversedCharacters.push(incrementedValue);
        return accumulator;
      }

      const incrementedValue = String.fromCharCode(code + 1);
      accumulator.reversedCharacters.push(incrementedValue);
      accumulator.doesIncrement = false;

      return accumulator;
    }, { reversedCharacters: [], doesIncrement: true });

    return {
      error: null,
      value: reversedCharacters.reverse().join(''),
    };
  }

  return {
    value: null,
    error: new Error(`Invalid type: ${type}`),
  };
};

module.exports = {
  increment,
};
