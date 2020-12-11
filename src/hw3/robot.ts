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
    con.scale.set(0.22, 0.22, 0.22)
    con.color.set(0xf0f8ff)
    con.rotation.setFromAxisAngle(Zunit, Math.PI / 2)
    con.material.specular = 0.8
    con.material.diffuse = 0.3
    con.material.ambient=0.5
    this.head.addChild(con)

  
    this.angle = new SphereObject()
    this.angle.color.set(0xf0f8ff)
    this.angle.scale.set(0.05, 0.05, 0.1)
    this.angle.position.set(0.12, 0, 0.25)
    this.angle.rotation.setFromAxisAngle(Xunit, -Math.PI / 10)
    this.angle.material.specular = 0.8
    this.angle.material.diffuse = 0.3
    this.angle.material.ambient =0.5
    this.head.addChild(this.angle)
   
   this.miniangle = new SphereObject()
   this.miniangle.color.set(0x00bfff)
   this.miniangle.scale.set(0.03, 0.03, 0.2)
   this.miniangle.position.set(0.12, 0.01, 0.37)
   this.miniangle.rotation.setFromAxisAngle(Xunit, -Math.PI / 11)
    this. miniangle.material.ambient=1
     this.head.addChild(this.miniangle)  

     this. angle1 = new SphereObject()
     this.angle1.color.set(0xf0f8ff)
     this.angle1.scale.set(0.05, 0.05, 0.1)
     this.angle1.position.set(-0.12, 0, 0.25)
     this.angle1.rotation.setFromAxisAngle(Xunit, -Math.PI / 10)
     this.angle1.material.specular = 0.8
    this.angle1.material.diffuse = 0.3
    this.angle1.material.ambient =0.5
    this.head.addChild(this.angle1)
  
    this.miniangle1 = new SphereObject()
    this.miniangle1.color.set(0x00bfff)
    this.miniangle1.scale.set(0.03, 0.03, 0.2)
    this.miniangle1.position.set(-0.12, 0.01, 0.37)
    this.miniangle1.rotation.setFromAxisAngle(Xunit,-Math.PI / 11)
    this.miniangle1.material.ambient=1
    this.head.addChild(this.miniangle1)  


    this.legl = new SphereObject()
    this.legl.color.set(0x00bfff)
    this.legl.scale.set(0.02, 0.02, 0.06)
    this.legl.position.set(-0.12, 0, -0.25)
    this.legl.rotation.setFromAxisAngle(Xunit,Math.PI / 10)
    this.legl.material.ambient=1
    this.head.addChild(this.legl)
    
    this.legr = new SphereObject()
    this.legr.color.set(0x00bfff)
    this.legr.scale.set(0.02, 0.02, 0.06)
    this.legr.position.set(0.12, 0, -0.25)
    this.legr.rotation.setFromAxisAngle(Xunit, Math.PI / 10)
    this.legr.material.ambient=1
    this.head.addChild(this.legr) 

    

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
    this.miniangle.position.set(0.12, 0.01, 0.44 - Math.sin(Math.PI * n / 12) * 0.05)
    this.angle.position.set(0.12, 0, 0.32 - Math.sin(Math.PI * n / 12) * 0.05)
    this.miniangle1.position.set(-0.12, 0.01, 0.44 - Math.sin(Math.PI * n / 12) * 0.05)
    this.angle1.position.set(-0.12, 0, 0.32 -Math.sin(Math.PI * n / 12) * 0.05)
    this.setTransformDirty()
  }

}