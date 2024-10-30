<script lang="ts" setup>
import { useCvState } from '~/data/useCvState'
import useResumenStore from '@/stores/resumen'

const { formSettings } = useCvState()
const currentDate = ref(new Date())
const resumenStore = useResumenStore()
const { locale } = useI18n()
function formatDate(date: Date) {
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }
  return date.toLocaleDateString(locale.value === 'es' ? 'es-ES' : 'en-US', options)
}
</script>

<template>
  <p
    v-if="resumenStore.isShowCarta"
    class="text-gray-700 "
  >
    {{ formatDate(currentDate) }}
  </p>
  <h2 class="text-gray-900 text-4xl/normal uppercase font-extrabold tracking-wide">
    {{ formSettings.name }} {{ formSettings.lastName }}
  </h2>
</template>
