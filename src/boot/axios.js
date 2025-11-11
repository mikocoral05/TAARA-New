import { defineBoot } from '#q-app/wrappers'
import axios from 'axios'

//ThingEngineer
const api = axios.create({
  baseURL: 'http://localhost/TAARA-Capstone/backend/taara_backend/API/',
})

//Laravel
// const api = axios.create({
//   baseURL: 'http://127.0.0.1:8000/api/', // if your route is in api.php
// })

// const api = axios.create({
//   baseURL: 'https://vps.convertevue.com/taara_backend/API/',
// })

// chagne this imaegUrl to you domain usually subdomain
const imageUrl = axios.create({
  baseURL: 'http://77.37.74.195/upload',
})

// ignore this code below but dont delete
const onlineEndpoint = axios.create({
  baseURL: 'https://vps.nutrivue.org/',
})

export default defineBoot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
})

export { onlineEndpoint, api, imageUrl }
