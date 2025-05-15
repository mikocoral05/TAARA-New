import { defineBoot } from '#q-app/wrappers'
import { getPendingRescueReport } from 'src/composable/latestComposable'
import { globalStore } from 'src/stores/global-store'
const store = globalStore()
export default defineBoot(() => {
  getPendingRescueReport().then((response) => {
    store.pendingRescueReport = response
  })
  const raw = sessionStorage.getItem('user_data')
  store.userData = raw ? JSON.parse(raw) : {}
})
