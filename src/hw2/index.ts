import { Canvas } from "../../utils/canvas"
// 创建着色器方法，输入参数：渲染上下文，着色器类型，数据源
import "../../utils/draw/2D_images"
async function main() {
  let canvas = new Canvas("canvas")

  canvas.size = [700, 700]

  canvas.render()
}

main()