export function toCamelCase(e: string) {
  return e.replace(/_([a-z])/g, (g) => g[1].toUpperCase())
}
