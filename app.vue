<script setup lang="ts">
onMounted(async () => {
  const requestLocation = await fetch('https://ipapi.co/json/', { method: 'GET' })
  const { country_code, latitude, longitude } = await requestLocation.json()
  sessionStorage.setItem('country_code', country_code)
  sessionStorage.setItem('lat_current', latitude)
  sessionStorage.setItem('lng_current', longitude)
})
</script>

<template>
  <NuxtPwaManifest />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
