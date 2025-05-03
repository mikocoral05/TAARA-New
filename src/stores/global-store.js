import { defineStore } from 'pinia'

export const globalStore = defineStore('store', {
  state: () => ({
    counter: 0,
    userData: {},
  }),
  getters: {
    doubleCount: (state) => state.counter * 2,
  },
  actions: {
    increment() {
      this.counter++
    },
  },
})
