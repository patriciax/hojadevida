<script setup lang="ts">
import { useCvState } from '~/data/useCvState'

const { formSettings } = useCvState()
const imageError = ref(false)
function handleImageError() {
  imageError.value = true
}

watch (() => formSettings.value.profileImageDataUri, () => {
  imageError.value = false
})

function proxifyUrl(url: string): string {
  const encoded = encodeURIComponent(url.replace(/^https?:\/\//, ''))
  return `https://images.weserv.nl/?url=${encoded}`
}

const proxiedImage = computed(() => {
  const uri = formSettings.value.profileImageDataUri

  if (!uri)
    return ''

  // Si es base64, la usamos tal cual
  if (uri.startsWith('data:image'))
    return uri

  // Si es URL normal, la pasamos por el proxy
  return proxifyUrl(uri)
})
</script>

<template>
  <img
    v-if="imageError"
    class="object-cover h-[212px]  max-w-[212px] max-h-[212px] rounded-full aspect-square"
    src="http://imgfz.com/i/miU0GWa.png"
    alt="Your profile image"
  >
  <img
    v-else-if="!formSettings.profileImageDataUri"
    class="object-cover h-[212px]  max-w-[212px] max-h-[212px] rounded-full aspect-square"
    src="/assets/img/user.svg" alt="logo"
  >
  <img
    v-else
    class="object-cover h-[212px]  max-w-[212px] max-h-[212px] rounded-full aspect-square"
    :src="proxiedImage"
    alt="Your profile image"
    @error="handleImageError"
  >
</template>
