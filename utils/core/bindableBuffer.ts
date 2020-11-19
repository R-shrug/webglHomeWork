

export class BindableBuffer<T extends ArrayBuffer = ArrayBuffer> {

  dirty = true

  constructor(
    public arrayBuffer?: T, public gl?: WebGLRenderingContext) {
  }

  buffer: WebGLBuffer | null = null

  update(gl?: WebGLRenderingContext) {
    if (!this.dirty) return

    if (!gl) gl = this.gl
    if (!gl) throw new Error("WebGLRenderingContext needed")
    if (!this.buffer)
      this.buffer = gl.createBuffer()

    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer)

    if (!this.arrayBuffer) throw new Error("empty buffer")

    gl.bufferData(gl.ARRAY_BUFFER, this.arrayBuffer, gl.STATIC_DRAW)
    this.dirty = false
  }

  bind(gl?: WebGLRenderingContext) {
    if (!gl) gl = this.gl
    if (!gl) throw new Error("WebGLRenderingContext needed")

    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer)
  }
}
