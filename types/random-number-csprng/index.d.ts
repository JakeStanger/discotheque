/// <reference types="random-number-csprng" />
declare module 'random-number-csprng' {
  export default function randomNumber(
    min: number,
    max: number
  ): Promise<number>;
}
