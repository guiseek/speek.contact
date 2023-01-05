function changeColor(bar: number, hex: string, alpha = 1) {
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${bar},${g},${b},${alpha})`
}

export const frequency = (node: AnalyserNode, canvas: HTMLCanvasElement) => {
  const {width, height} = canvas
  const ctx = canvas.getContext('2d')
  let animationFrame = 0

  const draw = () => {
    if (ctx) {
      const bufferLength = node.frequencyBinCount
      const dataArray = new Uint8Array(bufferLength)
      node.getByteTimeDomainData(dataArray)

      ctx.fillStyle = `#ffffff`

      ctx.fillRect(0, 0, width, height)
      const barWidth = (width / bufferLength) * 2

      let barHeight
      let x = 0

      for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i]

        ctx.fillStyle = changeColor(barHeight, '#673ab7', 0.18)
        ctx.fillRect(x, height - barHeight / 2, barWidth, barHeight)

        x += barWidth
      }

      return requestAnimationFrame(draw)
    } else {
      return 0
    }
  }

  return {
    exec() {
      animationFrame = draw()
    },
    cancel() {
      if (animationFrame !== 0) {
        cancelAnimationFrame(animationFrame)
      }
    },
  }
}
