export function peerUtils(): string {
  return 'peer-utils'
}

const BASE = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
const REG =
  /(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})/
const REGEX =
  /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})$/i

export function long() {
  return BASE.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c == 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export function short() {
  const base = 'xxxxxxxx'
  return base.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c == 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export function little() {
  const base = 'xxxx'
  return base.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c == 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export function isValid(value: string) {
  return REGEX.test(value)
}

export function getFromText(value: string) {
  return new RegExp(REG).exec(value)
}

export function time() {
  let time = new Date().getTime()
  if ('performance' in window) {
    time += performance.now()
  }
  return time
}
