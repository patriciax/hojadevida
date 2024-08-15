import { defineNuxtPlugin } from '#app'
import useLoginStore from '@/stores/auth'

export default defineNuxtPlugin(() => {
  const loginStore = useLoginStore()

  // Hidrata el estado en el cliente
  if (process.client)
    loginStore.hydrate()
})
