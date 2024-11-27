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

const showModal = ref(false)
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

  <button v-if="formSettings.soportes.length" :style="`background: ${formSettings.activeColor} `" class="movil-share absolute top-5 right-5  inline-flex flex-col items-center text-[15px] font-semibold justify-center px-5 text-white rounded-full py-2 group" @click="resumenStore.showModalAdjuntos()">
    {{ $t('Ver soportes') }}
  </button>
</template>
