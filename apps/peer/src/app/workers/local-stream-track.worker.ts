/// <reference lib="webworker" />

self.onmessage = async ({data: {track}}) => {
  console.log(track)
}

addEventListener('message', ({data}) => {
  const response = `worker response to ${data}`
  postMessage(response)
})
