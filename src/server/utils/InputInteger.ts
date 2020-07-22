export function isInputInteger(
  num: number | string | InputInteger
): num is InputInteger {
  return (num as InputInteger)?.value !== undefined;
}

/**
 * Integer wrapper for form inputs.
 * Allows for negative numbers to be inputted
 * while retaining the correct type.
 */
class InputInteger {
  private _number!: number | string;

  constructor(num: number | string | InputInteger) {
    this.value = isInputInteger(num) ? num.value : num;
  }

  public get value() {
    return this._number;
  }

  public set value(num) {
    if (typeof num === 'string') {
      if (num.length === 0 || num === '-') {
        this._number = num;
      } else {
        this._number = parseInt(num);
      }
    } else {
      this._number = num;
    }
  }

  public asNumber() {
    return typeof this._number === 'string'
      ? parseInt(this._number)
      : this._number;
  }

  public asString() {
    return this._number.toString();
  }

  public lt(other: number | string | InputInteger): boolean {
    const otherValue =
      typeof other === 'number'
        ? other
        : typeof other === 'string'
        ? other
        : other.value;

    if (typeof this.value === 'string' || typeof otherValue === 'string') {
      return false;
    }

    return this.value < otherValue;
  }

  public gt(other: number | string | InputInteger): boolean {
    const otherValue =
      typeof other === 'number'
        ? other
        : typeof other === 'string'
        ? other
        : other.value;

    if (typeof this.value === 'string' || typeof otherValue === 'string') {
      return false;
    }

    return this.value > otherValue;
  }
}

export default InputInteger;
