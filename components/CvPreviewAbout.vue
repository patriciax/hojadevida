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
      v-if="!resumenStore.isShowCarta"
      class="cv__section-title cv__section-title--main border-b flex items-center gap-2 pb-2.5"
      :class="formSettings.layout === 'one-column' && 'sr-only'"
    >
      <div class="bg-change rounded-full  w-6 h-6 flex justify-center items-center">
        <UserIcon class="icon-style" />
      </div>
      {{ $t("about-me") }}
    </h4>
    <p class="font-light">
      <!-- Avoids unnecessary spaces at the begging while still allowing break lines -->
      <span v-if="!resumenStore.isShowCarta" class="whitespace-pre-wrap">{{ formSettings.aboutme }}</span>
      <span v-else class="whitespace-pre-wrap">{{ resumenStore.carta }}</span>
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
  .bg-change {
  svg {
    color: #0000;
    fill: #000;
  }
}
}
</style>
