import { Container } from "../core/displayObject"
import { Vector3 } from "../math/Vector3"
import { BindableBuffer } from "../core/bindableBuffer"
import { ICommonShadowObject, CommonShadowPlugin } from "../plugins/CommonShadow"
import { IShadowTexureObject } from "../plugins/ShadowTexture"
import { ISolidFaceObject, SolidFacePlugin } from "../plugins/SolidFace"

function GetPoint(jingdu: number, weidu: number) {

  const cosweidu = Math.cos(weidu)
  const dx = Math.cos(jingdu) * cosweidu
  const dy = Math.sin(jingdu) * cosweidu
  const dz = Math.sin(weidu)

  return new Vector3(dx, dy, dz)
}

function calculateCircleVertices(division: number) {

  const vertices: Vector3[] = []

  const div = division > 0 ? division : 1

  const circles: [Vector3[], Vector3[]] = [[], []]

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
    circles[0].push(GetPoint(j, 0))
  })

  weidus.forEach((w, i) => {
    const outer = circles[i % 2]
    const inner = circles[1 - i % 2]

    inner.length = 0
    jingdus.forEach(j => {
      inner.push(GetPoint(j, w))
    })

    for (let i = 0; i < inner.length; i++) {
      const ii = (i + 1) % inner.length

      let verts = [outer[i], outer[ii], inner[ii], inner[i],]
      verts = verts.concat(verts.map(x => new Vector3(x.x, x.y, -x.z)))

      const order = [0, 1, 2, 0, 2, 3, 4, 6, 5, 4, 7, 6]
      order.forEach(x => vertices.push(verts[x]))
    }
  })

  return vertices
}

function getCirCleVertexDataBuffer() {
  const vertices = calculateCircleVertices(20)

  const positionBuffer = new Float32Array(vertices.length * 3)

  let i = 0
  let j = 0
  while (i < vertices.length) {
    const v0 = vertices[i++]
    v0.toArray(positionBuffer, j)
    j += 3
  }

  return positionBuffer
}

const normalCircleVertexBuffer = new BindableBuffer(getCirCleVertexDataBuffer().buffer)

export class SphereObject extends Container implements ICommonShadowObject, IShadowTexureObject {

  plugin = CommonShadowPlugin.PluginName
  shadowRender = true

  data = {
    positionBuffer: normalCircleVertexBuffer,
    normalBuffer: normalCircleVertexBuffer,
    points: normalCircleVertexBuffer.arrayBuffer.byteLength / 3 / 4
  }
}

export class SolidShpereObject extends Container implements ISolidFaceObject {

  plugin = SolidFacePlugin.PluginName
  data = {
    positionBuffer: normalCircleVertexBuffer,
    normalBuffer: normalCircleVertexBuffer,
    points: normalCircleVertexBuffer.arrayBuffer.byteLength / 3 / 4
  }
}

