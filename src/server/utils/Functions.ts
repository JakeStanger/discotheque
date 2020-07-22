import randomNumber from 'random-number-csprng';

export async function rng(min: number, max: number) {
  if (min > max) {
    const temp = max;
    max = min;
    min = temp;
  }

  if (min === max) {
    return min;
  }

  return randomNumber(min, max);
}

export async function randomEnum<T>(anEnum: T): Promise<T[keyof T]> {
  const enumValues = (Object.keys(anEnum)
    .map(n => Number.parseInt(n))
    .filter(n => !Number.isNaN(n)) as unknown) as T[keyof T][];
  const randomIndex = Math.floor(await randomNumber(0, enumValues.length - 1));
  return enumValues[randomIndex];
}

export async function randomElement<T>(array: T[]): Promise<T> {
  if (array.length - 1 === 0) return array[0];
  return array[Math.floor(await randomNumber(0, array.length - 1))];
}
