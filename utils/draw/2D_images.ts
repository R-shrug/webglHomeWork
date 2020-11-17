import { Canvas } from "../canvas"
import { createProgram, loadShader, createUniformSetters, createAttributeSetters } from "../WebGlUtils"
import { transformRgba, reduceDimension, mapping } from "../tool"
import { vec2 } from "../type"

declare module "../canvas" {
  interface Canvas {
    /**
     * 绘制二维图形
     * @param points 顶点位置
     * @param color 颜色，
     * e.g. cyan [0,255,255,1] or rgb(0,255,255) or #00FFFF 
     * @param mode fill：充满，hollow：镂空
     * @param primitiveType
     */
    draw2Dimages(
      points: Array<vec2>,
      color: string | number[],
      mode: "fill" | "hollow",
      primitiveType?: number
    ): never;
    /**
     * 绘制三角形
     * @param points 顶点位置
     * @param color 颜色，
     * e.g. cyan [0,255,255,1] or rgb(0,255,255) or #00FFFF 
     * @param mode fill：充满，hollow：镂空
     * @param primitiveType
     */
    drawTriangle(
      points: Array<vec2>,
      color: string | number[],
      mode: "fill" | "hollow",
      primitiveType?: number
    ): never;
    /**
     * 
     * @param center 圆心位置
     * @param majorAxis 长轴长度
     * @param minorAxis 短轴长度
     * @param color 颜色，
     * e.g. cyan [0,255,255,1] or rgb(0,255,255) or #00FFFF 
     * @param mode fill：充满，hollow：镂空
     * @param tilt 倾斜弧度
     * @param startRadian 起始弧度
     * @param totalRadian 总弧度
     * @param primitiveType 
     */
    drawEllipseSector(
      center: vec2,
      majorAxis: number,
      minorAxis: number,
      color: string | number[],
      mode: "fill" | "hollow",
      tilt?: number,
      startRadian?: number,
      totalRadian?: number,
      primitiveType?: number
    ): never
    /**
     * 绘制扇形
     * @param center 圆心位置
     * @param radius 半径长度
     * @param startRadian 起始弧度
     * @param totalRadian 总弧度
     * @param color 颜色，
     * e.g. cyan [0,255,255,1] or rgb(0,255,255) or #00FFFF 
     * @param mode fill：充满，hollow：镂空
     * @param primitiveType
     */
    drawSector(
      center: vec2,
      radius: number,
      startRadian: number,
      totalRadian: number,
      color: string | number[],
      mode: "fill" | "hollow",
      primitiveType?: number
    ): never
    /**
     * 绘制弧线
     * @param center 圆心位置
     * @param radius 半径长度
     * @param startRadian 起始弧度
     * @param totalRadian 总弧度
     * @param lineWidth 弧宽
     * @param color 颜色，
     * e.g. cyan [0,255,255,1] or rgb(0,255,255) or #00FFFF 
     * @param primitiveType
     */
    drawArc(
      center: vec2,
      radius: number,
      startRadian: number,
      totalRadian: number,
      lineWidth: number,
      color: string | number[],
      primitiveType?: number
    ): never;
    /**
     * 
     * @param center 圆心位置
     * @param majorAxis 长轴长度
     * @param minorAxis 短轴长度
     * @param color 颜色，
     * e.g. cyan [0,255,255,1] or rgb(0,255,255) or #00FFFF 
     * @param mode fill：充满，hollow：镂空
     * @param tilt 倾斜角
     * @param primitiveType 
     */
    drawEllipse(
      center: vec2,
      majorAxis: number,
      minorAxis: number,
      color: string | number[],
      mode: "fill" | "hollow",
      tilt?: number,
      primitiveType?: number
    ): never
    /**
     * 绘制圆形
     * @param center 圆心位置
     * @param radius 半径长度
     * @param color 颜色，
     * e.g. cyan [0,255,255,1] or rgb(0,255,255) or #00FFFF 
     * @param mode fill：充满，hollow：镂空
     * @param primitiveType
     */
    drawCircle(
      center: vec2,
      radius: number,
      color: string | number[],
      mode: "fill" | "hollow",
      primitiveType?: number
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
     * @param primitiveType
     */
    drawRectangle(
      lowerLeft: vec2,
      lowerRight: vec2,
      upperRight: vec2,
      upperLeft: vec2,
      color: string | number[],
      mode: "fill" | "hollow",
      primitiveType?: number
    ): never
  }
}

Object.assign(Canvas.prototype, {
  draw2Dimages(
    this: Canvas,
    points: Array<vec2>,
    color: string | number[],
    mode: "fill" | "hollow",
    primitiveType: number
  ) {
    let { gl } = this

    let vertexShaderSource = `
    attribute vec2 a_position;
    uniform vec2 u_resolution;
    void main() {
       vec2 zeroToOne = a_position / u_resolution;
    
       vec2 zeroToTwo = zeroToOne * 2.0;
    
       vec2 clipSpace = zeroToTwo - 1.0;
    
       gl_Position = vec4(clipSpace, 0, 1);
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
    uniforms.u_resolution(this.size)
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    let positions = new Float32Array(reduceDimension(points))

    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
    primitiveType = primitiveType ? primitiveType :
      (mode === 'fill' ? gl.TRIANGLE_FAN : gl.LINE_LOOP);
    let offset = 0;
    let count = reduceDimension(points).length / 2;
    gl.drawArrays(primitiveType, offset, count);
  },
  drawTriangle(
    this: Canvas,
    points: Array<vec2>,
    color: string | number[],
    mode: "fill" | "hollow",
    primitiveType: number
  ) {
    this.draw2Dimages(points.concat([points[0]]), color, mode, primitiveType)
  },
  drawArc(this: Canvas,
    center: vec2,
    radius: number,
    startRadian: number,
    totalRadian: number,
    lineWidth: number,
    color: string | number[],
    primitiveType: number = this.gl.LINES
  ) {
    let points: Array<vec2> = []
    const times = 100 * Math.PI * 2 / totalRadian

    for (let i = 0; i <= times; i++) {
      points.push([
        center[0] + radius * Math.cos(totalRadian * i / times + startRadian),
        center[1] + radius * Math.sin(totalRadian * i / times + startRadian)])
      points.push([
        center[0] + (radius + lineWidth) * Math.cos(totalRadian * i / times + startRadian),
        center[1] + (radius + lineWidth) * Math.sin(totalRadian * i / times + startRadian)])
    }
    this.drawTriangle(points, color, "fill", primitiveType)
  },
  drawEllipseSector(
    this: Canvas,
    center: vec2,
    majorAxis: number,
    minorAxis: number,
    color: string | number[],
    mode: "fill" | "hollow",
    tilt: number = 0,
    startRadian: number = 0,
    totalRadian: number = Math.PI * 2,
    primitiveType: number
  ) {
    let points: Array<vec2>
    points = mode === 'fill' ? [center] : []
    const times = 100 * Math.PI * 2 / totalRadian
    for (let i = 0; i <= times; i++) {
      let x = majorAxis * Math.cos(totalRadian * i / times + startRadian)
      let y = minorAxis * Math.sin(totalRadian * i / times + startRadian)
      points.push([
        center[0] + x * Math.cos(tilt) + y * Math.sin(tilt),
        center[1] + x * Math.sin(tilt) - y * Math.cos(tilt)
      ])
      // points.push([
      // center[0] + radius * Math.cos(totalRadian * i / times + startRadian),
      // center[1] + radius * Math.sin(totalRadian * i / times + startRadian)])
    }
    this.drawTriangle(points, color, mode, primitiveType)
  },
  drawSector(
    this: Canvas,
    center: vec2,
    radius: number,
    startRadian: number,
    totalRadian: number,
    color: string | number[],
    mode: "fill" | "hollow",
    primitiveType?: number
  ) {
    // this.drawEllipseSector(center, radius, radius, color, mode, tilt, startRadian, totalRadian, primitiveType)
    let points: Array<vec2>
    points = mode === 'fill' ? [center] : []
    const times = 100 * Math.PI * 2 / totalRadian

    for (let i = 0; i <= times; i++) {
      points.push([
        center[0] + radius * Math.cos(totalRadian * i / times + startRadian),
        center[1] + radius * Math.sin(totalRadian * i / times + startRadian)])
    }
    this.drawTriangle(points, color, mode)
  },
  drawEllipse(
    this: Canvas,
    center: vec2,
    majorAxis: number,
    minorAxis: number,
    color: string | number[],
    mode: "fill" | "hollow",
    tilt: number = 0,
    primitiveType: number
  ) {
    this.drawEllipseSector(center, majorAxis, minorAxis, color, mode, tilt, 0, Math.PI * 2, primitiveType)
    // let points: Array<vec2>
    // points = mode === 'fill' ? [center] : []
    // const times = 100
    // for (let i = 0; i <= times; i++) {
    //   let x = majorAxis * Math.cos(Math.PI * 2 * i / times)
    //   let y = minorAxis * Math.sin(Math.PI * 2 * i / times)
    //   points.push([
    //     center[0] + x * Math.cos(tilt) + y * Math.sin(tilt),
    //     center[1] + x * Math.sin(tilt) - y * Math.cos(tilt)
    //   ])
    // }
    // this.drawTriangle(points, color, mode, primitiveType)
  },
  drawCircle(
    this: Canvas,
    center: vec2,
    radius: number,
    color: string | number[],
    mode: "fill" | "hollow",
    primitiveType: number
  ) {
    this.drawSector(center, radius, 0, Math.PI * 2, color, mode, primitiveType)
  },
  drawRectangle(
    this: Canvas,
    lowerLeft: vec2,
    lowerRight: vec2,
    upperRight: vec2,
    upperLeft: vec2,
    color: string | number[],
    mode: "fill" | "hollow",
    primitiveType: number
  ) {
    let points: Array<vec2> = [lowerLeft, upperLeft, upperRight, lowerRight]
    this.drawTriangle(points, color, mode, primitiveType)
  }
}
)
