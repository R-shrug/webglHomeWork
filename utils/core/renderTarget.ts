import { TextureBase } from "./texture"

export abstract class RenderTarget {
  gl: WebGLRenderingContext
  constructor(gl: WebGLRenderingContext) { this.gl = gl }
  bind() { }
  width: number = 0
  height: number = 0
}

export class CanvasTarget extends RenderTarget {

  canvas: HTMLCanvasElement | OffscreenCanvas

  constructor(gl: WebGLRenderingContext) {
    super(gl)
    this.canvas = gl.canvas
    this.width = this.canvas.width
    this.height = this.canvas.height
  }

  bind() {
    const { gl } = this
    this.width = this.canvas.width
    this.height = this.canvas.height
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    gl.viewport(0, 0, this.width, this.height)
  }
}

export class TextureTarget extends RenderTarget {

  texture: TextureBase | null
  private framebuffer: WebGLFramebuffer | null
  private depthbuffer?: WebGLRenderbuffer | null

  constructor(gl: WebGLRenderingContext, width: number, height: number, depth = false) {
    super(gl)
    this.width = width
    this.height = height

    const texture = new TextureBase(gl, undefined, width, height)
    this.texture = texture

    const framebuffer = gl.createFramebuffer()
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer)
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture.texture, 0)
    this.framebuffer = framebuffer

    if (depth) {
      const depthbuffer = gl.createRenderbuffer()
      gl.bindRenderbuffer(gl.RENDERBUFFER, depthbuffer)
      gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height)
      gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthbuffer)
      this.depthbuffer = depthbuffer
    }
  }

  bind() {
    const { gl } = this
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer)
    gl.viewport(0, 0, this.width, this.height)
  }
}

export class DepthTextureTarget extends RenderTarget {

  texture: WebGLTexture | null
  framebuffer: WebGLFramebuffer | null

  constructor(gl: WebGLRenderingContext,
    public width = 2000, public height = 2000) {
    super(gl)
    const ext = gl.getExtension("WEBGL_depth_texture")
    if (!ext) throw new Error("Depth texture not supported")

    const depthTexture = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, depthTexture)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.DEPTH_COMPONENT,
      width, height, 0, gl.DEPTH_COMPONENT, gl.UNSIGNED_INT, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

    const depthFramebuffer = gl.createFramebuffer()
    gl.bindFramebuffer(gl.FRAMEBUFFER, depthFramebuffer)
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT,
      gl.TEXTURE_2D, depthTexture, 0)

    this.texture = depthTexture
    this.framebuffer = depthFramebuffer
  }

  bind() {
    const { gl } = this
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer)
    gl.viewport(0, 0, this.width, this.height)
  }
}
