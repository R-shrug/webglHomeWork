import { DisplayObject, Container } from "./displayObject"
import { Camera } from "./camera"
import { RenderTarget } from "./renderTarget"

export type RenderContext = {
  camera: Camera
  light?: Camera

  shadowTexture?: WebGLTexture
}

export abstract class RendererPlugin {
  gl: WebGLRenderingContext
  constructor(gl: WebGLRenderingContext) { this.gl = gl }
  renderObject(object: DisplayObject, context: RenderContext) { }
}

const registeredplugins: Record<string, new (gl: WebGLRenderingContext) => RendererPlugin> = {}

export function RegisterPlugin(name: string, constructor: new (gl: WebGLRenderingContext) => RendererPlugin) {
  registeredplugins[name] = constructor
}

export class Renderer {

  gl: WebGLRenderingContext

  constructor(gl: WebGLRenderingContext) { this.gl = gl }

  plugins: Record<string, RendererPlugin> = {}

  private _render(obj: DisplayObject, context: RenderContext, enforcePlugin?: string) {
    if (!obj.visible) return
    const plugin = this.getRenderPlugin(enforcePlugin || obj.plugin)
    if (plugin) {
      plugin.renderObject(obj, context)
    }
    if (obj instanceof Container) {
      obj.children.forEach(c => this._render(c, context, enforcePlugin))
    }
  }

  private getRenderPlugin(name: string) {
    if (!name) return undefined
    const { gl, plugins } = this
    let plugin = plugins[name]
    if (!plugin) {
      const rp = registeredplugins[name]
      if (rp) {
        plugin = new rp(gl)
        plugins[name] = plugin
      }
    }
    return plugin
  }

  render(target: RenderTarget, stage: Container, context: RenderContext, clear = false, enforcePlugin?: string) {
    const { gl } = this
    stage.updateTransform()
    context.camera.updateTransform()
    if (context.light) context.light.updateTransform()
    target.bind()
    if (clear) gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    this._render(stage, context, enforcePlugin)
  }
}
