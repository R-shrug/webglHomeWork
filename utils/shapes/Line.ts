import { Container } from "../core/displayObject"
import { SolidLinePlugin, ISolideLineObject } from "../plugins/SolidLine"
import { Vector3 } from "../math/Vector3"
import { BindableBuffer } from "../core/bindableBuffer"

export class LineObject extends Container implements ISolideLineObject {

  plugin = SolidLinePlugin.PluginName

  setTo(x: number | Vector3, y: number, z: number) {
    if (typeof x === "number") {
      this.buffer[3] = x
      this.buffer[4] = y
      this.buffer[5] = z
    } else {
      this.buffer[3] = x.x
      this.buffer[4] = x.y
      this.buffer[5] = x.z
    }
    this.bindablebuffer.dirty = true
  }

  private buffer = new Float32Array([0, 0, 0, 1, 0, 0])

  private bindablebuffer = new BindableBuffer(this.buffer.buffer)

  data = {
    positionBuffer: this.bindablebuffer,
    points: 2,
  }
}