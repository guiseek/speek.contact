export const that = <I>(value: I) => ({
  as<O>() {
    return value as unknown as O
  },
})
