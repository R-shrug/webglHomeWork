import { Canvas } from "../../utils/canvas"
// 创建着色器方法，输入参数：渲染上下文，着色器类型，数据源
import "../../utils/draw/2D_images"
async function main() {
  let canvas = new Canvas("canvas")

  canvas.size = [700, 700]

  canvas.render()

  // 身体
  canvas.drawSector([250, 550], 80, 0, Math.PI, "#f9dc4c", 'fill')
  canvas.drawRectangle(
    [170, 400],
    [330, 400],
    [330, 550],
    [170, 550],
    "#f9dc4c", 'fill')
  canvas.drawSector([220, 400], 50, Math.PI, Math.PI / 2, "#f9dc4c", 'fill')
  canvas.drawSector([280, 410], 60, Math.PI * 3 / 2, Math.PI * 3 / 4, "#f9dc4c", 'fill')
  canvas.drawRectangle([220, 350], [280, 350], [280, 400], [220, 400], "#f9dc4c", 'fill')
  canvas.drawSector([262, 397], 80, Math.PI / 20, Math.PI / 8, "#f9dc4c", 'fill')

  // 嘴巴
  canvas.drawSector([275, 530], 60, Math.PI * 6 / 5, Math.PI / 3.2, "#51463f", 'fill')
  canvas.drawSector([275, 530], 58, Math.PI * 6 / 5, Math.PI / 3.2, "#f9dc4c", 'fill')

  // 眼镜
  canvas.drawRectangle([165, 540], [235, 540], [235, 565], [165, 565], "#51463f", 'fill')
  canvas.drawRectangle([235, 537], [243, 537], [243, 568], [235, 568], "#9c9c95", 'fill')
  canvas.drawRectangle([237, 539], [243, 539], [243, 570], [237, 570], "#d4cec6", 'fill')
  canvas.drawCircle([292, 550], 50, "#9c9c95", 'fill')
  canvas.drawCircle([300, 550], 50, "#d4cec6", 'fill')
  canvas.drawCircle([300, 550], 35, "#9c9c95", 'fill')
  canvas.drawCircle([295, 550], 34, "#f9dc4c", 'fill')
  canvas.drawSector([295, 550], 34, Math.PI, Math.PI, "#FFFFFF", 'fill')
  canvas.drawSector([267, 550], 6, Math.PI, Math.PI, "#51463f", 'fill')


}

main()