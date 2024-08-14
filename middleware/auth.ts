export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()

  if (!authStore.authenticated && to.path !== '/login')
    return navigateTo('/login')
})
