const wrappedFns: {
  [jobId: string]: Promise<unknown>
} = {}

export function usePromiseCache() {
  function wrap<T>(id: string, fn: () => Promise<T>): Promise<T> {
    if (!!wrappedFns[id]) {
      console.debug("There's already an ongoing job with id %s", id)
      return wrappedFns[id] as Promise<T>
    }

    console.debug('Creating new job %s', id)
    const wrapped = (wrappedFns[id] = fn())
    wrapped
      .then(() => {
        console.debug('Job %s has finished successfully', id)
      })
      .catch((e) => {
        console.error('Job %s has finished with errors', id, e)
      })
      .finally(() => {
        delete wrappedFns[id]
      })

    return wrapped
  }

  return {
    wrap,
  }
}
