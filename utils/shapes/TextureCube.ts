import { Container } from "../core/displayObject"
import { TextureBase } from "../core/texture"
import { BindableBuffer } from "../core/bindableBuffer"
import { ICommonShadowObject, CommonShadowPlugin } from "../plugins/CommonShadow"
import { IShadowTexureObject } from "../plugins/ShadowTexture"

type vert = [number, number, number]

function getCubeVertexBuffer() {
  const positionbuffer: number[] = []
  const normalbuffer: number[] = []
  const uvsbuffer: number[] = []

  const verts: vert[] = [
    [0, 0, 0],
    [1, 0, 0],
    [1, 1, 0],
    [0, 1, 0],
    [0, 0, 1],
    [1, 0, 1],
    [1, 1, 1],
    [0, 1, 1],
  ]

  function pushFace(v0: number, v1: number, v2: number, v3: number, normal: vert) {
    positionbuffer.push(...verts[v0]), normalbuffer.push(...normal), uvsbuffer.push(0, 0)
    positionbuffer.push(...verts[v1]), normalbuffer.push(...normal), uvsbuffer.push(1, 0)
    positionbuffer.push(...verts[v2]), normalbuffer.push(...normal), uvsbuffer.push(1, 1)
    positionbuffer.push(...verts[v0]), normalbuffer.push(...normal), uvsbuffer.push(0, 0)
    positionbuffer.push(...verts[v2]), normalbuffer.push(...normal), uvsbuffer.push(1, 1)
    positionbuffer.push(...verts[v3]), normalbuffer.push(...normal), uvsbuffer.push(0, 1)
  }

  pushFace(0, 1, 2, 3, [0, 0, -1])
  pushFace(7, 6, 5, 4, [0, 0, 1])
  pushFace(0, 4, 5, 1, [0, -1, 0])
  pushFace(2, 6, 7, 3, [0, 1, 0])
  pushFace(0, 3, 7, 4, [-1, 0, 0])
  pushFace(1, 5, 6, 2, [1, 0, 0])
  return {
    positionBuffer: new BindableBuffer(new Float32Array(positionbuffer)),
    normalBuffer: new BindableBuffer(new Float32Array(normalbuffer)),
    uvsBuffer: new BindableBuffer(new Float32Array(uvsbuffer)),
  }
}

const cubebuffer = getCubeVertexBuffer()

export class TextureCubeObject extends Container implements ICommonShadowObject, IShadowTexureObject {
  plugin = CommonShadowPlugin.PluginName
  shadowRender = true
  data: ICommonShadowObject["data"]
  material= {
    specular: 0.8,
    diffuse: 4,
    ambient: 0.8
  }
  constructor(texture: TextureBase) {
    super()
    this.data = {
      ...cubebuffer,
      texture,
      points: cubebuffer.normalBuffer.arrayBuffer.byteLength / 3 / 4
    }
  }
}
