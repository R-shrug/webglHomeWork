import { vec2, vec3 } from "./type";

export function reduceDimension(arr: Array<vec2> | Array<vec3>) {
  return Array.prototype.concat.apply([], arr);
}

export function transformRgba(rgba: number[] | string): number[] {
  if (typeof rgba === 'object') {
    return (rgba as number[]).map((v, index) => (v / (index === 3 ? 1 : 255)));
  } else if (typeof rgba === 'string') {
    let strRgb = rgba as string;
    let hashReg = /#([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})/i;
    let rgbReg = /rgb\((\d+),\s*(\d+),\s*(\d+)\)/;
    switch (true) {
      case hashReg.test(strRgb):
        return transformRgba(hashReg.exec(strRgb)!.slice(1).map(v => Number(`0x${v}`)).concat([1]));
      case rgbReg.test(strRgb):
        return transformRgba(rgbReg.exec(strRgb)!.slice(1).map(Number).concat([1]));
    }
  }
  throw Error("invalid rgb format")

}

export function mapping(size: [number, number], points: Array<[number, number]>): Array<[number, number]> {
  return points.map(Element => [Element[0] / size[0] * 2 - 1, Element[1] / size[1] * 2 - 1])
}