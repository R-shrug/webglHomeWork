import { RendererPlugin, RegisterPlugin, RenderContext } from "../core/render"
import { DisplayObject } from "../core/displayObject"
import { createProgram, loadShader, createUniformSetters, createAttributeSetters, AttributeInfo } from "../helpers/WebGlUtils"
import { BindableBuffer } from "../core/bindableBuffer"

const vert = `
attribute vec3 aPosition;

uniform mat4 uLightMat;
uniform mat4 uWorld;

void main() {
    gl_Position = uLightMat * uWorld * vec4(aPosition, 1.0);
}`

const frag = `
precision mediump float;

uniform vec3 uColor;

void main() {
    gl_FragColor = vec4(uColor, 1.0);
}`

export interface IShadowTexureObject extends DisplayObject {
  data: {
    positionBuffer: BindableBuffer,
    points: number
  },
  shadowRender: boolean
}

export class ShadowTexurePlugin extends RendererPlugin {

  static readonly PluginName = "ShadowTexurePlugin" as "ShadowTexurePlugin"

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

  renderObject(object: IShadowTexureObject, { light }: RenderContext) {
    if (!object.shadowRender) return

    const { gl } = this
    gl.useProgram(this.program)

    object.data.positionBuffer.update(gl)
    if (!object.data.positionBuffer.buffer) throw new Error("empty Buffer")
    this.attributes.aPosition({ size: 3, buffer: object.data.positionBuffer.buffer })

    this.uniforms.uLightMat(light.viewTransformMatrix.toArray(new Float32Array(16)))
    this.uniforms.uWorld(object.viewTransform.toArray(new Float32Array(16)))
    this.uniforms.uColor(new Float32Array([0, 1, 1]))

    gl.drawArrays(gl.TRIANGLES, 0, object.data.points)
  }
}

RegisterPlugin(ShadowTexurePlugin.PluginName, ShadowTexurePlugin)
