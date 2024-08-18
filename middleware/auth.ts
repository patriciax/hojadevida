import useLoginStore from '@/stores/auth'

export default defineNuxtRouteMiddleware((to, from) => {
  const loginStore = useLoginStore()

  if (loginStore.token)
    return

  if (!loginStore.token)
    return navigateTo('/login')
})
