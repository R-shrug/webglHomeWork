import { Container, DisplayObject } from "../../utils/core/displayObject";
import { TextureBase } from "../../utils/core/texture";
import { TextureSphereObject } from "../../utils/plugins/TextureSphere";
import { LoadImageAsync } from "../../utils/helpers/asyncLoad";
import { SphereObject } from "../../utils/shapes/Sphere";
import { Vector3 } from "../../utils/math/Vector3";
import headSrc from "../assets/skin.png"


function wrapContainer(obj: DisplayObject | (() => DisplayObject)) {
  const c = new Container()
  const o = obj instanceof DisplayObject ? obj : obj()
  c.addChild(o)
  return c
}

const Xunit = new Vector3(1, 0, 0)
const Yunit = new Vector3(0, 1, 0)
const Zunit = new Vector3(0, 0, 1)


export class Dragonz extends Container {
  constructor(gl: WebGLRenderingContext) {
    super()
    this.load(gl)
  }

  originPosition: Vector3 = new Vector3(0, 0, 0)
  leftWing!: Container
  rightWing!: Container;
  body!: Container
  leg!: Container
  head!: Container

  async load(gl: WebGLRenderingContext) {
    const texture = new TextureBase(gl, await LoadImageAsync(headSrc))

    this.leftWing = new SphereObject()
    this.leftWing.position.set(0, -1.25, 0.55)
    this.leftWing.scale.set(0.25, 0.25, 0.8)
    this.leftWing.color.set(0x619ebf)

    this.rightWing = new SphereObject()
    this.rightWing.position.set(0, 1.25, 0.55)
    this.rightWing.scale.set(0.25, 0.25, 0.8)
    this.rightWing.color.set(0x619ebf)

    this.leg = new SphereObject()
    this.leg.position.set(0.2, 0, -1.42)
    this.leg.scale.set(0.25, 0.25, 0.62)
    this.leg.color.set(0x619ebf)
    this.leg.rotation.setFromAxisAngle(Yunit, -Math.PI / 10)

    this.head = new Container()
    const con = new TextureSphereObject(texture)
    con.position.set(0, 0, 1.5)
    con.scale.set(0.6, 0.5, 0.5)
    con.rotation.setFromAxisAngle(Yunit, -Math.PI / 15)
    this.head.addChild(con)

    const mouth = new SphereObject()
    mouth.color.set(0x619ebf)
    mouth.scale.set(0.5, 0.2, 0.1)
    mouth.position.set(0.8, 0, 1.5)
    this.head.addChild(mouth)

    const angle = new SphereObject()
    angle.color.set(0xc55d6e)
    angle.scale.set(0.1, 0.1, 0.5)
    angle.position.set(0, 0, 1.9)
    this.head.addChild(angle)

    this.head.position.set(0.5, -0.2, -0.13)
    this.head.rotation.setFromAxisAngle(Yunit, -Math.PI / 9)
    this.head.rotation.setFromAxisAngle(Xunit, -Math.PI / 20)

    this.body = wrapContainer(() => {
      const con = new SphereObject()
      con.color.set(0x619ebf)
      con.scale.set(0.55, 0.55, 0.7)
      return con
    })
    this.addChild(this.body, this.leftWing, this.rightWing, this.head, this.leg)

    this.inited = true
  }

  inited = false

  animate(now: number, radius = 3) {
    if (!this.inited) return
    const n = now * 10
    const { leftWing, rightWing, leg } = this
    this.position.set(0 + this.originPosition.x, 0 + this.originPosition.y, this.originPosition.z + Math.sin(Math.PI * n / 12) / 2 - 1)
    leg.rotation.setFromAxisAngle(Yunit, Math.sin(Math.PI * n / 12) / 5)
    leg.position.set(-Math.sin(Math.PI * n / 12) / 5, 0, -1.42)
    leftWing.position.set(0, -(1.25 + Math.sin(Math.PI * n / 12) * 0), 0.55 - Math.sin(Math.PI * n / 12) * 0.22)
    leftWing.rotation.setFromAxisAngle(Xunit, Math.PI * 3 / 8 + Math.PI / 8 * Math.sin(Math.PI * n / 12))
    rightWing.position.set(0, (1.25 + Math.sin(Math.PI * n / 12) * 0), 0.55 - Math.sin(Math.PI * n / 12) * 0.22)
    rightWing.rotation.setFromAxisAngle(Xunit, -(Math.PI * 3 / 8 + Math.PI / 8 * Math.sin(Math.PI * n / 12)))
    this.setTransformDirty()
  }

}