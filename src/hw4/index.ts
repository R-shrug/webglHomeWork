import { Canvas } from "../../utils/canvas"
import { Camera, ControlledCamera } from "../../utils/core/camera"
import { DepthTextureTarget, CanvasTarget } from "../../utils/core/renderTarget"
import { RenderContext, Renderer } from "../../utils/core/render"
import { Container } from "../../utils/core/displayObject"
import { resizeCanvas } from "../../utils/helpers/WebGlUtils"
import { LightBall } from "./lightBall"
import { robot } from "./robot"
import "../../utils/draw/3D_model/index"
import { ShadowTexurePlugin } from "../../utils/plugins/ShadowTexture"
import { Vector3 } from "../../utils/math/Vector3"
import { theEarth } from "./earth"

// let color = [
//   { start: [0xb7, 0x7c, 0x7b], end: [0x18, 0x1a, 0x3c] }
//   , { start: [0xf7, 0xa1, 0x91], end: [0x2e, 0x23, 0x4d] }
//   , { start: [0xf6, 0xb7, 0x9c], end: [0x2a, 0x38, 0x5c] }
//   , { start: [0xf1, 0xc7, 0x9a], end: [0x0a, 0x42, 0x6a] }
//   , { start: [0xed, 0xd9, 0xa3], end: [0x01, 0x40, 0x6a] }
//   , { start: [0xe1, 0xdd, 0xff], end: [0x03, 0x3b, 0x67] }
//   , { start: [0xc5, 0xd9, 0xd0], end: [0x07, 0x35, 0x66] }
//   , { start: [0xc2, 0xe0, 0xe4], end: [0x08, 0x33, 0x64] }
//   , { start: [0xb7, 0xdf, 0xef], end: [0x0a, 0x32, 0x66] }
//   , { start: [0xad, 0xd3, 0xdd], end: [0x12, 0x35, 0x66] }
//   , { start: [0xab, 0xcc, 0xc9], end: [0x19, 0x3c, 0x66] }
//   , { start: [0xad, 0xc7, 0xbd], end: [0x1e, 0x3e, 0x69] }
//   , { start: [0xba, 0xb7, 0x9c], end: [0x22, 0x3f, 0x68] }
//   , { start: [0xd3, 0x9a, 0x70], end: [0x22, 0x3a, 0x60] }
//   , { start: [0xe9, 0x78, 0x3b], end: [0x1f, 0x2e, 0x53] }
//   , { start: [0xc8, 0x75, 0x48], end: [0x19, 0x25, 0x47] }
//   , { start: [0xa6, 0x74, 0x59], end: [0x10, 0x1a, 0x37] }
//   , { start: [0x88, 0x6d, 0x61], end: [0x09, 0x14, 0x33] }
//   , { start: [0x59, 0x56, 0x5d], end: [0x04, 0x11, 0x30] }
//   , { start: [0x43, 0x51, 0x51], end: [0x04, 0x11, 0x30] }
//   , { start: [0x4b, 0x52, 0x52], end: [0x04, 0x11, 0x30] }
//   , { start: [0x5d, 0x54, 0x52], end: [0x05, 0x12, 0x31] }
//   , { start: [0x70, 0x57, 0x58], end: [0x04, 0x11, 0x30] }
//   , { start: [0x81, 0x5c, 0x63], end: [0x05, 0x13, 0x32] }]

let color = [
  { start: [0x5d, 0x54, 0x52], end: [0x05, 0x12, 0x31] }
  , { start: [0x70, 0x57, 0x58], end: [0x04, 0x11, 0x30] }
  , { start: [0x81, 0x5c, 0x63], end: [0x05, 0x13, 0x32] }
  , { start: [0xb7, 0x7c, 0x7b], end: [0x18, 0x1a, 0x3c] }
  , { start: [0xf7, 0xa1, 0x91], end: [0x2e, 0x23, 0x4d] }
  , { start: [0xf6, 0xb7, 0x9c], end: [0x2a, 0x38, 0x5c] }
  , { start: [0xf1, 0xc7, 0x9a], end: [0x0a, 0x42, 0x6a] }
  , { start: [0xed, 0xd9, 0xa3], end: [0x01, 0x40, 0x6a] }
  , { start: [0xb7, 0xdf, 0xef], end: [0x0a, 0x32, 0x66] }
  , { start: [0xad, 0xd3, 0xdd], end: [0x12, 0x35, 0x66] }
  , { start: [0xab, 0xcc, 0xc9], end: [0x19, 0x3c, 0x66] }
  , { start: [0xad, 0xc7, 0xbd], end: [0x1e, 0x3e, 0x69] }
  , { start: [0xba, 0xb7, 0x9c], end: [0x22, 0x3f, 0x68] }
  , { start: [0xd3, 0x9a, 0x70], end: [0x22, 0x3a, 0x60] }
  , { start: [0xe9, 0x78, 0x3b], end: [0x1f, 0x2e, 0x53] }
  , { start: [0xc8, 0x75, 0x48], end: [0x19, 0x25, 0x47] }
  , { start: [0xa6, 0x74, 0x59], end: [0x10, 0x1a, 0x37] }
  , { start: [0x88, 0x6d, 0x61], end: [0x09, 0x14, 0x33] }
  , { start: [0x59, 0x56, 0x5d], end: [0x04, 0x11, 0x30] }
  , { start: [0x59, 0x56, 0x5d], end: [0x04, 0x11, 0x30] }
  , { start: [0x43, 0x51, 0x51], end: [0x04, 0x11, 0x30] }
  , { start: [0x43, 0x51, 0x51], end: [0x04, 0x11, 0x30] }
  , { start: [0x4b, 0x52, 0x52], end: [0x04, 0x11, 0x30] }
  , { start: [0x4b, 0x52, 0x52], end: [0x04, 0x11, 0x30] }
]

function getColor(state: number): [string, string] {
  let now = color[Math.floor(state)]
  let next = color[(Math.floor(state) + 1) % 24]
  return [
    '#' +
    Math.floor(now.start[0] + (next.start[0] - now.start[0]) * (state % 1)).toString(16).padStart(2, '0') +
    Math.floor(now.start[1] + (next.start[1] - now.start[1]) * (state % 1)).toString(16).padStart(2, '0') +
    Math.floor(now.start[2] + (next.start[2] - now.start[2]) * (state % 1)).toString(16).padStart(2, '0'),
    '#' +
    Math.floor(now.end[0] + (next.end[0] - now.end[0]) * (state % 1)).toString(16).padStart(2, '0') +
    Math.floor(now.end[1] + (next.end[1] - now.end[1]) * (state % 1)).toString(16).padStart(2, '0') +
    Math.floor(now.end[2] + (next.end[2] - now.end[2]) * (state % 1)).toString(16).padStart(2, '0')
  ]
}

async function main() {
  const Xunit = new Vector3(1, 0, 0)
  const Yunit = new Vector3(0, 1, 0)
  const Zunit = new Vector3(0, 0, 1)

  let CanvaS = new Canvas("canvas")

  const { gl } = CanvaS

  const canvas = CanvaS.canvas

  gl.enable(gl.DEPTH_TEST)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  const stage = new Container()
  const camera = new ControlledCamera(canvas, false, 3, 8)

  const lightBall = new LightBall(gl)
  const Robot = new robot(gl)
  Robot.rotation.setFromAxisAngle(Zunit, -Math.PI / 5)
  const Earth = new theEarth(gl)
  Earth.position.set(0, 0, 0)
  camera
    .setViewPort(canvas.width / canvas.height)
    .setPosition(1.3 * Math.sqrt(9), 1.3 * Math.sqrt(47), 6)
    .setLookAt(4, 6.2, -1)
  const light = new Camera()
    // .setViewPort(1, 0.6 * Math.PI)
    .setViewPort(1, 0.85 * Math.PI)
    .setPosition(12, 0, 0)
    .setLookAt(0, 0, 0)

  let prev = performance.now() / 1000
  let state = 5
  function update(now: number) {
    now = now / 1000
    const dt = now - prev
    if (resizeCanvas(gl, canvas))
      camera.setViewPort(canvas.width / canvas.height)

    let speed = <HTMLInputElement>document.getElementById("speed")
    const sv = speed.value as unknown as number
    lightBall.animate(dt, sv)

    // light.position.set(2.4 * lightBall.sun.position.x, 2.4 * lightBall.sun.position.y, 2.4 * lightBall.position.z)
    light.position.set(lightBall.sun.position.x, lightBall.sun.position.y, lightBall.position.z)
    light.setLookAt(0, 0, 0)
    state = (state + (dt * 24 / (36 / sv))) % 24
    const result = getColor(state)
    document.body.style.backgroundImage = `linear-gradient(0deg, ${result[0]},${result[1]})`
    camera.update(dt)
    Robot.animate(now)
    Earth.animate(now)
    prev = now

  }

  const renderer = new Renderer(gl)
  const canvastarget = new CanvasTarget(gl)
  const depthtarget = new DepthTextureTarget(gl, 4096, 4096)

  const context: RenderContext = {
    camera,
    light,
    shadowTexture: depthtarget.texture
  }

  stage.addChild(lightBall, Robot, Earth)

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

  function tick(now: number) {
    requestAnimationFrame(tick)
    update(now)
    light.updateTransform()
    renderer.render(depthtarget, stage, context, true, ShadowTexurePlugin.PluginName)
    renderer.render(canvastarget, stage, context, true)
  }
  requestAnimationFrame(tick)
}

main()

