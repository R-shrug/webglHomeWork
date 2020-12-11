import { Container } from "../core/displayObject"
import { Vector3 } from "../math/Vector3"
import { Color } from "../math/Color"
import { TextureBase } from "../core/texture"
import { Vector2 } from "../math/Vector2"
import { BindableBuffer } from "../core/bindableBuffer"
import { ICommonShadowObject, CommonShadowPlugin } from "../plugins/CommonShadow"
import { IShadowTexureObject } from "../plugins/ShadowTexture"

type jw = {
  /** 0 ~ 2pi */
  j: number
  /** -pi/2 ~ pi/2 */
  w: number
}

type vert = {
  pos: Vector3
  normal: Vector3
  uvs: Vector2
}

function GetPoint(jingwei: jw) {
  const { j, w } = jingwei

  const cosweidu = Math.cos(w)
  const dx = Math.cos(j) * cosweidu
  const dy = Math.sin(j) * cosweidu
  const dz = Math.sin(w)

  return new Vector3(dx, dy, dz)
}

function GetUvs(jingwei: jw, border = false) {
  let { j, w } = jingwei
  if (border && j === 0) {
    j = 2 * Math.PI
  }
  w += Math.PI / 2
  return new Vector2(j / Math.PI / 2, 1 - w / Math.PI)
}

function calculateCircleVertices(division: number) {

  const vertices: vert[] = []

  const div = division > 0 ? division : 1

  const circles: [jw[], jw[]] = [[], []]

  const jingdus: number[] = []
  const weidus: number[] = []

  for (let i = 0; i < div * 4; i++) {
    const jingdu = i / div / 2 * Math.PI
    jingdus.push(jingdu)
  }
  for (let i = 1; i <= div; i++) {
    const weidu = i / div / 2 * Math.PI
    weidus.push(weidu)
  }

  jingdus.forEach(j => {
    circles[0].push({ j, w: 0 })
  })

  weidus.forEach((w, i) => {
    const outer = circles[i % 2]
    const inner = circles[1 - i % 2]

    inner.length = 0
    jingdus.forEach(j => {
      inner.push({ j, w })
    })

    for (let i = 0; i < inner.length; i++) {
      const ii = (i + 1) % inner.length

      let jws = [outer[i], outer[ii], inner[ii], inner[i],]
      jws = jws.concat(jws.map(x => ({ j: x.j, w: -x.w })))

      const pos = jws.map(x => GetPoint(x))
      const uvs = jws.map(x => GetUvs(x, ii < i))

      const order = [0, 1, 2, 0, 2, 3, 4, 6, 5, 4, 7, 6]
      order.forEach(x => vertices.push({
        pos: pos[x],
        normal: pos[x],
        uvs: uvs[x]
      }))

    }
  })

  return vertices
}

function getCirCleVertexDataBuffer() {
  const vertices = calculateCircleVertices(20)

  return {
    positionBuffer: new BindableBuffer(new Float32Array(vertices.map(x => x.pos.toArray()).flat())),
    normalBuffer: new BindableBuffer(new Float32Array(vertices.map(x => x.normal.toArray()).flat())),
    uvsBuffer: new BindableBuffer(new Float32Array(vertices.map(x => x.uvs.toArray()).flat())),
  }
}

const normalCircleVertexBuffer = getCirCleVertexDataBuffer()

export class TextureSphereObject extends Container implements ICommonShadowObject, IShadowTexureObject {
  color = new Color()
  plugin = CommonShadowPlugin.PluginName
  shadowRender = true
  data: ICommonShadowObject["data"]
  material= {
    specular:0.2,
    diffuse: 1.5,
    ambient: 0.8
  }
  constructor(texture: TextureBase) {
    super()
    this.data = {
      texture,
      ...normalCircleVertexBuffer,
      points: normalCircleVertexBuffer.positionBuffer.arrayBuffer.byteLength / 3 / 4
    }
  }
}

