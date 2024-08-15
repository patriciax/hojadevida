import axios from 'axios'
import { defineNuxtPlugin, useRuntimeConfig } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()

  const axiosInstance = axios.create({
    baseURL: config.public.appUrl as string,
    headers: {
      common: {
        'Content-Type': 'application/json',
      },
    },
  })

  nuxtApp.provide('axios', axiosInstance)
})
