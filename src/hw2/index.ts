import { Canvas } from "../../utils/canvas"
import { Camera, ControlledCamera } from "../../utils/core/camera"
import { DepthTextureTarget, CanvasTarget } from "../../utils/core/renderTarget"
import { RenderContext, Renderer } from "../../utils/core/render"
import { CameraInputHandler } from "../../utils/core/inputHandler"
import { TextureBase } from "../../utils/core/texture"
import { Container } from "../../utils/core/displayObject"
// 创建着色器方法，输入参数：渲染上下文，着色器类型，数据源
import { ShadowTexurePlugin } from "../../utils/plugins/ShadowTexture"
import { resizeCanvas } from "../../utils/helpers/WebGlUtils"
import { LoadImageAsync } from "../../utils/helpers/asyncLoad"
import { LineObject } from "../../utils/shapes/Line"
import { SphereObject, SolidShpereObject } from "../../utils/shapes/Sphere"
import { Vector3 } from "../../utils/math/Vector3"
import { TextureSphereObject } from "../../utils/plugins/TextureSphere"
import { TextureCubeObject } from "../../utils/shapes/TextureCube"
import snowImgSrc from "../assets/snow.jpg"
import "../../utils/draw/3D_model/index"
import { Dragonz } from "./dragonz"

const YUnit = new Vector3(0, 1, 0)
const ZUnit = new Vector3(0, 0, 1)


async function main() {
  let CanvaS = new Canvas("canvas")

  const { gl } = CanvaS

  const canvas = CanvaS.canvas

  gl.enable(gl.DEPTH_TEST)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  const stage = new Container()
  const camera = new ControlledCamera(canvas)

  const dragon = new Dragonz(gl)

  stage.addChild(dragon)

  camera
    .setViewPort(canvas.width / canvas.height)
    .setPosition(9, 12, 1)
    .setLookAt(1, 4, 2)
  const light = new Camera()
    .setViewPort(1, 0.8 * Math.PI)
    .setPosition(8, 8, 10)
    .setLookAt(1, 1, 1)

  let prev = performance.now() / 1000

  function update(now: number) {
    now = now / 1000
    const dt = now - prev
    if (resizeCanvas(gl, canvas))
      camera.setViewPort(canvas.width / canvas.height)

    camera.update(dt)
    dragon.animate(now, Math.PI * 2);
    // light
    // .setPosition(Math.sin(now / 5) * 13, Math.cos(now / 5) * 13, 10)
    // .setLookAt(0, 0, 0)
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

  function tick(now: number) {
    requestAnimationFrame(tick)
    update(now)
    light.updateTransform()
    renderer.render(depthtarget, stage, context, true, ShadowTexurePlugin.PluginName)
    renderer.render(canvastarget, stage, context, true)

  }

  requestAnimationFrame(tick)

  // canvas.render()

  // canvas.draw3Dmodels([
  //   [0, 0, 40],
  //   [30, 0, 40],
  //   [0, 150, 40],
  //   [0, 150, 40],
  //   [30, 0, 40],
  //   [30, 150, 40]], "#13acd9", 'fill', [300, 300, 0], [30, 30, 30])

  // canvas.draw3Dmodels([
  //   [30, 120, 40],
  //   [100, 120, 40],
  //   [30, 150, 40],
  //   [30, 150, 40],
  //   [100, 120, 40],
  //   [100, 150, 40]
  // ], "#13acd9", 'fill', [300, 300, 0], [30, 30, 30])

  // canvas.draw3Dmodels([
  //   [30, 60, 40],
  //   [67, 60, 40],
  //   [30, 90, 40],
  //   [30, 90, 40],
  //   [67, 60, 40],
  //   [67, 90, 40]
  // ], "#13acd9", 'fill', [300, 300, 0], [30, 30, 30])
  // canvas.draw3Dmodels([
  //   [0, 0, 0],
  //   [30, 0, 0],
  //   [0, 150, 0],
  //   [0, 150, 0],
  //   [30, 0, 0],
  //   [30, 150, 0]], "#509bbc", 'fill', [300, 300, 0], [30, 30, 30])

  // canvas.draw3Dmodels([
  //   [30, 120, 0],
  //   [100, 120, 0],
  //   [30, 150, 0],
  //   [30, 150, 0],
  //   [100, 120, 0],
  //   [100, 150, 0]
  // ], "#509bbc", 'fill', [300, 300, 0], [30, 30, 30])

  // canvas.draw3Dmodels([
  //   [30, 60, 0],
  //   [67, 60, 0],
  //   [30, 90, 0],
  //   [30, 90, 0],
  //   [67, 60, 0],
  //   [67, 90, 0]
  // ], "#509bbc", 'fill', [300, 300, 0], [30, 30, 30])

}

main()

