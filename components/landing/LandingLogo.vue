<script lang="ts" setup>
import { Bars4Icon } from '@heroicons/vue/24/solid'

const $emit = defineEmits(['toggleSidebar'])
</script>

<template>
  <h1 class="flex w-full lg:w-auto items-center justify-between">
    <img src="/assets/img/logo.png" alt="CV logo" class="w-40 mr-2">
    <slot />
    <button class="focus:outline-none lg:hidden" @click="$emit('toggleSidebar')">
      <Bars4Icon class="w-6 h-6" />
    </button>
  </h1>
</template>
