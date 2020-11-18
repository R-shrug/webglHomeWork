import { Canvas } from "../../canvas"
import { createProgram, loadShader, createUniformSetters, createAttributeSetters } from "../../WebGlUtils"
import { transformRgba, reduceDimension, mapping } from "../../tool"
import { vec3 } from "../../type"
import { makeScale, makeTranslation, makeXRotation, makeYRotation, makeZRotation, makeZToWMatrix, transition } from "./matrix"
import { Matrix } from "../../matrix"
declare module "../../canvas" {
  interface Canvas {
    /**
     * 绘制三维模型
     * @param points 顶点位置
     * @param color 颜色，
     * e.g. cyan [0,255,255,1] or rgb(0,255,255) or #00FFFF 
     * @param mode fill：充满，hollow：镂空
     * @param primitiveType
     */
    draw3Dmodels(
      points: Array<vec3>,
      color: string | number[],
      mode: "fill" | "hollow",
      translation?: vec3,
      rotation?: vec3,
      scale?: vec3,
      fudgeFactor?: number,
      primitiveType?: number
    ): never;
  }
}
Object.assign(Canvas.prototype, {
  draw3Dmodels(
    this: Canvas,
    points: Array<vec3>,
    color: string | number[],
    mode: "fill" | "hollow",
    translation: vec3 = [0, 0, 0],
    rotation: vec3 = [0, 0, 0],
    scale: vec3 = [1, 1, 1],
    fudgeFactor: number = 1.0,
    primitiveType: number
  ) {
    let { gl } = this

    let vertexShaderSource = `
    attribute vec4 a_position;
    uniform mat4 u_matrix;
    void main() {
      gl_Position = u_matrix * a_position;
    }
    `
    let fragmentShaderSource = `
    precision mediump float;
    uniform vec4 u_color;
    void main() {
      gl_FragColor = u_color;
    }
    `
    let program = createProgram(gl, [
      loadShader(gl, vertexShaderSource, gl.VERTEX_SHADER),
      loadShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER)
    ])

    gl.useProgram(program)

    let uniforms = createUniformSetters(gl, program)

    let attributes = createAttributeSetters(gl, program)

    let positionBuffer = gl.createBuffer()!

    attributes.a_position({ size: 3, buffer: positionBuffer })
    uniforms.u_color(transformRgba(color))
    console.log(Matrix.of(
      makeZToWMatrix(0)
    ).multiply(
      makeTranslation(...translation)
    )
      .multiply(
        makeXRotation(rotation[0])
      ).multiply(
        makeYRotation(rotation[1])
      ).multiply(
        makeZRotation(rotation[2])
      ).multiply(
        makeScale(...scale)
      ).multiply(
        transition(...this.size)
      ).value())
    uniforms.u_matrix(
      Matrix.of(
        makeZToWMatrix(0)
      ).multiply(
        makeTranslation(...translation)
      )
        .multiply(
          makeXRotation(rotation[0])
        ).multiply(
          makeYRotation(rotation[1])
        ).multiply(
          makeZRotation(rotation[2])
        ).multiply(
          makeScale(...scale)
        ).multiply(
          transition(...this.size)
        ).value())
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    let positions = new Float32Array(reduceDimension(points))
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
    primitiveType = primitiveType ? primitiveType :
      (mode === 'fill' ? gl.TRIANGLES : gl.LINE_LOOP);
    let offset = 0;
    let count = reduceDimension(points).length / 3;
    gl.drawArrays(primitiveType, offset, count);
  },
})
