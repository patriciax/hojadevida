<script lang="ts" setup>
import { UserIcon } from '@heroicons/vue/24/solid'
import { useCvState } from '~/data/useCvState'
import useResumenStore from '@/stores/resumen'

const { formSettings } = useCvState()
const resumenStore = useResumenStore()
</script>

<template>
  <section class="cv__section cv__section--main">
    <h4
      v-if="!resumenStore.isShowCarta && formSettings.layout !== 'one-column'"
      class="cv__section-title cv__section-title--main border-b flex items-center gap-2 pb-2.5"
      :class="formSettings.layout === 'one-column' && 'sr-only'"
    >
      <div class="bg-change rounded-full  w-8 h-8 flex justify-center items-center">
        <UserIcon class="icon-style" />
      </div>
      {{ $t("about-me") }}
    </h4>
    <p class="font-light">
      <!-- Avoids unnecessary spaces at the begging while still allowing break lines -->
      <span v-if="!resumenStore.isShowCarta" class="whitespace-pre-wrap">{{ formSettings.aboutme }}</span>
      <template v-else>
        <h3 class="uppercase text-center text-lg font-normal -mt-10 mb-5 print-carta" v-text="$t('carta')" />
        <p v-text="$t('sres')" />
        <span class="whitespace-pre-wrap font-bold" v-text="formSettings.company" />
        <p v-text="$t('recursoshumanos')" />
        <br>

        <p v-text="$t('estimados')" />
        <p class="whitespace-pre-wrap mb-4">
          {{ formSettings.profile }}
        </p>

        <p v-text="`${$t('footercarta')} ${formSettings.company}`" />
        <br>
        <p v-text="$t('atentamente')" />
      </template>
    </p>
  </section>
</template>

<style>
.bg-change {
  background: var(--primary);
svg {
  color: #fff;
}
}

@media print {
  .font-light,.print-carta{
    font-size: 12px;
  }

  .bg-change {
  svg {
    color: #0000;
    fill: #000;
  }
}
}
</style>
