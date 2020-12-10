import { Container, DisplayObject } from "../../utils/core/displayObject";
import { TextureBase } from "../../utils/core/texture";
import { TextureSphereObject } from "../../utils/plugins/TextureSphere";
import { LoadImageAsync } from "../../utils/helpers/asyncLoad";
import { SphereObject } from "../../utils/shapes/Sphere";
import { Vector3 } from "../../utils/math/Vector3";
import headSrc from "../assets/nono.png";



const Xunit = new Vector3(1, 0, 0)
const Yunit = new Vector3(0, 1, 0)
const Zunit = new Vector3(0, 0, 1)


export class robot extends Container {
  constructor(gl: WebGLRenderingContext) {
    super()
    this.load(gl)
  }

  //originPosition: Vector3 = new Vector3(0, 0, 0)
  
  head!: Container;
  angle1!: SphereObject;
  angle!: SphereObject;
  miniangle!:SphereObject;
  miniangle1!: SphereObject;
  legl!: SphereObject;
  legr!: SphereObject;
  

 

  async load(gl: WebGLRenderingContext) {

    const headTexture = new TextureBase(gl, await LoadImageAsync(headSrc))

    this.head = new Container()
    const con = new TextureSphereObject(headTexture)
    con.position.set(0, 0, 0)
    con.scale.set(0.2, 0.2, 0.25)
    con.color.set(0xf0f8ff)
    con.rotation.setFromAxisAngle(Zunit, Math.PI / 2)
    this.head.addChild(con)

  
    const angle = new SphereObject()
    angle.color.set(0xf0f8ff)
    angle.scale.set(0.05, 0.05, 0.1)
    angle.position.set(0.12, 0, 0.25)
    angle.rotation.setFromAxisAngle(Xunit, -Math.PI / 10)
    //angle.rotation.setFromAxisAngle(Yunit, Math.PI / 10)
    this.head.addChild(angle)
   
   const miniangle = new SphereObject()
     miniangle.color.set(0x00bfff)
     miniangle.scale.set(0.03, 0.03, 0.2)
     miniangle.position.set(0.12, 0.01, 0.37)
    miniangle.rotation.setFromAxisAngle(Xunit, -Math.PI / 11)
    //miniangle.rotation.setFromAxisAngle(Yunit, Math.PI / 11)
     this.head.addChild(miniangle)  

    const angle1 = new SphereObject()
    angle1.color.set(0xf0f8ff)
    angle1.scale.set(0.05, 0.05, 0.1)
    angle1.position.set(-0.12, 0, 0.25)
    angle1.rotation.setFromAxisAngle(Xunit,-Math.PI / 10)
    this.head.addChild(angle1)
  
    const miniangle1 = new SphereObject()
    miniangle1.color.set(0x00bfff)
    miniangle1.scale.set(0.03, 0.03, 0.2)
    miniangle1.position.set(-0.12, 0.01, 0.37)
    miniangle1.rotation.setFromAxisAngle(Xunit,-Math.PI / 11)
    this.head.addChild(miniangle1)  


    const legl = new SphereObject()
    legl.color.set(0x00bfff)
    legl.scale.set(0.02, 0.02, 0.05)
    legl.position.set(-0.12, 0, -0.25)
    legl.rotation.setFromAxisAngle(Xunit,Math.PI / 10)
    this.head.addChild(legl)
    
    const legr = new SphereObject()
    legr.color.set(0x00bfff)
    legr.scale.set(0.02, 0.02, 0.05)
    legr.position.set(0.12, 0, -0.25)
    legr.rotation.setFromAxisAngle(Xunit,Math.PI / 10)
    this.head.addChild(legr) 

    

    this.head.position.set(0, 0, 0)
    //this.angle.position.set(0,0,0)
    //this.head.rotation.setFromAxisAngle(Yunit, -Math.PI / 9)
    this.head.rotation.setFromAxisAngle(Xunit, -Math.PI / 2)


    this.addChild(this.head)
    

    this.inited = true
  }

  inited = false

  animate(now: number, radius = 3) {
    if (!this.inited) return
    const n = now * 10
    this.position.set(4, 6.2, Math.sin(Math.PI * n / 12) / 2 - 1)
    
    this.setTransformDirty()
  }

}