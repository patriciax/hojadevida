<script setup>
import { ArrowDownIcon, ArrowDownLeftIcon, ArrowDownTrayIcon, Cog6ToothIcon, DocumentTextIcon, PrinterIcon, ShareIcon } from '@heroicons/vue/24/solid'
import { ArrowDownCircleIcon } from '@heroicons/vue/24/outline'
import useResumenStore from '@/stores/resumen'
import { useCvState } from '~/data/useCvState'

const {
  formSettings,

} = useCvState()
const resumenStore = useResumenStore()

const formSettingsHref = computed(() => {
  return `data:text/json;charset=utf-8,${encodeURIComponent(
    JSON.stringify({ formSettings: formSettings.value }),
  )}`
})
</script>

<template>
  <div class="lg:hidden block fixed z-50 w-full h-16  movil-share -translate-x-1/2 bg-white rounded-t-md bottom-0 left-1/2 shadow-xl">
    <div class="grid h-full max-w-lg grid-cols-4 mx-auto">
      <a
        class="inline-flex text-center cursor-pointer flex-col items-center justify-center px-5 hover:text-blue-600  group text-gray-500"
        :href="formSettingsHref"
        rel="noopener"
        :download="`CV_${formSettings.name}_${formSettings.lastName}_${$i18n.locale}.json`"
      >
        <svg data-v-0b36e606="" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" data-slot="icon" class="w-5 h-5"><path fill-rule="evenodd" d="M12 2.25a.75.75 0 0 1 .75.75v11.69l3.22-3.22a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 1 1 1.06-1.06l3.22 3.22V3a.75.75 0 0 1 .75-.75Zm-9 13.5a.75.75 0 0 1 .75.75v2.25a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5V16.5a.75.75 0 0 1 1.5 0v2.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V16.5a.75.75 0 0 1 .75-.75Z" clip-rule="evenodd" /></svg>        <p class="text-[11px] mt-1">
          {{ $t('downloadjson') }}
        </p>
      </a>

      <button data-tooltip-target="tooltip-settings" type="button" class="text-gray-600 inline-flex flex-col items-center justify-center px-5 hover:text-blue-600  group" @click="$emit('share')">
        <ShareIcon class="w-5 h-5 " />

        <p class="text-xs mt-1">
          {{ $t('share') }}
        </p>
      </button>

      <button data-tooltip-target="tooltip-profile" type="button" class="inline-flex flex-col items-center justify-center px-5 rounded-e-full hover:text-blue-600  group text-gray-600" @click="$emit('save')">
        <PrinterIcon class="w-5 h-5" />

        <p class="text-xs mt-0.5">
          {{ $t('print') }}
        </p>
      </button>
      <button data-tooltip-target="tooltip-home" type="button" class="text-gray-500 inline-flex flex-col items-center justify-center px-5 rounded-s-full hover:text-blue-600  group" @click="$emit('sharepass')">
        <svg data-v-0b36e606="" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" data-slot="icon" class="w-5 h-5"><path fill-rule="evenodd" d="M12 2.25a.75.75 0 0 1 .75.75v11.69l3.22-3.22a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 1 1 1.06-1.06l3.22 3.22V3a.75.75 0 0 1 .75-.75Zm-9 13.5a.75.75 0 0 1 .75.75v2.25a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5V16.5a.75.75 0 0 1 1.5 0v2.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V16.5a.75.75 0 0 1 .75-.75Z" clip-rule="evenodd" /></svg>
        <p class="text-xs mt-0.5">
          {{ $t('PDF') }}
        </p>
      </button>
    </div>
  </div>
</template>
