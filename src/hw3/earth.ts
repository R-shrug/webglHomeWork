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
    let earth = new TextureSphereObject(earthTexture)
    earth.position.set(0, 0, 0)
    earth.scale.set(7, 7, 7)
    earth.color.set(0x4cd1e0)
    earth.material.diffuse = 3
    earth.material.specular = 0.5
    earth.material.ambient = 0.4
    
    
    // let mountain = new TextureSphereObject(earthTexture)
    // mountain.position.set(0, 5, -4)
    // mountain.scale.set(1, 2, 1)
    // mountain.color.set(0x4cd1e0)
    // mountain.rotation.setFromAxisAngle(Xunit,-Math.PI / 4)
    // mountain.material.diffuse = 3
    // mountain.material.specular = 0.5
    // mountain.material.ambient = 0.4
    // earth.addChild(mountain)  
    
  
    // let mountain1 = new TextureSphereObject(earthTexture)
    // mountain1.position.set(-1, 5, -4)
    // mountain1.scale.set(1, 3, 1)
    // mountain1.color.set(0x4cd1e0)
    // mountain1.rotation.setFromAxisAngle(Xunit,-Math.PI / 4)
    // mountain1.material.diffuse = 3
    // mountain1.material.specular = 0.5
    //   mountain1.material.ambient = 0.4
    //   earth.addChild(mountain1) 
  
    // let mountain2 = new TextureSphereObject(earthTexture)
    // mountain2.position.set(-0.5, 5, -3)
    // mountain2.scale.set(1, 1.8, 1)
    // mountain2.color.set(0x4cd1e0)
    // mountain2.rotation.setFromAxisAngle(Xunit,-Math.PI / 4)
    // mountain2.material.diffuse = 3
    // mountain2.material.specular = 0.5
    //   mountain2.material.ambient = 0.4
    //   earth.addChild(mountain2) 
  
  
    
  
    // let ironcube = new TextureCubeObject(ironTexture)
    // ironcube.position.set(4, 4, 0)
    // ironcube.scale.set(1, 3, 1)
    // ironcube.color.set(0x4cd1e0)
    // //ironcube.rotation.setFromAxisAngle(Yunit, -Math.PI / 3)
    // //ironcube.rotation.setFromAxisAngle(Xunit, Math.PI ) 
    // ironcube.rotation.setFromAxisAngle(Zunit, -Math.PI / 4) 
    // earth.addChild(ironcube) 
    
    
    // let ironcube1 = new TextureCubeObject(ironTexture) 
    // ironcube1.position.set(5, 4, 0)
    // ironcube1.scale.set(1, 4, 1)
    // ironcube1.color.set(0x4cd1e0)
    // ironcube1.rotation.setFromAxisAngle(Zunit, -Math.PI / 4)  
    // earth.addChild(ironcube1)
      
      this.addChild(this.earth)
    

    this.inited = true
  }

  inited = false

  animate(now: number, radius = 3) {
    if (!this.inited) return
    const n = now * 10
    //this.position.set(4, 6.2, Math.sin(Math.PI * n / 12) / 2 - 1)
    //   this.rotation.setFromAxisAngle(Zunit, n * Math.PI/2)
    this.setTransformDirty()
  }

}