const { increment } = require('./increment');
const { incrementorType } = require('./enums');

describe('increment', () => {
  test('should return error when options.type is not a valid type', () => {
    const { error, value } = increment({ type: 'wrong-type' }, 3);
    expect(value).toBeNull();
    expect(error).toEqual(new Error('Invalid type: wrong-type'));
  });

  test('should return error when options.leftPadLength is not a valid number', () => {
    const { error, value } = increment({
      type: incrementorType.INTEGER,
      leftPadLength: '4',
    }, 3);
    expect(value).toBeNull();
    expect(error).toEqual(new Error('options.leftPadLength has to be a number'));
  });

  describe(`type ${incrementorType.INTEGER}`, () => {
    test(`should return error when options.type is ${incrementorType.INTEGER} but the value passed in is not a number`, () => {
      const { error, value } = increment({ type: incrementorType.INTEGER }, '3');
      expect(value).toBeNull();
      expect(error).toEqual(new Error(`Value with options.type '${incrementorType.INTEGER}' must be of type 'number'`));
    });

    test(`should increment value by 1 when type is ${incrementorType.INTEGER}`, () => {
      const { error, value } = increment({ type: 'integer' }, 3);
      expect(error).toBeNull();
      expect(value).toBe(4);
    });
  });

  describe(`type ${incrementorType.NUMERIC}`, () => {
    test('should return an error when value passed in is not a numeric string', () => {
      const { error, value } = increment({ type: incrementorType.NUMERIC }, 'abc');
      expect(value).toBeNull();
      expect(error).toEqual(new Error('Value needs to be a numeric value represented as a string'));
    });

    test('should return an error when leftPadValue is not a numeric string', () => {
      const options = {
        type: incrementorType.NUMERIC,
        leftPadLength: 4,
        leftPadValue: 'aa',
      };

      const { error, value } = increment(options, '23');
      expect(value).toBeNull();
      expect(error).toEqual(new Error('options.leftPadValue must only have string representations of numbers'));
    });

    test('should increment the value by 1 with no left padding', () => {
      const { error, value } = increment({ type: incrementorType.NUMERIC }, '23');
      expect(error).toBeNull();
      expect(value).toBe('24');
    });

    test('should increment 23 by 1 and add the left padding of 3 => 3324', () => {
      const options = {
        type: incrementorType.NUMERIC,
        leftPadLength: 4,
        leftPadValue: '3',
      };

      const { error, value } = increment(options, '23');
      expect(error).toBeNull();
      expect(value).toBe('3324');
    });

    test('should increment 23 by 1 and add the default left padding of 0 => 0024', () => {
      const options = {
        type: incrementorType.NUMERIC,
        leftPadLength: 4,
      };

      const { error, value } = increment(options, '23');
      expect(error).toBeNull();
      expect(value).toBe('0024');
    });

    test('should increment the value by 1 and add the left padding length when the value has 0 as it\'s padding', () => {
      // NOTE: this test is true because the code will strip the value to 23, increment and
      //       then add the leftPadLength.  In the future, a flag could be passed in to preserve
      //       the original padding if that's a feature openly requested.
      const options = {
        type: incrementorType.NUMERIC,
        leftPadLength: 4,
        leftPadValue: '0',
      };

      const { error, value } = increment(options, '00023');
      expect(error).toBeNull();
      expect(value).toBe('0024');
    });

    test('should increment the value by 1 and not add the leftPadLength if the value length is greater than the leftPadLength value', () => {
      const options = {
        type: incrementorType.NUMERIC,
        leftPadLength: 4,
        leftPadValue: '0',
      };

      const { error, value } = increment(options, '11123');
      expect(error).toBeNull();
      expect(value).toBe('11124');
    });
  });

  describe(`type ${incrementorType.ALPHA}`, () => {
    test('should return an error when value passed in is not characters a-z or A-Z', () => {
      const { error, value } = increment({ type: incrementorType.ALPHA }, 'abc123');
      expect(value).toBeNull();
      expect(error).toEqual(new Error(`The value for type ${incrementorType.ALPHA} must only have characters between a-z and A-Z`));
    });

    test('should increment the value aa to ab', () => {
      const { error, value } = increment({ type: incrementorType.ALPHA }, 'aa');
      expect(error).toBeNull();
      expect(value).toBe('ab');
    });

    test('should increment the value az to aA', () => {
      const { error, value } = increment({ type: incrementorType.ALPHA }, 'az');
      expect(error).toBeNull();
      expect(value).toBe('aA');
    });

    test('should increment the value aZ to ba', () => {
      const { error, value } = increment({ type: incrementorType.ALPHA }, 'aZ');
      expect(error).toBeNull();
      expect(value).toBe('ba');
    });
  });
});
