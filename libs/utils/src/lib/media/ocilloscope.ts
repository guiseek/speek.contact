export const oscilloscope = (node: AnalyserNode, canvas: HTMLCanvasElement) => {
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
      ctx.lineWidth = 2
      ctx.strokeStyle = `#673ab7`
      ctx.beginPath()

      const sliceWidth = (width * 1.0) / bufferLength

      let x = 0

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0
        const y = (v * height) / 2

        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)

        x += sliceWidth
      }

      ctx.lineTo(width, height / 2)
      ctx.stroke()

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
