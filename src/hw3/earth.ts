import { Container, DisplayObject } from "../../utils/core/displayObject";
import { TextureBase } from "../../utils/core/texture";
import { TextureSphereObject } from "../../utils/plugins/TextureSphere";
import { LoadImageAsync } from "../../utils/helpers/asyncLoad";
import { SphereObject } from "../../utils/shapes/Sphere";
import { Vector3 } from "../../utils/math/Vector3";
import headSrc from "../assets/nono.png";
import earthSrc from "../assets/mountain.jpg"
import ironSrc from "../assets/ironcube.jpg"
import { TextureCubeObject } from "../../utils/shapes/TextureCube";


const Xunit = new Vector3(1, 0, 0)
const Yunit = new Vector3(0, 1, 0)
const Zunit = new Vector3(0, 0, 1)


export class theEarth extends Container {
  constructor(gl: WebGLRenderingContext) {
    super()
    this.load(gl)
  }

  //originPosition: Vector3 = new Vector3(0, 0, 0)
  
  earth!: Container;
  

  async load(gl: WebGLRenderingContext) {
    const earthTexture = new TextureBase(gl, await LoadImageAsync(earthSrc))
    const ironTexture = new TextureBase(gl, await LoadImageAsync(ironSrc))
    this.earth = new TextureSphereObject(earthTexture)
    this.earth.position.set(0, 0, 0)
    this.earth.scale.set(7, 7, 7)
    this.earth.color.set(0x4cd1e0)

    
    
     let mountain = new TextureSphereObject(earthTexture)
     mountain.position.set(0, 0, 0)
     mountain.scale.set(0.3, 1.2, 0.3)
     mountain.color.set(0x4cd1e0)
     mountain.rotation.setFromAxisAngle(Xunit,-Math.PI / 4)
     this.earth.addChild(mountain)  
    
  
     let mountain1 = new TextureSphereObject(earthTexture)
    mountain1.position.set(0.1, 0.2, 0.1 )
    mountain1.scale.set(0.3, 1, 0.3)
    mountain1.color.set(0x4cd1e0)
    mountain1.rotation.setFromAxisAngle(Xunit,-Math.PI / 4)
      this.earth.addChild(mountain1) 
  
    let mountain2 = new TextureSphereObject(earthTexture)
    mountain2.position.set(-0.1, 0.2, -0.1)
    mountain2.scale.set(0.3, 0.9, 0.3)
    mountain2.color.set(0x4cd1e0)
    mountain2.rotation.setFromAxisAngle(Xunit,-Math.PI / 4)
      this.earth.addChild(mountain2) 
  
  
    
  
    let ironcube = new TextureCubeObject(ironTexture)
    ironcube.position.set(0.5, 0.5, 0)
    ironcube.scale.set(0.4, 0.1, 0.1)
    ironcube.color.set(0x4cd1e0)
    //ironcube.rotation.setFromAxisAngle(Yunit, -Math.PI / 3)
    //ironcube.rotation.setFromAxisAngle(Xunit, -Math.PI/2 ) 
      ironcube.rotation.setFromAxisAngle(Zunit, Math.PI / 4) 
      ironcube.material.ambient = 0.2
      ironcube.material.specular = 2
      ironcube.material.diffuse= 4
    this.earth.addChild(ironcube) 
    
    
    let ironcube1 = new TextureCubeObject(ironTexture) 
    ironcube1.position.set(0.5, 0.38, 0)
    ironcube1.scale.set(0.6, 0.1, 0.1)
    ironcube1.color.set(0x4cd1e0)
      ironcube1.rotation.setFromAxisAngle(Zunit, Math.PI / 4)
      ironcube1.material.ambient = 0.2
      ironcube1.material.specular = 2
      ironcube1.material.diffuse= 4  
    this.earth.addChild(ironcube1)
      
      this.addChild(this.earth)
    

    this.inited = true
  }

  inited = false

  animate(now: number, radius = 3) {
    if (!this.inited) return
    const n = now * 10
    //this.position.set(4, 6.2, Math.sin(Math.PI * n / 12) / 2 - 1)
       this.rotation.setFromAxisAngle(Xunit, -n * Math.PI/100)
    this.setTransformDirty()
  }

}