<script lang="ts" setup>
import { defineComponent } from 'vue'
import CvPreviewThreeColumn from './CvPreviewThreeColumn.vue'
import { useCvState } from '~/data/useCvState'

const props = defineProps<{
  color?: string
  loading?: boolean
}>()
const { isLoading, formSettings } = useCvState()
</script>

<template>
  <div
    class="
 overflow-y-auto overflow-x-hidden
    cvWrapper
    font-normal
    text-slate-800 text-sm/normal
    bg-white
    relative
    w-full

    pt-0
    px-0
    p-6
    flex
    flex-col
    items-center
    "
  >
    <slot />

    <div class="font-selected" style="min-height: var(--height);">
      <div
        id="elemento-a-exportar"
        tabindex="0"
        aria-label="CV preview"
        class="cv shadow-lg mt-6 lg:mt-24 bg-white relative"
        :class="[

          { blur: isLoading || props.loading },
          formSettings.layout === 'one-column' && 'p-10 flex flex-col gap-4',
          formSettings.layout === 'two-column' && 'grid grid-cols-3 ',
          formSettings.layout === 'three-column' && 'grid grid-cols-2',
          formSettings.layout === 'four-column' && 'grid grid-cols-3 ',
        ]"
      >
        <template v-if="formSettings.layout === 'one-column'">
          <CvPreviewOneColumn />
        </template>

        <template v-if="formSettings.layout === 'two-column' ">
          <CvPreviewTwoColumn :color="props.color" />
        </template>
        <template v-if="formSettings.layout === 'three-column'">
          <CvPreviewThreeColumn :color="props.color" />
        </template>
        <template v-if="formSettings.layout === 'four-column'">
          <CvPreviewFourColumn :color="props.color" />
        </template>
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
p {
  @apply leading-normal;
}

.credit {
  @apply p-3 text-slate-700 text-center w-full text-xs/normal;
}

.cvWrapper {
  @media print {
    position: unset;
    margin: 0;
    padding: 0;

    & .cv {
      width: auto;
      height: auto;
      min-width: auto;
      min-height: var(--height);
      margin: 0;
      border: none;
      padding: 0;
      transform: none;
      box-shadow: none;
    }

    & .credit {
      display: none;
    }
  }
}

.cv {
  --height: 29.69cm;
  width: 21cm;
  min-width: 21cm;
  max-width: 21cm;
  min-height: var(--height);
  word-break: break-word;
  transform: scale(0.4);
  transform-origin: center top;

  @media screen and (min-width: 425px) {
    transform: scale(0.45);
  }

  @media screen and (min-width: 768px) {
    transform: scale(0.8);
  }

  @media screen and (min-width: 1024px) {
    transform: scale(0.7);
    transform-origin: top;
    min-width: 25cm;

  }

  &__pages {
    position: absolute;
    right: -5%;
    left: -5%;
    background-image: linear-gradient(to right,
        grey 50%,
        rgba(255, 255, 255, 0) 0%);
    background-size: 20px 1px;
    background-repeat: repeat-x;

    @media print {
      display: none;
    }
  }

  :deep(&__section-title) {
    @apply text-base uppercase mb-5 font-bold tracking-wide;

    &--sm {
      @apply text-sm/normal mb-0;
      text-transform: none;

    }

    &--main {
      color: #000;
      border-color: var(--primary);
    }
    &--icon-content{
      svg{
        @apply w-1 h-1;
      }
    }

  }

  :deep(&__icon-wrapper) {
    @apply flex font-light gap-1 items-center;

    a,
    span {
      margin-top: 2px;
    }
  }

  :deep(&__icon) {
    @apply fill-current rounded;
    width: 16px;
    height: 16px;
    min-width: 16px;
  }

  :deep(&__list) {
    font-weight: 300;
    list-style: inside;

    ::marker {
      color: var(--primary);
    }
  }

  :deep(&__event) {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
}

.blur {
  filter: blur(5px);
  min-height: var(--height);
}

@media print {
  nav {
    display: none;
  }
}
</style>
