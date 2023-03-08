import { defineStore } from 'pinia'

export const useCounterStore = defineStore('mainLayout', {
  state: () => ({
    showDrawer: false,
  }),
  actions: {
    setShowDrawer(show: boolean) {
      this.showDrawer = show
    },
  },
})
