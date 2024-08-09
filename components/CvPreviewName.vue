<script lang="ts" setup>
import { useCvState } from '~/data/useCvState'

const { formSettings } = useCvState()
</script>

<template>
  <h2 class="text-gray-900 text-4xl/normal uppercase font-extrabold tracking-wide">
    {{ formSettings.name }} {{ formSettings.lastName }}
  </h2>
</template>
