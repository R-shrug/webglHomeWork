import { Canvas } from "../canvas"
import { createProgram, loadShader, createUniformSetters, createAttributeSetters } from "../WebGlUtils"
import { transformRgba, reduceDimension, mapping } from "../tool"


declare module "../canvas" {
  interface Canvas {
    /**
     * 绘制二维图形
     * @param points 顶点位置
     * @param color 颜色，
     * e.g. cyan [0,255,255,1] or rgb(0,255,255) or #00FFFF 
     * @param mode fill：充满，hollow：镂空
     */
    draw2Dimages(
      points: Array<[number, number]>,
      color: string | number[],
      mode: "fill" | "hollow"
    ): never;
    /**
     * 绘制三角形
     * @param points 顶点位置
     * @param color 颜色，
     * e.g. cyan [0,255,255,1] or rgb(0,255,255) or #00FFFF 
     * @param mode fill：充满，hollow：镂空
     */
    drawTriangle(
      points: Array<[number, number]>,
      color: string | number[],
      mode: "fill" | "hollow"
    ): never;
    /**
     * 绘制扇形
     * @param center 圆心位置
     * @param radius 半径长度
     * @param startRadian 起始弧度
     * @param totalRadian 总弧度
     * @param color 颜色，
     * e.g. cyan [0,255,255,1] or rgb(0,255,255) or #00FFFF 
     * @param mode fill：充满，hollow：镂空
     */
    drawSector(
      center: [number, number],
      radius: number,
      startRadian: number,
      totalRadian: number,
      color: string | number[],
      mode: "fill" | "hollow"
    ): never
    /**
     * 绘制弧线
     * @param center 圆心位置
     * @param radius 半径长度
     * @param startRadian 起始弧度
     * @param totalRadian 总弧度
     * @param color 颜色，
     * e.g. cyan [0,255,255,1] or rgb(0,255,255) or #00FFFF 
     * @param mode fill：充满，hollow：镂空
     */
    drawArc(
      center: [number, number],
      radius: number,
      startRadian: number,
      totalRadian: number,
      color: string | number[],
      mode: "fill" | "hollow"
    ): never
    /**
     * 绘制圆形
     * @param center 圆心位置
     * @param radius 半径长度
     * @param color 颜色，
     * e.g. cyan [0,255,255,1] or rgb(0,255,255) or #00FFFF 
     * @param mode fill：充满，hollow：镂空
     */
    drawCircle(
      center: [number, number],
      radius: number,
      color: string | number[],
      mode: "fill" | "hollow"
    ): never;
    /**
     * 绘制矩形
     * @param lowerLeft 左下
     * @param lowerRight 右下
     * @param upperRight 右上
     * @param upperLeft 左上
     * @param color 颜色，
     * e.g. cyan [0,255,255,1] or rgb(0,255,255) or #00FFFF  
     * @param mode fill：充满，hollow：镂空
     */
    drawRectangle(
      lowerLeft: [number, number],
      lowerRight: [number, number],
      upperRight: [number, number],
      upperLeft: [number, number],
      color: string | number[],
      mode: "fill" | "hollow"
    ): never
  }
}

Object.assign(Canvas.prototype, {
  draw2Dimages(
    this: Canvas,
    points: Array<[number, number]>,
    color: string | number[],
    mode: "fill" | "hollow"
  ) {
    let { gl } = this

    let vertexShaderSource = `
    attribute vec4 a_position;

    void main() {
        gl_Position = a_position;
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

    attributes.a_position({ size: 2, buffer: positionBuffer })

    uniforms.u_resolution(this.size)

    uniforms.u_color(transformRgba(color))

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    let positions = new Float32Array(reduceDimension(mapping(this.size, points)))

    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    let primitiveType = mode === 'fill' ? gl.TRIANGLE_FAN : gl.LINE_STRIP;
    let offset = 0;
    let count = reduceDimension(points).length / 2;
    gl.drawArrays(primitiveType, offset, count);
  },
  drawTriangle(
    this: Canvas,
    points: Array<[number, number]>,
    color: string | number[],
    mode: "fill" | "hollow"
  ) {
    // this.draw2Dimages(points.concat([points[0]]), color, mode)
    let { gl } = this

    let vertexShaderSource = `
    attribute vec4 a_position;

    void main() {
        gl_Position = a_position;
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

    attributes.a_position({ size: 2, buffer: positionBuffer })

    uniforms.u_color(transformRgba(color))

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    let positions = new Float32Array(reduceDimension(mapping(this.size, points)))
    console.log(this.size,points[0],mapping(this.size, points)[0])
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    let primitiveType = mode === 'fill' ? gl.TRIANGLE_FAN : gl.LINE_LOOP;
    let offset = 0;
    let count = reduceDimension(points).length / 2;
    gl.drawArrays(primitiveType, offset, count);
  },
  drawArc(this: Canvas,
    center: [number, number],
    radius: number,
    startRadian: number,
    totalRadian: number,
    color: string | number[],
    mode: "fill" | "hollow") {
    let points: Array<[number, number]>
    points = mode === 'fill' ? [center] : []
    const times = 100 * Math.PI * 2 / totalRadian

    for (let i = 0; i <= times; i++) {
      points.push([
        center[0] + radius * Math.cos(totalRadian * i / times + startRadian),
        center[1] + radius * Math.sin(totalRadian * i / times + startRadian)])
    }
    this.draw2Dimages(points, color, mode)
  },
  drawSector(
    this: Canvas,
    center: [number, number],
    radius: number,
    startRadian: number,
    totalRadian: number,
    color: string | number[],
    mode: "fill" | "hollow"
  ) {
    let points: Array<[number, number]>
    points = mode === 'fill' ? [center] : []
    const times = 100 * Math.PI * 2 / totalRadian

    for (let i = 0; i <= times; i++) {
      points.push([
        center[0] + radius * Math.cos(totalRadian * i / times + startRadian),
        center[1] + radius * Math.sin(totalRadian * i / times + startRadian)])
    }
    this.drawTriangle(points, color, mode)
  },
  drawCircle(
    this: Canvas,
    center: [number, number],
    radius: number,
    color: string | number[],
    mode: "fill" | "hollow"
  ) {
    // let points: Array<[number, number]>
    // points = mode === 'fill' ? [center] : []
    // const times = 100

    // for (let i = 0; i <= times; i++) {
    //   points.push([
    //     center[0] + radius * Math.cos(2 * Math.PI * i / times),
    //     center[1] + radius * Math.sin(2 * Math.PI * i / times)])
    // }
    // this.drawTriangle(points, color, mode)
    this.drawSector(center, radius, 0, Math.PI * 2, color, mode)
  },
  drawRectangle(
    this: Canvas,
    lowerLeft: [number, number],
    lowerRight: [number, number],
    upperRight: [number, number],
    upperLeft: [number, number],
    color: string | number[],
    mode: "fill" | "hollow"
  ) {
    let points: Array<[number, number]> = [lowerLeft, upperLeft, upperRight, lowerRight]
    // mode === 'fill' ?
    //   [lowerLeft, upperRight, upperLeft, lowerRight] :
    //   [lowerLeft, upperLeft, upperRight, lowerRight]
    this.drawTriangle(points, color, mode)
  }
}
)