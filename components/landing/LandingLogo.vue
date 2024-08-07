<script lang="ts" setup>
const localePath = useLocalePath()
</script>

<template>
  <h1>
    <NuxtLink
      :to="localePath('/')"
      class="bg-none font-bold text-fl-lg font-logo uppercase tracking-widest"
      active-class="bg-none"
    >
      <img src="/assets/img/logo.png" alt="CV logo" class="w-56">
    </NuxtLink>
  </h1>
</template>
