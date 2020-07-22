import InputInteger from './InputInteger';

interface IMinMaxOptions {
  upperBound?: number;
  lowerBound?: number;
}

/**
 * Immutable minimum/maximum value wrapper
 * for input forms.
 *
 * Automatically bounds minimum and maximum values
 * to each other.
 */
class MinMax {
  private readonly _min: InputInteger;
  private readonly _max: InputInteger;
  private readonly options: IMinMaxOptions | undefined;

  constructor(
    min: string | number | InputInteger,
    max: string | number | InputInteger,
    options?: IMinMaxOptions
  ) {
    this._min = new InputInteger(min);
    this._max = new InputInteger(max);
    this.options = options;
  }

  public get min(): string | number {
    return this._min.value;
  }

  public get max(): string | number {
    return this._max.value;
  }

  public set(min: number, max: number) {
    return new MinMax(min, max, this.options);
  }

  public setMin(min: string | number) {
    if (
      this.options?.lowerBound !== undefined &&
      min < this.options.lowerBound
    ) {
      min = this.options.lowerBound;
    }

    let max = this._max;
    if (max.lt(new InputInteger(min))) {
      max = new InputInteger(min);
    }
    return new MinMax(min, max, this.options);
  }

  public setMax(max: string | number) {
    if (
      this.options?.upperBound !== undefined &&
      max > this.options.upperBound
    ) {
      max = this.options.upperBound;
    }

    let min = this._min;
    if (min.gt(new InputInteger(max))) {
      min = new InputInteger(max);
    }
    return new MinMax(min, max, this.options);
  }
}

export default MinMax;
