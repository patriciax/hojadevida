<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { useCvState } from '~/data/useCvState'
import useResumenStore from '@/stores/resumen'

const { downloadPdfDirectly } = usePrint()
const router = useRouter()

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

async function downloadPdfDirectlys() {
  await resumenStore.isDowloadpdf(true)
  await downloadPdfDirectly()
  resumenStore.isDowloadpdf(false)
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

  <template v-if="resumenStore.plan ">
    <div class="lg:grid grid-cols-2 gap-2 movil-share absolute top-5 right-5  hidden flex-col items-center text-[15px] font-semibold justify-center px-5 text-white rounded-lg py-2 group">
      <button v-if="router.currentRoute.value.name === 'cv-id___es___default'" class="movil-share border border-gray-300  inline-flex flex-col items-center text-[15px] font-semibold justify-center px-5 text-gray-600 rounded-lg py-2 group" @click="downloadPdfDirectlys">
        {{ $t('Descargar') }}
      </button>
      <button v-if="formSettings.soportes.length " :style="`background: ${formSettings.activeColor} `" class="movil-share   inline-flex flex-col items-center text-[15px] font-semibold justify-center px-5 text-white rounded-lg py-2 group" @click="resumenStore.showModalAdjuntos()">
        {{ $t('Ver soportes') }}
      </button>
    </div>
  </template>
</template>
