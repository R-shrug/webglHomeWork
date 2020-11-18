import { Array2D } from "../../type"
import { degToRad } from "../../tool"
export function transition(width: number, height: number): Array2D<number> {
  return [
    [2 / width, 0, 0, 0],
    [0, 2 / height, 0, 0],
    [0, 0, 0, 0],
    [-1, -1, 0, 1]
  ];
}

export function makeTranslation(tx: number, ty: number, tz: number): Array2D<number> {
  return [
    [1, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 1, 0],
    [tx, ty, tz, 1]
  ];
}

export function makeXRotation(angle: number): Array2D<number> {
  let radian = degToRad(angle)
  var c = Math.cos(radian);
  var s = Math.sin(radian);

  return [
    [1, 0, 0, 0],
    [0, c, s, 0],
    [0, -s, c, 0],
    [0, 0, 0, 1]
  ];
};

export function makeYRotation(angle: number): Array2D<number> {
  let radian = degToRad(angle)
  var c = Math.cos(radian);
  var s = Math.sin(radian);

  return [
    [c, 0, -s, 0],
    [0, 1, 0, 0],
    [s, 0, c, 0],
    [0, 0, 0, 1]
  ];
};

export function makeZRotation(angle: number): Array2D<number> {
  let radian = degToRad(angle)
  var c = Math.cos(radian);
  var s = Math.sin(radian);

  return [
    [c, s, 0, 0],
    [-s, c, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1],
  ];
}

export function makeScale(sx: number, sy: number, sz: number): Array2D<number> {
  return [
    [sx, 0, 0, 0],
    [0, sy, 0, 0],
    [0, 0, sz, 0],
    [0, 0, 0, 1],
  ];
}

export function makeZToWMatrix(fudgeFactor: number): Array2D<number> {
  return [
    [1, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 1, fudgeFactor],
    [0, 0, 0, 1],
  ];
}