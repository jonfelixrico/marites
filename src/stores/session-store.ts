import { defineStore } from 'pinia'

interface SessionStore {
  userId: string | null
}

export const useSessionStore = defineStore('session', {
  state: (): SessionStore => ({
    userId: null,
  }),
  actions: {
    setUserId(userId: string | null) {
      this.userId = userId
    },
  },
})
