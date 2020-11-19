
export function LoadImageAsync(src: string) {
    return new Promise<HTMLImageElement>((res, rej) => {
        const img = new Image()
        img.onload = () => res(img)
        img.onerror = (e) => rej(e)
        img.src = src
    })
}

