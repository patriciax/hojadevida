<script setup lang="ts">
import { useCvState } from '~/data/useCvState'

const { formSettings } = useCvState()
</script>

<template>
  <img
    v-if="formSettings.profileImageDataUri"
    class="object-cover h-[212px]  max-w-[212px] max-h-[212px] rounded-full aspect-square"
    :src="formSettings.profileImageDataUri ?? ''"
    alt="Your profile image"
  >
  <img
    v-else
    class="object-cover h-[212px]  max-w-[212px] max-h-[212px] rounded-full aspect-square"
    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNL_ZnOTpXSvhf1UaK7beHey2BX42U6solRA&s"
    alt="Your profile image"
  >
</template>
