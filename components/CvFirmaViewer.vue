<script setup lang="ts">
import { useCvState } from '~/data/useCvState'

const { formSettings } = useCvState()
</script>

<template>
  <img
    v-if="formSettings.firma"
    class="w-56 -mt-4 "
    :src="formSettings.firma"
  >
  <div class="border-b w-56 mb-2" />
  <div class="flex flex-col font-landing text-sm text-gray-600">
    <p v-text="`${formSettings.name} ${formSettings.lastName}`" />
    <p v-text="formSettings.jobTitle" />
    <a :href="`mailto:${formSettings.email}`" class="font-landing text-sm  " v-text="formSettings.email" />
    <a :href="`tel:${formSettings.phoneNumber}`" class="font-landing text-sm  mt-0.5" v-text="`+${formSettings.phoneNumber}`" />
  </div>
</template>
