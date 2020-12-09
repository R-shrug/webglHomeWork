import { RendererPlugin, RegisterPlugin, RenderContext } from "../core/render"
import { DisplayObject } from "../core/displayObject"
import { createProgram, loadShader, createUniformSetters, createAttributeSetters, AttributeInfo } from "../helpers/WebGlUtils"
import { BindableBuffer } from "../core/bindableBuffer"
import { IShadowTexureObject } from "./ShadowTexture"
import { TextureBase } from "../core/texture"

const vert = `
attribute vec3 aPosition;
attribute vec3 aNormal;
attribute vec2 aUVs;

uniform mat4 uView;
uniform mat4 uWorld;
uniform mat4 uWorldTransInv;

varying vec2 vUVs;
varying vec4 vWorldPosition;
varying vec3 vWorldNormal;

void main() {
    vUVs = aUVs;
    vWorldPosition = uWorld * vec4(aPosition, 1.0);
    vWorldNormal = mat3(uWorldTransInv) * aNormal;

    gl_Position = uView * vWorldPosition;
}`

const frag = `
precision highp float;

varying vec2 vUVs;
varying vec4 vWorldPosition;
varying vec3 vWorldNormal;

uniform vec3 uLightPosition;
uniform mat4 uLightMat;
uniform vec3 uCameraPosition;

uniform sampler2D uTexture;
uniform sampler2D uShadowTexure;

uniform vec3 uColor;
uniform float uSpecular;
uniform float uDiffuse;
uniform float uAmbient;
uniform float uShiness;
uniform bool uHasTexure;

bool isLighted() {
    vec4 inLightPosition = uLightMat * vWorldPosition;
    vec3 projectedPos = inLightPosition.xyz / inLightPosition.w / 2.0 + 0.5;
    float depth = projectedPos.z - 0.0002;
    float mapdepth = texture2D(uShadowTexure, projectedPos.xy).r;
    return depth <= mapdepth;
}

void main() {
    vec3 objToLight = uLightPosition - vWorldPosition.xyz;
    vec3 objToCamera = uCameraPosition - vWorldPosition.xyz;
    vec3 normal = normalize(vWorldNormal);

    float diffuse = dot(normal, normalize(objToLight));
    if (diffuse < 0.0) diffuse = - diffuse * 0.05;


    float specular = dot(normal, normalize(normalize(objToLight) + normalize(objToCamera)));
    if (specular < 0.0) specular = 0.0;
    else specular = pow(specular,80.0);

    bool lighted = isLighted();

    float objToLightDis = length(objToLight);
    float light = lighted ? 100.0 / objToLightDis : 0.0;
    if (light > 1.0) light = 1.0;

    light *= diffuse * uDiffuse;
    if (lighted)
        light += specular * uSpecular;
    light += uAmbient;

    gl_FragColor = vec4(uColor.rgb, 1.0) * light;
    if (uHasTexure) gl_FragColor *= texture2D(uTexture, vUVs);
}`

export interface ICommonShadowObject extends DisplayObject, IShadowTexureObject {
  data: {
    positionBuffer: BindableBuffer,
    normalBuffer: BindableBuffer,
    uvsBuffer?: BindableBuffer,
    texture?: TextureBase,
    points: number,
  },
  material?: {
    specular?: number
    diffuse?: number
    ambient?: number
    shiness?:number

  }
  plugin: "CommonShadowPlugin"
}

const defaultMaterial = {
  specular: 0.8,
  diffuse: 1,
  ambient: 0.8,
  shiness:300.0
}

export class CommonShadowPlugin extends RendererPlugin {

  static readonly PluginName = "CommonShadowPlugin" as "CommonShadowPlugin"

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

  renderObject(object: ICommonShadowObject, { light, camera, shadowTexture }: RenderContext) {
    const { gl } = this
    gl.useProgram(this.program)

    object.data.positionBuffer.update(gl)
    if (!object.data.positionBuffer.buffer) throw new Error("empty Buffer")

    this.attributes.aPosition({ size: 3, buffer: object.data.positionBuffer.buffer })
    object.data.normalBuffer.update(gl)
    if (!object.data.normalBuffer.buffer) throw new Error("empty Buffer")

    this.attributes.aNormal({ size: 3, buffer: object.data.normalBuffer.buffer })

    if (object.data.texture && object.data.uvsBuffer) {
      object.data.uvsBuffer.update(gl)
      if (!object.data.uvsBuffer.buffer) throw new Error("empty Buffer")
      this.attributes.aUVs({ size: 2, buffer: object.data.uvsBuffer.buffer })
      this.uniforms.uTexture(object.data.texture.texture)
      this.uniforms.uHasTexure(new Int32Array([1]))
    } else {
      this.uniforms.uHasTexure(new Int32Array([0]))
    }

    this.uniforms.uView(camera.viewTransformMatrix.toArray(new Float32Array(16)))
    this.uniforms.uWorld(object.viewTransform.toArray(new Float32Array(16)))
    this.uniforms.uWorldTransInv(object.viewTransformInvTrans.toArray(new Float32Array(16)))

    this.uniforms.uLightPosition(light.position.toArray(new Float32Array(3)))
    this.uniforms.uLightMat(light.viewTransformMatrix.toArray(new Float32Array(16)))
    this.uniforms.uCameraPosition(camera.position.toArray(new Float32Array(3)))

    const material = Object.assign({}, defaultMaterial, object.material)

    this.uniforms.uColor(object.color.toArray(new Float32Array(3)))
    this.uniforms.uSpecular(material.specular)
    this.uniforms.uDiffuse(material.diffuse)
    this.uniforms.uAmbient(material.ambient)
    //this.uniforms.uShiness(material.shiness)
    this.uniforms.uShadowTexure(shadowTexture)

    gl.drawArrays(gl.TRIANGLES, 0, object.data.points)
  }
}

RegisterPlugin(CommonShadowPlugin.PluginName, CommonShadowPlugin)
