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
import {robot} from "./robot"
import earthSrc from "../assets/mountain.jpg"
import ironSrc from "../assets/ironcube.jpg"
import "../../utils/draw/3D_model/index"
import { ShadowTexurePlugin } from "../../utils/plugins/ShadowTexture"
import { TextureCubeObject } from "../../utils/shapes/TextureCube"
import { Vector3 } from "../../utils/math/Vector3"
import { theEarth } from "./earth"

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
  const camera = new ControlledCamera(canvas, false, 7, 40)

  const lightBall = new LightBall(gl)
  const Robot = new robot(gl)
  //Robot.position.set(4, 6.2, -1)
  Robot.rotation.setFromAxisAngle(Zunit,-Math.PI/5)
  const Earth = new theEarth(gl)
  Earth.position.set(0,0,0)
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
  const ironTexture = new TextureBase(gl, await LoadImageAsync(ironSrc))
  

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
   
    light.position.set( 0.8*lightBall.sun.position.x,  0.8* lightBall.sun.position.y, 0.8 * lightBall.position.z)
    light.setLookAt(0, 0, 0)
    
    document.body.style.backgroundImage = "linear-gradient(-" + lightBall.theta / (2 * Math.PI) * 360 + "deg, #cdd1d3,#1677b3,#131824 55%,#0B1013)"
    camera.update(dt)
    //earth.rotation.setFromAxisAngle(Zunit, now * Math.PI)
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

  //stage.addChild(earth,mountain,mountain1,mountain2,ironcube,ironcube1)
  stage.addChild(lightBall,Robot,Earth)

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

