import { defineStore } from 'pinia'

export const useMainLayoutStore = defineStore('mainLayout', {
  state: () => ({
    showDrawer: false,
  }),
  actions: {
    setShowDrawer(show: boolean) {
      this.showDrawer = show
    },
  },
})
