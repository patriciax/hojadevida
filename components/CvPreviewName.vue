<script lang="ts" setup>
import { useCvState } from '~/data/useCvState'

const { formSettings } = useCvState()
</script>

<template>
  <h2 class="text-primary text-2xl/normal uppercase font-extrabold tracking-wide">
    {{ formSettings.name }} {{ formSettings.lastName }}
  </h2>
</template>
