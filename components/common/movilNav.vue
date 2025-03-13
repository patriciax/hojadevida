<script setup>
import { ArrowDownIcon, ArrowDownLeftIcon, ArrowDownTrayIcon, ArrowRightStartOnRectangleIcon, Cog6ToothIcon, DocumentTextIcon, ShareIcon } from '@heroicons/vue/24/solid'
import { useRouter } from 'vue-router'
import { useCvState } from '~/data/useCvState'
import useResumenStore from '@/stores/resumen'
import useLoginStore from '@/stores/auth'

const $emit = defineEmits(['close'])
const loginStore = useLoginStore()
const router = useRouter()

const {
  formSettings,
} = useCvState()
const resumenStore = useResumenStore()

function logout() {
  loginStore.reset()
  localStorage.removeItem(`cvSettings-${i18n.locale.value}`)
  router.push({ path: '/login' })
}
</script>

<template>
  <div class="lg:hidden block fixed z-50 w-full h-16  -translate-x-1/2 bg-white rounded-t-md bottom-0 left-1/2 shadow-xl">
    <div class="grid h-full max-w-lg grid-cols-5 mx-auto">
      <button :class="{ 'opacity-60 !cursor-not-allowed': !resumenStore.plan }" :disabled="!resumenStore.plan" data-tooltip-target="tooltip-home" type="button" class="text-gray-500 inline-flex flex-col items-center justify-center px-5 rounded-s-full hover:text-blue-600  group" @click="$emit('sharepass')">
        <Cog6ToothIcon class="w-6 h-6 " />
        <p class="text-xs mt-0.5">
          {{ $t('acceso') }}
        </p>
      </button>

      <button data-tooltip-target="tooltip-wallet" type="button" class="inline-flex flex-col items-center justify-center px-5 hover:text-blue-600  group text-gray-500" @click="$emit('carta')">
        <DocumentTextIcon class="w-6 h-6" />
        <p v-if="!resumenStore.isShowCarta" class="text-xs mt-1">
          {{ $t('carta_xs') }}
        </p>
        <p v-else class="text-xs mt-1">
          Hoja de vida
        </p>
      </button>

      <!-- <div class="flex items-center justify-center">
        <button data-tooltip-target="tooltip-new" type="button" class="inline-flex items-center justify-center w-10 h-10 font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 group focus:ring-4 focus:ring-blue-300 focus:outline-none dark:focus:ring-blue-800">
          <svg width="800px" height="800px" class="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 5.75C3 4.23122 4.23122 3 5.75 3H15.7145C16.5764 3 17.4031 3.34241 18.0126 3.9519L20.0481 5.98744C20.6576 6.59693 21 7.42358 21 8.28553V18.25C21 19.7688 19.7688 21 18.25 21H5.75C4.23122 21 3 19.7688 3 18.25V5.75ZM5.75 4.5C5.05964 4.5 4.5 5.05964 4.5 5.75V18.25C4.5 18.9404 5.05964 19.5 5.75 19.5H6V14.25C6 13.0074 7.00736 12 8.25 12H15.75C16.9926 12 18 13.0074 18 14.25V19.5H18.25C18.9404 19.5 19.5 18.9404 19.5 18.25V8.28553C19.5 7.8214 19.3156 7.37629 18.9874 7.0481L16.9519 5.01256C16.6918 4.75246 16.3582 4.58269 16 4.52344V7.25C16 8.49264 14.9926 9.5 13.75 9.5H9.25C8.00736 9.5 7 8.49264 7 7.25V4.5H5.75ZM16.5 19.5V14.25C16.5 13.8358 16.1642 13.5 15.75 13.5H8.25C7.83579 13.5 7.5 13.8358 7.5 14.25V19.5H16.5ZM8.5 4.5V7.25C8.5 7.66421 8.83579 8 9.25 8H13.75C14.1642 8 14.5 7.66421 14.5 7.25V4.5H8.5Z" fill="currentColor" />
          </svg>
          <span class="sr-only">New item</span>
        </button>
      </div> -->

      <button :class="{ 'opacity-60 !cursor-not-allowed': !resumenStore.plan }" :disabled="!resumenStore.plan" data-tooltip-target="tooltip-settings" type="button" class="text-gray-600 inline-flex flex-col items-center justify-center px-5 hover:text-blue-600  group" @click="$emit('share')">
        <ShareIcon class="w-5 h-5 " />

        <p class="text-xs mt-1">
          {{ $t('share') }}
        </p>
      </button>

      <button data-tooltip-target="tooltip-profile" type="button" class="inline-flex flex-col items-center justify-center px-5 rounded-e-full hover:text-blue-600  group text-gray-600" @click="$emit('save')">
        <svg width="800px" height="800px" class="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 5.75C3 4.23122 4.23122 3 5.75 3H15.7145C16.5764 3 17.4031 3.34241 18.0126 3.9519L20.0481 5.98744C20.6576 6.59693 21 7.42358 21 8.28553V18.25C21 19.7688 19.7688 21 18.25 21H5.75C4.23122 21 3 19.7688 3 18.25V5.75ZM5.75 4.5C5.05964 4.5 4.5 5.05964 4.5 5.75V18.25C4.5 18.9404 5.05964 19.5 5.75 19.5H6V14.25C6 13.0074 7.00736 12 8.25 12H15.75C16.9926 12 18 13.0074 18 14.25V19.5H18.25C18.9404 19.5 19.5 18.9404 19.5 18.25V8.28553C19.5 7.8214 19.3156 7.37629 18.9874 7.0481L16.9519 5.01256C16.6918 4.75246 16.3582 4.58269 16 4.52344V7.25C16 8.49264 14.9926 9.5 13.75 9.5H9.25C8.00736 9.5 7 8.49264 7 7.25V4.5H5.75ZM16.5 19.5V14.25C16.5 13.8358 16.1642 13.5 15.75 13.5H8.25C7.83579 13.5 7.5 13.8358 7.5 14.25V19.5H16.5ZM8.5 4.5V7.25C8.5 7.66421 8.83579 8 9.25 8H13.75C14.1642 8 14.5 7.66421 14.5 7.25V4.5H8.5Z" fill="currentColor" />
        </svg>
        <p class="text-xs mt-0.5">
          {{ $t('download-cv-settings') }}
        </p>
      </button>
      <button data-tooltip-target="tooltip-profile" type="button" class="inline-flex flex-col items-center justify-center px-5 rounded-e-full hover:text-blue-600  group text-gray-600" @click="logout">
        <ArrowRightStartOnRectangleIcon class="w-6 h-6" />
        <p class="text-xs mt-0.5">
          Salir
        </p>
      </button>
    </div>
  </div>
</template>
