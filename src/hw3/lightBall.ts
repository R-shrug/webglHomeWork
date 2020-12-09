import { Container, DisplayObject } from "../../utils/core/displayObject";
import { TextureBase } from "../../utils/core/texture";
import { TextureSphereObject } from "../../utils/plugins/TextureSphere";
import { LoadImageAsync } from "../../utils/helpers/asyncLoad";
import { SphereObject } from "../../utils/shapes/Sphere";
import { Vector3 } from "../../utils/math/Vector3";
import sunSrc from "../assets/sun.jpg"
import moonSrc from "../assets/moon.jpg"

// function wrapContainer(obj: DisplayObject | (() => DisplayObject)) {
//   const c = new Container()
//   const o = obj instanceof DisplayObject ? obj : obj()
//   c.addChild(o)
//   return c
// }


export class LightBall extends Container {
  constructor(gl: WebGLRenderingContext) {
    super()
    this.load(gl)
  }

  sun!: TextureSphereObject
  moon!: TextureSphereObject
  moonTexture!: TextureBase
  sunTexture!: TextureBase

  async load(gl: WebGLRenderingContext) {
    this.sunTexture = new TextureBase(gl, await LoadImageAsync(sunSrc))

    this.moonTexture = new TextureBase(gl, await LoadImageAsync(moonSrc))

    this.sun = new TextureSphereObject(this.sunTexture)
    this.sun.position.set(12, 0, 0)
    this.sun.scale.set(5, 5, 5)
    this.sun.material.ambient = 1
    this.sun.material.diffuse = 0.8
    this.sun.material.specular=0.3

    this.moon = new TextureSphereObject(this.moonTexture)
    this.moon.position.set(2, 2, 0)
    this.moon.scale.set(0.3, 0.3, 0.3)
    
    this.addChild(this.sun)
    this.addChild(this.moon)
    

    this.inited = true
  }

  inited = false

  theta = 0
  thetb=0

  animate(now: number, speed = 1) {
    if (!this.inited) return
    const n = now * 10 * speed
    const m =now *2*speed
    this.theta = (this.theta + (n / 360 * 2 * Math.PI)) % (2 * Math.PI)
    this.thetb=(this.theta + (m/ 360 * 2 * Math.PI)) % (2 * Math.PI)
    // if(this.theta < Math.PI/2 || this.theta > 3 * Math.PI/2)
    //     this.sun.data.texture=this.moonTexture
    // else
    //     this.sun.data.texture=this.sunTexture
    
    // this.sun.rotation.set(0,0,s,Math.cos(this.theta))
    console.log(this.theta)

    this.sun.position.set(12*Math.cos(this.theta),12*Math.sin(this.theta),0)
    this.moon.position.set(-2*Math.cos(this.thetb),-5*Math.sin(this.thetb),0)
    this.setTransformDirty()
  }

}