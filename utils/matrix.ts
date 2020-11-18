import { reduceDimension } from "./tool"
import { Array2D } from "./type"

export let Matrix: any = function (this: any, matrix: Array2D<number>) {
  this.__value = matrix;
}

Matrix.of = function (matrix: Array2D<number>) { return new Matrix(matrix) }

Matrix.prototype.multiply = function (matrix: Array2D<number>): Array2D<number> {
  var c = new Array(matrix.length);
  for (var i = 0; i < this.__value.length; i++) {
    c[i] = new Array(matrix[0].length);
    for (var j = 0; j < matrix[0].length; j++) {
      c[i][j] = 0;
      for (var k = 0; k < matrix.length; k++) {
        c[i][j] += this.__value[i][k] * matrix[k][j];
      }
    }
  }
  return Matrix.of(c)
}

Matrix.prototype.value = function () {
  return reduceDimension(this.__value)
}