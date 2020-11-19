import { RendererPlugin, RegisterPlugin, RenderContext } from "../core/render"
import { DisplayObject } from "../core/displayObject"
import { createProgram, loadShader, createUniformSetters, createAttributeSetters, AttributeInfo } from "../helpers/WebGlUtils"
import { Color } from "../math/Color"
import { BindableBuffer } from "../core/bindableBuffer"

const vert = `
attribute vec3 aPosition;

varying vec3 vColor;

uniform mat4 uView;
uniform mat4 uWorld;
uniform vec3 uColor;

void main() {
  gl_Position = uView * uWorld * vec4(aPosition, 1);
  vColor = uColor;
}`

const frag = `
precision mediump float;

varying vec3 vColor;
 
void main() {
  gl_FragColor = vec4(vColor.rgb, 1.0);
}`

export interface ISolideLineObject extends DisplayObject {
  plugin: "SolidLinePlugin"
  data: {
    positionBuffer: BindableBuffer,
    points: number
  }
}

export class SolidLinePlugin extends RendererPlugin {

  static readonly PluginName = "SolidLinePlugin" as "SolidLinePlugin"

  constructor(gl: WebGLRenderingContext) {
    super(gl)

    const program = createProgram(gl, [
      loadShader(gl, vert, gl.VERTEX_SHADER),
      loadShader(gl, frag, gl.FRAGMENT_SHADER)
    ])

    gl.useProgram(program)

    this.uniforms = createUniformSetters(gl, program)
    this.attributes = createAttributeSetters(gl, program)
    this.program = program
  }

  program: WebGLProgram
  uniforms: Record<string, (v: any) => void>
  attributes: Record<string, (b: AttributeInfo) => void>

  renderObject(object: ISolideLineObject, { camera }: RenderContext) {
    const { gl } = this
    gl.useProgram(this.program)

    this.uniforms.uView(camera.viewTransformMatrix.toArray(new Float32Array(16)))
    this.uniforms.uWorld(object.viewTransform.toArray(new Float32Array(16)))
    const color = object.color || new Color()
    this.uniforms.uColor(color.toArray(new Float32Array(3)))

    object.data.positionBuffer.update(gl)
    if (!object.data.positionBuffer.buffer) throw new Error("empty Buffer")
    this.attributes.aPosition({ size: 3, buffer: object.data.positionBuffer.buffer })

    gl.drawArrays(gl.LINES, 0, object.data.points)
  }
}

RegisterPlugin(SolidLinePlugin.PluginName, SolidLinePlugin)
