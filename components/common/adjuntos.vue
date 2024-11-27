<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ArrowLeftIcon, ArrowRightIcon, XMarkIcon } from '@heroicons/vue/24/solid'
import Modal from './Modal.vue'
import { useCvState } from '~/data/useCvState'
import useResumenStore from '@/stores/resumen'
import LocationStore from '@/stores/address'

const $emit = defineEmits(['close'])
const {
  formSettings,

} = useCvState()
const resumenStore = useResumenStore()
</script>

<template>
  <section>
    <Modal with-out-close @close="$emit('close')">
      <section class="bg-white relative p-10 max-w-xl m-auto rounded-lg">
        <button class="hiddem absolute right-3 top-3 focus:outline-none " @click="$emit('close')">
          <XMarkIcon class="w-6 text-gray-700" />
        </button>
        <div class="mb-4 text-center">
          <h2 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl ">
            {{ $t('Soportes') }}
          </h2>
          <p>Seleciona un soporte para visualizar</p>
        </div>

        <section class="max-h-60 overflow-auto">
          <div v-for="(item, index) in formSettings.soportes" :key="index" class="mb-4 bg-gray-100 hover:bg-gray-200 rounded-md">
            <a :href="item.cargo" target="_blank" class="p-4 w-full flex justify-between">
              <b>{{ item.nameref }}</b>
              <div class="flex items-center gap-2 text-sm text-blue-600">
                <!-- Ver -->
                <ArrowRightIcon class="w-6 float-right" />
              </div>
            </a>
          <!-- <p class="text-sm text-gray-500 dark:text-gray-400">
            <b>Link:</b> <a :href="item.cargo" target="_blank"> {{ item.cargo }}</a>
          </p> -->
          </div>
        </section>
      </section>
    </Modal>
  </section>
</template>
