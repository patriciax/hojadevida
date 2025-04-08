<script setup>
import { ref } from 'vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  withOutClose: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['close'])
const target = ref(null)
const handleClose = () => emit('close')
</script>

<template>
  <section class="fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center">
    <div ref="target" class="absolute inset-0 -m-4 bg-black bg-opacity-50" @click="handleClose" />
    <section class="sm:w-475 relative w-full rounded-lg p-4">
      <button v-if="!props.withOutClose" class="hiddem absolute right-0 focus:outline-none top-0 " @click="handleClose">
        <XMarkIcon class="w-6 text-white" />
      </button>
      <slot />
    </section>
  </section>
</template>
