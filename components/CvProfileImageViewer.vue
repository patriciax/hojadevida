<script setup lang="ts">
import { useCvState } from '~/data/useCvState'

const { formSettings } = useCvState()
</script>

<template>
  <img
    v-if="formSettings.profileImageDataUri"
    class="object-cover h-[212px]  max-w-[212px] max-h-[212px] rounded-md overflow-hidden"
    :src="formSettings.profileImageDataUri ?? ''"
    alt="Your profile image"
  >
</template>
