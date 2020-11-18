import { createProgram, loadShader, createUniformSetters, createAttributeSetters } from "./WebGlUtils"
import { reduceDimension, transformRgba } from "./tool"
export class Canvas {

  public canvas: HTMLCanvasElement;

  public gl: WebGLRenderingContext;

  public get width(): number { return this.canvas.width };
  public set width(width: number) { this.canvas.width = width };

  public get height(): number { return this.canvas.height };
  public set height(height: number) { this.canvas.height = height };

  public get size() { return [this.canvas.width, this.canvas.height]; }
  public set size(size: [number, number]) { [this.canvas.width, this.canvas.height] = size; }

  constructor(ElementId: string) {
    this.canvas = document.getElementById(ElementId) as HTMLCanvasElement
    this.gl = this.canvas.getContext('webgl') as WebGLRenderingContext
  }

  public render() {
    this.gl.viewport(0, 0, ...this.size);
    this.gl.enable(this.gl.DEPTH_TEST)
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
  }
}