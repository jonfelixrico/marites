import { usePocketbase } from 'src/services/pocketbase.service'

interface APIUser {
  id: string
}

export class NoSessionUserError extends Error {
  constructor() {
    super('No session user.')
  }
}

export function useSessionApi() {
  const pb = usePocketbase()

  function getSessionUser(): APIUser {
    const model = pb.authStore.model

    if (!model) {
      throw new NoSessionUserError()
    }

    return model
  }

  return {
    getSessionUser,
  }
}
