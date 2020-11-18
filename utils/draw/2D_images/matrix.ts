export function transition(width: number, height: number): Array<number> {
  return [
    2 / width, 0, 0,
    0, 2 / height, 0,
    -1, -1, 1
  ];
}