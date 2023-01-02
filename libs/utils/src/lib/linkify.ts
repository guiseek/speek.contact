export function linkify(text: string) {
  return text.replace(/(https?:\/\/[^\s]+)/g, (url) => {
    return `<a href="${url}">${url}</a>`
  })
}
