<script lang="ts" setup>
import { useCvState } from '~/data/useCvState'
import useResumenStore from '@/stores/resumen'

const props = defineProps<{
  color?: string
}>()
const resumenStore = useResumenStore()

const { formSettings } = useCvState()
</script>

<template>
  <div
    class="flex relative flex-col overflow-hidden gap-4 p-8 py-7 col-span-1 color-print"
    :class="[
      formSettings.profileImageDataUri ? 'py-7' : 'py-8',
      resumenStore.isDownload ? 'no-colors' : props.color === 'black' ? 'bg-[#343434] text-white' : 'bg-[#f9f9f9] text-black',
    ]"
  >
    <div class="absolute z-0  bg-traslate-cv transform  rotate-[48deg]   w-[15rem] h-[35rem]" />
    <CvProfileImageViewer class="border-white border-8 z-50 mb-4 relative" />

    <CvPreviewContact />

    <template v-if="!resumenStore.isShowCarta">
      <div class="border-dashed border-b border-var-color " />
      <CvPreviewSkills class="flex flex-col gap-6" />
      <CvPreviewReferences :color="props.color" />
    </template>
    <CvPreviewSocial :color="props.color" />
  </div>

  <div class="col-span-2">
    <div class=" bg-slate-50 p-10 print-carta mb-[36px]" :class=" resumenStore.isShowCarta ? '' : 'mt-16'">
      <CvPreviewName />
      <CvPreviewTitle />
    </div>

    <section class="px-10 py-4">
      <CvPreviewAbout />
      <div class="py-4" />
      <CvFirmaViewer v-if="resumenStore.isShowCarta" />

      <template v-if="!resumenStore.isShowCarta">
        <CvPreviewExperience />
        <div class="py-4" />
        <CvPreviewEducation />
        <div class="py-4" />

        <CvPreviewProjects />
      </template>
    </section>
  </div>
</template>

<style lang="postcss" scoped>
.cv {
  display: grid;
  grid-template-columns: 1fr 2fr;
  background-image: linear-gradient(to right,
      #f8fafc 33%,
      rgba(255, 255, 255, 0) 0%);

  :deep(&__tags) {
    @apply flex flex-wrap gap-2;
  }

  :deep(&__tag) {
    @apply px-2 py-1 rounded text-xs/normal;
  }

  &__bar {
    @apply my-3 border-slate-100 border bg-slate-100;
    list-style: none;
    padding: 0;

    li {
      @apply flex justify-between;
    }

    li+li {
      @apply mt-3;
    }
  }

}
.border-var-color{
  border-color: var(--primary);
}
.bg-traslate-cv{
  --tw-translate-y: -53.333333%;
  @media (min-width: 768px) {
    --tw-translate-y: -45.333333%;

  }
  --tw-translate-x: -4.5rem;
  background: var(--primary);
}
@media print {
  .print-carta{
    margin: 2px !important;
  }

}
.color-print.no-colors {
  background-color: transparent !important;
  color: inherit !important;

  .bg-traslate-cv {
    display: none !important;
  }

  /* Si tienes otros elementos con colores específicos */
  .border-var-color {
    border-color: #ccc !important;
  }
}
</style>
