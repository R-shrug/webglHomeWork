import { GameEvent } from "../helpers/gameEvent";
import { Matrix4 } from "../math/Matrix4";
import { Vector3 } from "../math/Vector3";
import { Camera } from "./camera";


function addAutoListener<K extends keyof HTMLElementEventMap>(
  target: HTMLElement,
  event: K,
  listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any,
  options?: boolean | AddEventListenerOptions) {

  const l = function (this: HTMLElement, ev: HTMLElementEventMap[K]) {
    const ret = listener.call(this, ev)
    if (ret === "remove") target.removeEventListener(event, l)
  }

  target.addEventListener(event, l, options)
}

type MouseState = {
  x: number
  y: number
  leftholding: boolean
  rightholding: boolean
}

export class BaseInputHandler {
  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas

    addAutoListener(canvas, "mousemove", (e) => {
      this.state.x = e.x
      this.state.y = e.y
      this.mouseEvent.emit("move", e)
      return this.disposed && "remove"
    })
    addAutoListener(canvas, "mousedown", (e) => {
      const p = e.button === 0 ? "leftholding" : "rightholding"
      this.state[p] = true
      this.mouseEvent.emit("down", e)
      return this.disposed && "remove"
    })
    addAutoListener(canvas, "mouseup", (e) => {
      const p = e.button === 0 ? "leftholding" : "rightholding"
      this.state[p] = false
      this.mouseEvent.emit("up", e)
      return this.disposed && "remove"
    })
    addAutoListener(canvas, "mouseout", (e) => {
      this.state.leftholding = false
      this.state.rightholding = false
      this.mouseEvent.emit("up", e)
      return this.disposed && "remove"
    })
    addAutoListener(canvas, "mouseleave", (e) => {
      this.state.leftholding = false
      this.state.rightholding = false
      this.mouseEvent.emit("up", e)
      return this.disposed && "remove"
    })
    addAutoListener(window as any, "keydown", (e) => {
      this.keyEvent.emit("down", e)
      return this.disposed && "remove"
    })
    addAutoListener(window as any, "keyup", (e) => {
      this.keyEvent.emit("up", e)
      return this.disposed && "remove"
    })

    addAutoListener(window as any, "contextmenu", e => {
      e.preventDefault()
    })
  }
  canvas: HTMLCanvasElement

  state: MouseState = { x: 0, y: 0, leftholding: false, rightholding: false }

  mouseEvent = new GameEvent<["down" | "up" | "move", MouseEvent]>()
  keyEvent = new GameEvent<["down" | "up", KeyboardEvent]>()

  disposed = false
}

export class CameraInputHandler extends BaseInputHandler {

  camera: Camera

  constructor(canvas: HTMLCanvasElement, camera: Camera) {
    super(canvas)
    this.camera = camera
  }

  cachedViewMat = new Matrix4()
  viewInverseMat = new Matrix4()

  getVirtualTarget(eventX: number, eventY: number) {
    const { clientWidth, clientHeight } = this.canvas
    const normalX = eventX / clientWidth * 2 - 1
    const normalY = 1 - eventY / clientHeight * 2
    this.refreshInvMat()
    const target = new Vector3(normalX, normalY, 0).applyMatrix4(this.viewInverseMat)
    return target
  }

  private refreshInvMat() {
    const { elements } = this.camera.viewTransformMatrix
    let equal = true
    for (let i = 0; i < elements.length; i++) {
      if (elements[i] !== this.cachedViewMat.elements[i]) {
        equal = false
        break
      }
    }
    if (!equal) {
      this.cachedViewMat.copy(this.camera.viewTransformMatrix)
      this.viewInverseMat.getInverse(this.cachedViewMat)
    }
  }
}

