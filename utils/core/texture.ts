type TexImageSource = ImageBitmap | ImageData | HTMLImageElement | HTMLCanvasElement | HTMLVideoElement | OffscreenCanvas;

export class TextureBase {

  gl: WebGLRenderingContext

  constructor(gl: WebGLRenderingContext, source?: TexImageSource, width?: number, height?: number) {

    this.width = width ? width : source?.width
    this.height = height ? height : source?.height

    const texture = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)//平铺使用边缘值
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)//滤镜取点，最近的像素值



    this.texture = texture
    this.gl = gl

    this.loadData(source)
  }

  loadData(source: any) {
    const { gl } = this

    gl.bindTexture(gl.TEXTURE_2D, this.texture)
    if (!source)
      if (!this.width || !this.height)
        throw new Error('undefined TextureBase')
      else
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.width, this.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, source);
    else
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source)

  }

  width: number | undefined
  height: number | undefined
  texture: WebGLTexture | null
}
