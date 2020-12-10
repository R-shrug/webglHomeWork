import { Canvas } from "../../utils/canvas"
import { Camera, ControlledCamera } from "../../utils/core/camera"
import { DepthTextureTarget, CanvasTarget } from "../../utils/core/renderTarget"
import { RenderContext, Renderer } from "../../utils/core/render"
import { Container } from "../../utils/core/displayObject"
import { resizeCanvas } from "../../utils/helpers/WebGlUtils"
import { SphereObject } from "../../utils/shapes/Sphere"
import { TextureSphereObject } from "../../utils/plugins/TextureSphere";
import { TextureBase } from "../../utils/core/texture";
import { LoadImageAsync } from "../../utils/helpers/asyncLoad";
import { LightBall } from "./lightBall"
import earthSrc from "../assets/earth.jpg"
import "../../utils/draw/3D_model/index"
import { ShadowTexurePlugin } from "../../utils/plugins/ShadowTexture"

async function main() {

  let CanvaS = new Canvas("canvas")

  const { gl } = CanvaS

  const canvas = CanvaS.canvas

  gl.enable(gl.DEPTH_TEST)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  const stage = new Container()
  const camera = new ControlledCamera(canvas, false, 7, 40)

  const lightBall = new LightBall(gl)

  camera
    .setViewPort(canvas.width / canvas.height)
    .setPosition(1.3 * Math.sqrt(9), 1.3 * Math.sqrt(47), 6)
    // .setPosition(-4, 4, 10)
    .setLookAt(Math.sqrt(9), Math.sqrt(47), 0)
  // .setLookAt(0, 0, Math.sqrt(79))
  const light = new Camera()
    .setViewPort(1, 0.5 * Math.PI)
    .setPosition(12, 0, 0)
    .setLookAt(0, 0, 0)

  const earthTexture = new TextureBase(gl, await LoadImageAsync(earthSrc))

  let earth = new TextureSphereObject(earthTexture)
  earth.position.set(0, 0, 0)
  earth.scale.set(7, 7, 7)
  earth.color.set(0x4cd1e0)

  const ball = new SphereObject()
  ball.color.set(0xc55d6e)
  ball.position.set(Math.sqrt(9), Math.sqrt(47), 0)
  ball.scale.set(0.5, 0.5, 0.5)
  stage.addChild(ball)

    ball.position.set(0, 0, 0)
    ball.scale.set(1, 1, 1)
    ball.color.set(0x4cd1e0)
    ball.material.specular = 1
    ball.material.ambient = 0.7
    ball.material.diffuse=4

  let sun = new SphereObject()

    sun.position.set(10, 10, 0)
    sun.scale.set(6, 6, 6)
    sun.color.set(0xe2c074)

  let prev = performance.now() / 1000

  function update(now: number) {
    now = now / 1000
    const dt = now - prev
    if (resizeCanvas(gl, canvas))
      camera.setViewPort(canvas.width / canvas.height)

    let speed = <HTMLInputElement>document.getElementById("speed")
    lightBall.animate(dt, speed.value as unknown as number)
    light.position.set(20 * lightBall.sun.position.x, 20 * lightBall.sun.position.y, 20 * lightBall.position.z)
    light.setLookAt(0, 0, 0)
    document.body.style.backgroundImage = "linear-gradient(-" + lightBall.theta / (2 * Math.PI) * 360 + "deg, #cdd1d3,#1677b3,#131824 55%,#0B1013)"
    camera.update(dt)
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

  stage.addChild(earth)
  stage.addChild(lightBall)

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

