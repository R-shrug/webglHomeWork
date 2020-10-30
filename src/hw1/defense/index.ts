import { Canvas } from "../../../utils/canvas"
// 创建着色器方法，输入参数：渲染上下文，着色器类型，数据源
import "../../../utils/draw/2D_images"
async function main() {
  let canvas = new Canvas("canvas")

  canvas.size = [700, 700]

  canvas.render()
//   canvas.drawSector([220, 349], 40, Math.PI / 4, 2 * Math.PI/3, '#417588', 'fill')

//   // 腿
//   canvas.drawSector([220, 349], 40, -Math.PI / 2, Math.PI, '#417588', 'hollow')
  canvas.drawEllipseSector([240, 309], 20, 15, '#493c36', 'fill',3/4*Math.PI, 0, Math.PI)
//   canvas.drawSector([280, 349], 40, -Math.PI / 2, Math.PI, '#417500', 'hollow')
//   canvas.drawEllipseSector([300, 309], 20, 15, '#490036', 'fill', 0, Math.PI, Math.PI)
//   // 身体
//   canvas.drawEllipseSector([263, 550], 90, 80, "#f9dc4c", 'hollow')
//   canvas.drawRectangle(
//     [170, 400],
//     [350, 400],
//     [350, 550],
//     [170, 550],
//     "#ffdc4c", 'hollow')
//   canvas.drawRectangle(
//     [217.5, 340],
//     [312.5, 340],
//     [312.5, 400],
//     [217.5, 400],
//     "#f9004c", 'hollow')
//   canvas.drawEllipseSector([265, 400], 95, 70, "#f9dc00", 'hollow', 0, Math.PI * 2 / 3, Math.PI / 3)
//   canvas.drawEllipseSector([265, 400], 95, 70, "#f9504c", 'hollow', 0, 0, Math.PI / 3)
//   canvas.drawEllipseSector([265, 387], 95, 55, "#f9dc60", 'hollow', 0, Math.PI / 3, Math.PI / 3)
//   canvas.drawEllipseSector([336, 378], 20, 80, "#29dc4c", 'hollow', -Math.PI / 19, Math.PI, Math.PI * 14 / 15)

//   // 衣服
//   canvas.drawRectangle(
//     [230, 380],
//     [340, 380],
//     [340, 440],
//     [230, 440],
//     "#509bbc", 'hollow')
//   canvas.drawEllipseSector([265, 390], 95, 60, "#5000bc", 'hollow', 0, Math.PI * 1.9 / 3, Math.PI * 1.1 / 3)
//   canvas.drawEllipseSector([265, 390], 95, 60, "#509b00", 'hollow', 0, 0, Math.PI * 1.1 / 3)
//   canvas.drawEllipseSector([265, 387], 95, 55, "#009bbc", 'hollow', 0, Math.PI / 3, Math.PI / 3)

//   canvas.drawCircle([240, 436], 4, '#375ca4', 'hollow')
//   canvas.drawCircle([330, 436], 4, '#3700a4', 'hollow')

//   // 嘴巴
  // canvas.drawArc([275, 530], 58, Math.PI * 6 / 5, Math.PI / 3.2, 10, "#51463f")

//   // 眼镜
//   canvas.drawRectangle([168, 540], [238, 540], [238, 565], [168, 565], "#514600", 'hollow')
//   canvas.drawRectangle([238, 537], [246, 537], [246, 568], [238, 568], "#9c9c95", 'hollow')
//   canvas.drawRectangle([240, 539], [246, 539], [246, 570], [240, 570], "#d4cec6", 'hollow')
//   canvas.drawCircle([305, 550], 60, "#9c0095", 'hollow')
//   canvas.drawCircle([313, 550], 60, "#d4ce00", 'hollow')
//   canvas.drawCircle([313, 550], 45, "#009c95", 'hollow')
//   canvas.drawCircle([305, 550], 44, "#f9dc4c", 'hollow')
//   canvas.drawSector([308, 550], 44, Math.PI, Math.PI, "#000000", 'hollow')
//   canvas.drawSector([274, 550], 10, Math.PI, Math.PI, "#00463f", 'hollow')

//   // 头发
//   canvas.drawArc([247, 564], 60, Math.PI / 2.4, Math.PI / 2.5, 4, '#000000', canvas.gl.TRIANGLES)
//   canvas.drawArc([247, 565], 60, Math.PI / 2.4, Math.PI / 2.5, 2, '#000000')
//   canvas.drawArc([236, 565], 65, Math.PI / 3, Math.PI / 2.2, 4, '#000000', canvas.gl.TRIANGLES)
//   canvas.drawArc([236, 566], 65, Math.PI / 3, Math.PI / 2.2, 2, '#000000')

//   canvas.drawArc([280, 564], 60, Math.PI / 6, Math.PI / 3.1, 5, '#000000', canvas.gl.TRIANGLES)
//   canvas.drawArc([280, 565], 60, Math.PI / 6, Math.PI / 3, 2, '#000000')
//   canvas.drawArc([285, 554], 65, Math.PI / 4.5, Math.PI / 4, 5, '#000000', canvas.gl.TRIANGLES)
//   canvas.drawArc([285, 555], 65, Math.PI / 4.5, Math.PI / 4, 2, '#000000')

//   // 手

//   canvas.drawSector([240, 430], 60, Math.PI * 40 / 41, Math.PI * 1.1 / 3, "#f9dc4c", 'hollow')
//   canvas.drawArc([240, 430], 40, Math.PI * 40 / 41, Math.PI * 1.1 / 3, 3, "#00b000")
//   canvas.drawArc([240, 430], 60, Math.PI * 40 / 41, Math.PI * 1.1 / 3, 3, "#fdb000")
//   canvas.drawCircle([215, 385], 14, '#473a34', 'hollow')

//   // 衣服补充
//   canvas.drawRectangle(
//     [230, 380],
//     [340, 380],
//     [340, 440],
//     [230, 440],
//     "#509bbc", 'hollow')
//   canvas.drawArc([190, 365], 80, Math.PI / 4, Math.PI / 3, 14, "#509bbc")

//   canvas.drawArc([190, 365], 80, Math.PI / 3.5, Math.PI / 8, 2, "#375ca4")
//   canvas.drawArc([190, 365], 80, Math.PI / 3.5, Math.PI / 8, 3, "#3700a4", canvas.gl.TRIANGLES)
//   canvas.drawArc([240, 437], 10, Math.PI * 3.2 / 2, Math.PI / 2.4, 1, "#005ca4")
//   canvas.drawArc([240, 437], 10, Math.PI * 3.2 / 2, Math.PI / 2.4, 2, "#375c00", canvas.gl.TRIANGLES)

//   canvas.drawArc([400, 383], 80, Math.PI * 3.4 / 5, Math.PI / 6, 14, "#509bbc")

//   canvas.drawArc([400, 383], 80, Math.PI * 3.6 / 5, Math.PI / 10, 2, "#375ca4")
//   canvas.drawArc([400, 383], 80, Math.PI * 3.6 / 5, Math.PI / 10, 3, "#3700a4", canvas.gl.TRIANGLES)
//   canvas.drawArc([330, 436], 10, Math.PI * 2.0 / 2, Math.PI / 2.4, 1, "#005ca4")
//   canvas.drawArc([330, 436], 10, Math.PI * 2.0 / 2, Math.PI / 2.4, 2, "#375c00", canvas.gl.TRIANGLES)

//   canvas.drawEllipseSector([285, 420], 27, 24, '#005ca4', 'hollow', 0, -Math.PI / 30, Math.PI * 32 / 30)
//   canvas.drawRectangle(
//     [150, 400],
//     [170, 400],
//     [170, 550],
//     [150, 550],
//     "#000000", 'hollow')

//   // 手补充
//   canvas.drawArc([290, 410], 60, -Math.PI * 0.2 / 2, Math.PI * 0.3 / 3, 3, "#fdb000")
//   canvas.drawCircle([338, 387], 12, '#473a34', 'hollow')
}

main()