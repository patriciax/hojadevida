<script lang="ts" setup>
import { useCvState } from '~/data/useCvState'

const props = defineProps<{
  color?: string
}>()

const { formSettings } = useCvState()
</script>

<template>
  <section>
    LOADING
  </section>
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
    @apply px-2 py-1 rounded text-white text-xs/normal;
    background-color: var(--primary);
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
</style>
