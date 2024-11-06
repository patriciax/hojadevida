<script lang="ts" setup>
import { useCvState } from '~/data/useCvState'

defineProps<{
  display?: boolean
  skills: string[]
  skillName: string
  withTags?: boolean
}>()

const { formSettings } = useCvState()
</script>

<template>
  <section
    v-if="display"
    class="cv__section"
    :class="formSettings.layout === 'one-column' && 'flex gap-1 mb-1'"
  >
    <h3
      class="capitalize"
      :class="formSettings.layout === 'one-column' ? 'two-dots inline flex-shrink-0' : 'cv__section-title flex gap-2'"
    >
      <slot v-if="formSettings.layout === 'two-column' || formSettings.layout === 'three-column' || formSettings.layout === 'four-column'" name="icon" />

      {{ skillName }}
    </h3>
    <ul
      class="font-light"
      :class="[{ 'flex flex-wrap': formSettings.layout === 'one-column' }, { cv__list: formSettings.layout !== 'one-column' && !withTags }, { cv__tags: withTags }]"
    >
      <li
        v-for="skill in skills"
        :key="`preview${skill}`"
        :class="[{ comma: formSettings.layout === 'one-column' }, { cv__tag: withTags }]"
      >
        {{ skill }}
      </li>
    </ul>
  </section>
</template>

<style  scoped>
@media print {
  .cv__tag{
    color: #1b1b1b!important;
  }
}
</style>
