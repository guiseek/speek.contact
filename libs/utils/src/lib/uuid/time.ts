export function time() {
  let time = new Date().getTime()
  if ('performance' in window) {
    time += performance.now()
  }
  return time
}
