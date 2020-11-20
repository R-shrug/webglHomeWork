import { Vector3 } from "../math/Vector3"
import { Quaternion } from "../math/Quaternion"
import { Matrix4 } from "../math/Matrix4"
import { Color } from "../math/Color"


export class DisplayObject {

  visible = true

  position = new Vector3()
  color = new Color()

  // 旋转
  rotation = new Quaternion()
  // 伸缩
  scale = new Vector3(1, 1, 1)
  // 平移
  transform = new Matrix4()

  private _transformDirty = true
  get transformDirty() { return this._transformDirty }

  // 视图矩阵及其逆的转制
  viewTransform = new Matrix4()

  
  viewTransformInvTrans = new Matrix4()

  private _colorDirty = true
  get colorDirty() { return this._colorDirty }

  parent?: Container

  plugin: string = ''

  setTransformDirty() {
    this._transformDirty = true
  }

  setColorDirty() {
    this._colorDirty = true
  }

  updateTransform() {
    if (!this.visible || !this._transformDirty) return
    // 模型矩阵生成
    this.transform.compose(this.position, this.rotation, this.scale)

    if (this.parent) {
      this.viewTransform.multiplyMatrices(this.parent.viewTransform, this.transform)
    } else {
      this.viewTransform.copy(this.transform)
    }
    this.viewTransformInvTrans.getInverse(this.viewTransform, true).transpose()

    this._transformDirty = false
  }
}

export class Container extends DisplayObject {
  children: Array<DisplayObject> = []

  addChild(...objs: Array<DisplayObject>) {
    objs.forEach(c => {
      if (c.parent) {
        if (c.parent === this) return
        c.parent.removeChild(c)
      }
      this.children.push(c)
      c.parent = this
      c.setTransformDirty()
    })
  }

  removeChild(...objs: Array<DisplayObject>) {
    objs.forEach(c => {
      if (c.parent !== this) return
      c.parent = undefined
      const i = this.children.indexOf(c)
      if (i >= 0)
        this.children.splice(i, 1)
    })
  }

  setColorDirty() {
    super.setColorDirty()
    this.children.forEach(c => c.setColorDirty())
  }

  setTransformDirty() {
    super.setTransformDirty()
    this.children.forEach(c => c.setTransformDirty())
  }

  updateTransform() {
    super.updateTransform()
    this.children.forEach(c => c.updateTransform())
  }
}
