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
  target = new Vector3(0, 0, 0)

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
    const arg = (typeof x === "number" ? new Vector3(x, y, z) : x)
    if (this.target.x != arg.x || this.target.y != arg.y || this.target.z != arg.z) {
      this.setControlledDirty()
    }
    this.target = typeof x === "number" ? new Vector3(x, y, z) : x
    this.rotation.setFromRotationMatrix(new Matrix4().lookAt(this.position, this.target, new Vector3(...this.target.toArray().map(e => Math.abs(e))).normalize()))
    this.setTransformDirty()
    return this
  }

  private _transformDirty = true
  protected _controlledDirty = true

  get transformDirty() { return this._transformDirty }
  setTransformDirty() {
    this._transformDirty = true
  }
  setControlledDirty() {
    this._controlledDirty = true
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
  constructor(canvas: HTMLCanvasElement, movable: boolean, min?: number, max?: number) {
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
    this.movable = movable
    this.min = min ? min : 5
    this.max = max ? max : 1000
  }
  movable: boolean
  input: BaseInputHandler
  min: number
  max: number = 1000

  state = {
    up: false,
    down: false,
    front: false,
    back: false,
    left: false,
    right: false,
  }

  setLookAt(x: number | Vector3, y?: number, z?: number) {
    super.setLookAt(x, y, z)
    if (this._controlledDirty) {
      this.path = this.position.clone().sub(this.target)
      this.front = new Vector3().crossVectors(this.path, this.target).normalize()
      this._controlledDirty = false
    }
    return this
  }

  lastMousePosition: { x: number, y: number } | null = null

  path: Vector3 = new Vector3().sub(this.target)
  front: Vector3 = new Vector3().crossVectors(this.path, this.target).normalize()

  update(seconds: number) {
    if (this.movable) {
      const front = new Vector3(0, 0, -1).applyQuaternion(this.rotation).setZ(0).normalize()
      const up = new Vector3(0, 0, 1)
      const left = up.clone().cross(front)
      this.position.addScaledVector(front, (<any>this.state.front - <any>this.state.back) * seconds * 10)
      this.position.addScaledVector(up, (<any>this.state.up - <any>this.state.down) * seconds * 10)

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
    } else {
      this.position.applyAxisAngle(this.target.clone().normalize(), (<any>this.state.left - <any>this.state.right) * seconds * 2)
      if (!!(<any>this.state.left - <any>this.state.right) || !!(<any>this.state.up - <any>this.state.down)) {
        this.setControlledDirty()
      }
      const eps = 0.1
      const pClone = this.position.clone().normalize()
      const tClone = this.target.clone().normalize()
      if (!(Math.abs(pClone.x - tClone.x) < eps
        && Math.abs(pClone.y - tClone.y) < eps
        && Math.abs(pClone.z - tClone.z) < eps)
        || <any>this.state.front - <any>this.state.back < 0) {
        this.position.applyAxisAngle(this.front, (<any>this.state.front - <any>this.state.back) * seconds * 2)
        const newPath = this.position.clone().sub(this.target)
        this.position.sub(newPath).add(newPath.setLength(this.path.length()))
      }

      if (((this.path.x ** 2 + this.path.y ** 2 + this.path.z ** 2 > this.min ** 2)
        || (<any>this.state.up - <any>this.state.down) < 0) &&
        ((this.path.x ** 2 + this.path.y ** 2 + this.path.z ** 2 < this.max ** 2)
          || (<any>this.state.up - <any>this.state.down) > 0))
        this.position.sub(this.path.clone().normalize().multiplyScalar((<any>this.state.up - <any>this.state.down) * seconds * 100))
      if (this.input.state.rightholding) {
        if (this.lastMousePosition) {
          const dx = this.input.state.x - this.lastMousePosition.x
          const dy = this.input.state.y - this.lastMousePosition.y
          this.position.applyAxisAngle(this.target.clone().normalize(), -dx / 150)
          if (!!(-dx / 150)) {
            this.setControlledDirty()
          }

          if (!(Math.abs(pClone.x - tClone.x) < eps
            && Math.abs(pClone.y - tClone.y) < eps
            && Math.abs(pClone.z - tClone.z) < eps)
            || dy < 0) {
            this.position.applyAxisAngle(this.front, dy / 150)
            const newPath = this.position.clone().sub(this.target)
            this.position.sub(newPath).add(newPath.setLength(this.path.length()))
          }
        }
        this.lastMousePosition = { ...this.input.state }
      } else {
        this.lastMousePosition = null
      }
      this.setLookAt(this.target)
    }
    this.setTransformDirty()
  }

}
