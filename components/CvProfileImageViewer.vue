<script setup lang="ts">
import { useCvState } from '~/data/useCvState'

const { formSettings } = useCvState()
</script>

<template>
  <img
    class="object-cover h-[212px]  max-w-[212px] max-h-[212px] rounded-full aspect-square"
    :src="formSettings.profileImageDataUri ?? 'http://imgfz.com/i/miU0GWa.png'"
    alt="Your profile image"
  >
</template>
