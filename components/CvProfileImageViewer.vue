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
    :src="formSettings.profileImageDataUri"
    alt="Your profile image"
    @error="handleImageError"
  >
</template>
