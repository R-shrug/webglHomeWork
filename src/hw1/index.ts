import { Canvas } from "../../utils/canvas"
// 创建着色器方法，输入参数：渲染上下文，着色器类型，数据源
import "../../utils/draw/2D_images"
async function main() {
  let canvas = new Canvas("canvas")

  canvas.size = [700, 700]

  canvas.render()

  // 腿
  canvas.drawSector([220, 349], 40, -Math.PI / 2, Math.PI, '#417588', 'fill')
  canvas.drawEllipseSector([240, 309], 20, 15, '#493c36', 'fill', 0, Math.PI, Math.PI)
  canvas.drawSector([280, 349], 40, -Math.PI / 2, Math.PI, '#417588', 'fill')
  canvas.drawEllipseSector([300, 309], 20, 15, '#493c36', 'fill', 0, Math.PI, Math.PI)
  // 身体
  canvas.drawEllipseSector([263, 550], 90, 80, "#f9dc4c", 'fill')
  canvas.drawRectangle(
    [170, 400],
    [350, 400],
    [350, 550],
    [170, 550],
    "#f9dc4c", 'fill')
  canvas.drawRectangle(
    [217.5, 340],
    [312.5, 340],
    [312.5, 400],
    [217.5, 400],
    "#f9dc4c", 'fill')
  canvas.drawEllipseSector([265, 400], 95, 70, "#f9dc4c", 'fill', 0, Math.PI * 2 / 3, Math.PI / 3)
  canvas.drawEllipseSector([265, 400], 95, 70, "#f9dc4c", 'fill', 0, 0, Math.PI / 3)
  canvas.drawEllipseSector([265, 387], 95, 55, "#f9dc4c", 'fill', 0, Math.PI / 3, Math.PI / 3)
  canvas.drawEllipseSector([336, 378], 20, 80, "#f9dc4c", 'fill', -Math.PI / 19, Math.PI, Math.PI * 14 / 15)

  // 衣服
  canvas.drawRectangle(
    [230, 380],
    [340, 380],
    [340, 440],
    [230, 440],
    "#509bbc", 'fill')
  canvas.drawEllipseSector([265, 390], 95, 60, "#509bbc", 'fill', 0, Math.PI * 1.9 / 3, Math.PI * 1.1 / 3)
  canvas.drawEllipseSector([265, 390], 95, 60, "#509bbc", 'fill', 0, 0, Math.PI * 1.1 / 3)
  canvas.drawEllipseSector([265, 387], 95, 55, "#509bbc", 'fill', 0, Math.PI / 3, Math.PI / 3)

  canvas.drawCircle([240, 436], 4, '#375ca4', 'fill')
  canvas.drawCircle([330, 436], 4, '#375ca4', 'fill')

  // 嘴巴
  canvas.drawArc([275, 530], 58, Math.PI * 6 / 5, Math.PI / 3.2, 2, "#51463f")

  // 眼镜
  canvas.drawRectangle([168, 540], [238, 540], [238, 565], [168, 565], "#51463f", 'fill')
  canvas.drawRectangle([238, 537], [246, 537], [246, 568], [238, 568], "#9c9c95", 'fill')
  canvas.drawRectangle([240, 539], [246, 539], [246, 570], [240, 570], "#d4cec6", 'fill')
  canvas.drawCircle([305, 550], 60, "#9c9c95", 'fill')
  canvas.drawCircle([313, 550], 60, "#d4cec6", 'fill')
  canvas.drawCircle([313, 550], 45, "#9c9c95", 'fill')
  canvas.drawCircle([305, 550], 44, "#f9dc4c", 'fill')
  canvas.drawSector([308, 550], 44, Math.PI, Math.PI, "#FFFFFF", 'fill')
  canvas.drawSector([274, 550], 10, Math.PI, Math.PI, "#51463f", 'fill')

  // 头发
  canvas.drawArc([247, 564], 60, Math.PI / 2.4, Math.PI / 2.5, 4, '#000000', canvas.gl.TRIANGLES)
  canvas.drawArc([247, 565], 60, Math.PI / 2.4, Math.PI / 2.5, 2, '#000000')
  canvas.drawArc([236, 565], 65, Math.PI / 3, Math.PI / 2.2, 4, '#000000', canvas.gl.TRIANGLES)
  canvas.drawArc([236, 566], 65, Math.PI / 3, Math.PI / 2.2, 2, '#000000')

  canvas.drawArc([280, 564], 60, Math.PI / 6, Math.PI / 3.1, 5, '#000000', canvas.gl.TRIANGLES)
  canvas.drawArc([280, 565], 60, Math.PI / 6, Math.PI / 3, 2, '#000000')
  canvas.drawArc([285, 554], 65, Math.PI / 4.5, Math.PI / 4, 5, '#000000', canvas.gl.TRIANGLES)
  canvas.drawArc([285, 555], 65, Math.PI / 4.5, Math.PI / 4, 2, '#000000')

  // 手

  canvas.drawSector([240, 430], 60, Math.PI * 40 / 41, Math.PI * 1.1 / 3, "#f9dc4c", 'fill')
  canvas.drawArc([240, 430], 40, Math.PI * 40 / 41, Math.PI * 1.1 / 3, 3, "#fdb000")
  canvas.drawArc([240, 430], 60, Math.PI * 40 / 41, Math.PI * 1.1 / 3, 3, "#fdb000")
  canvas.drawCircle([215, 385], 14, '#473a34', 'fill')

  // 衣服补充
  canvas.drawRectangle(
    [230, 380],
    [340, 380],
    [340, 440],
    [230, 440],
    "#509bbc", 'fill')
  canvas.drawArc([190, 365], 80, Math.PI / 4, Math.PI / 3, 14, "#509bbc")

  canvas.drawArc([190, 365], 80, Math.PI / 3.5, Math.PI / 8, 2, "#375ca4")
  canvas.drawArc([190, 365], 80, Math.PI / 3.5, Math.PI / 8, 3, "#375ca4", canvas.gl.TRIANGLES)
  canvas.drawArc([240, 437], 10, Math.PI * 3.2 / 2, Math.PI / 2.4, 1, "#375ca4")
  canvas.drawArc([240, 437], 10, Math.PI * 3.2 / 2, Math.PI / 2.4, 2, "#375ca4", canvas.gl.TRIANGLES)

  canvas.drawArc([400, 383], 80, Math.PI * 3.4 / 5, Math.PI / 6, 14, "#509bbc")

  canvas.drawArc([400, 383], 80, Math.PI * 3.6 / 5, Math.PI / 10, 2, "#375ca4")
  canvas.drawArc([400, 383], 80, Math.PI * 3.6 / 5, Math.PI / 10, 3, "#375ca4", canvas.gl.TRIANGLES)
  canvas.drawArc([330, 436], 10, Math.PI * 2.0 / 2, Math.PI / 2.4, 1, "#375ca4")
  canvas.drawArc([330, 436], 10, Math.PI * 2.0 / 2, Math.PI / 2.4, 2, "#375ca4", canvas.gl.TRIANGLES)

  canvas.drawEllipseSector([285, 420], 27, 24, '#375ca4', 'hollow', 0, -Math.PI / 30, Math.PI * 32 / 30)
  canvas.drawRectangle(
    [150, 400],
    [170, 400],
    [170, 550],
    [150, 550],
    "#FFFFFF", 'fill')

  // 手补充
  canvas.drawArc([290, 410], 60, -Math.PI * 0.2 / 2, Math.PI * 0.3 / 3, 3, "#fdb000")
  canvas.drawCircle([338, 387], 12, '#473a34', 'fill')
}

main()