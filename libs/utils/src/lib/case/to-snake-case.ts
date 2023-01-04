export function toSnakeCase(e: string) {
  return e
    .match(/([A-Z])/g)
    ?.reduce((str, c) => str.replace(new RegExp(c), '_' + c.toLowerCase()), e)
    .substring(e.slice(0, 1).match(/([A-Z])/g) ? 1 : 0)
}
