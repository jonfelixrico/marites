const wrappedFns: Record<string, Promise<unknown>> = {}

export function usePromiseCache() {
  function wrap<T>(key: string, fn: () => Promise<T>): Promise<T> {
    if (!!wrappedFns[key]) {
      console.debug("There's already an ongoing job for key %s", key)
      return wrappedFns[key] as Promise<T>
    }

    console.debug('Creating new job for key %s', key)
    const wrapped = (wrappedFns[key] = fn())
    wrapped.finally(() => {
      delete wrappedFns[key]
    })

    return wrapped
  }

  return {
    wrap,
  }
}
