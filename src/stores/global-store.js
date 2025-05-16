import { defineStore } from 'pinia'
const getDefaultState = () => ({
  counter: 0,
  userData: {},
  pendingRescueReport: 0,
})

export const globalStore = defineStore('store', {
  state: () => ({
    counter: 0,
    userData: {},
    pendingRescueReport: 0,
  }),
  getters: {
    doubleCount: (state) => state.counter * 2,
  },
  actions: {
    reset() {
      this.$state = getDefaultState()
    },
  },
})
