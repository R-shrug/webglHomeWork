import { Vector3 } from "../math/Vector3"
import { Quaternion } from "../math/Quaternion"
import { Matrix4 } from "../math/Matrix4"
import { BaseInputHandler } from "./inputHandler"
import { _Math } from "../math/Math"

const UpVector = new Vector3(0, 0, 1)

export class Camera {
  rotation = new Quaternion()
  position = new Vector3()
  projection = new Matrix4()


  setViewPort(aspect: number, viewRange?: number, far = 100) {
    if (!viewRange || viewRange <= 0)
      viewRange = Math.PI / 2
    else if (viewRange >= Math.PI)
      viewRange = Math.PI / 2

    const f = 1 / Math.tan(viewRange / 2)
    this.projection.set(
      f, 0, 0, 0,
      0, f * aspect, 0, 0,
      0, 0, -1 / far, -1,
      0, 0, -1, 0
    )
    this.setTransformDirty()
    return this
  }

  setPosition(x: number | Vector3, y: number, z: number) {
    if (typeof x === "number")
      this.position.set(x, y, z)
    else
      this.position.copy(x)
    this.setTransformDirty()
    return this
  }

  setLookAt(x: number | Vector3, y?: number, z?: number) {
    const target = typeof x === "number" ? new Vector3(x, y, z) : x
    this.rotation.setFromRotationMatrix(new Matrix4().lookAt(this.position, target, UpVector))
    this.setTransformDirty()
    return this
  }

  private _transformDirty = true
  get transformDirty() { return this._transformDirty }
  setTransformDirty() {
    this._transformDirty = true
  }

  viewTransformMatrix = new Matrix4()

  updateTransform() {
    if (!this._transformDirty) return

    const translateMat = new Matrix4().setPosition(this.position.clone().negate())
    const lootatMat = new Matrix4().makeRotationFromQuaternion(this.rotation).transpose()

    this.viewTransformMatrix.multiplyMatrices(this.projection,
      lootatMat.multiply(translateMat))

    this._transformDirty = false
  }
}

export class ControlledCamera extends Camera {
  constructor(canvas: HTMLCanvasElement) {
    super()
    this.input = new BaseInputHandler(canvas)
    this.input.keyEvent.add((state: any, event: any) => {
      switch (event.key.toLowerCase()) {
        case "w": this.state.front = state === "down"; break
        case "s": this.state.back = state === "down"; break
        case "a": this.state.left = state === "down"; break
        case "d": this.state.right = state === "down"; break
        case " ": this.state.up = state === "down"; break
        case "shift": this.state.down = state === "down"; break
      }
    })
  }

  input: BaseInputHandler

  state = {
    up: false,
    down: false,
    front: false,
    back: false,
    left: false,
    right: false,
  }

  lastMousePosition: { x: number, y: number } | null = null

  update(seconds: number) {
    const front = new Vector3(0, 0, -1).applyQuaternion(this.rotation).setZ(0).normalize()
    const up = new Vector3(0, 0, 1)
    const left = up.clone().cross(front)

    this.position.addScaledVector(front, (<any>this.state.front - <any>this.state.back) * seconds * 10)
    this.position.addScaledVector(up, (<any>this.state.up - <any>this.state.down) * seconds * 10)
    this.position.addScaledVector(left, (<any>this.state.left - <any>this.state.right) * seconds * 10)

    if (this.input.state.rightholding) {
      if (this.lastMousePosition) {
        const dx = this.input.state.x - this.lastMousePosition.x
        const dy = this.input.state.y - this.lastMousePosition.y
        this.rotation.multiply(new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), -dx / 300))
        this.rotation.multiply(new Quaternion().setFromAxisAngle(new Vector3(1, 0, 0), -dy / 300))
        this.rotation.setFromRotationMatrix(
          new Matrix4().lookAt(
            this.position, new Vector3(0, 0, -1).applyQuaternion(this.rotation).add(this.position), up))
      }
      this.lastMousePosition = { ...this.input.state }
    } else {
      this.lastMousePosition = null
    }
    this.setTransformDirty()
  }

}
