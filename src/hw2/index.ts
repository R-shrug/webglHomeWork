import { Canvas } from "../../utils/canvas"
import { Camera, ControlledCamera } from "../../utils/core/camera"
import { DepthTextureTarget, CanvasTarget } from "../../utils/core/renderTarget"
import { RenderContext, Renderer } from "../../utils/core/render"
import { Container } from "../../utils/core/displayObject"
import { ShadowTexurePlugin } from "../../utils/plugins/ShadowTexture"
import { resizeCanvas } from "../../utils/helpers/WebGlUtils"
import { Vector3 } from "../../utils/math/Vector3"
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
    .setPosition(9, 12, 5)
    .setLookAt(1, 4, 2)

  let prev = performance.now() / 1000

  function update(now: number) {
    now = now / 1000
    const dt = now - prev
    if (resizeCanvas(gl, canvas))
      camera.setViewPort(canvas.width / canvas.height)

    camera.update(dt)
    dragon.animate(now, Math.PI * 2);
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


  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

  function tick(now: number) {
    requestAnimationFrame(tick)
    update(now)
    light.updateTransform()
    // renderer.render(depthtarget, stage, context, true, ShadowTexurePlugin.PluginName)
    renderer.render(canvastarget, stage, context, true)
  }

  requestAnimationFrame(tick)
}

main()

