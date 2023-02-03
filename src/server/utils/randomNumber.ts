/*
 * generate a random number between 0 and 10000
 */
export default function randomNumber(max: number) {
  return Math.floor(Math.random() * max);
}
