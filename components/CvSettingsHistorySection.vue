<script lang="ts" setup>
import { AcademicCapIcon, BriefcaseIcon, LightBulbIcon } from '@heroicons/vue/24/solid'
import { useCvState } from '~/data/useCvState'
import type { OptionalSection, SectionName, SectionNameList } from '~/types/cvfy'

const props = defineProps<
  {
    section: SectionName
    name: typeof SectionNameList[SectionName]
  }
>()

const { formSettings } = useCvState()
const displaySection = computed(() => `display${props.section[0].toLocaleUpperCase}${props.section.slice(1)}` as OptionalSection)
</script>

<template>
  <fieldset class="form__section grid gap-3">
    <expansion-panel :panel-name="$t(name)">
      <template #icon>
        <BriefcaseIcon v-if="section === 'work'" class="icon-style" />
        <AcademicCapIcon v-if="section === 'education'" class="icon-style" />
        <LightBulbIcon v-if="section === 'projects'" class="icon-style" />
      </template>
      <template #title>
        <legend class="form__legend">
          {{ $t(name) }}
        </legend>
      </template>
      <template #content>
        <div>
          <CvDisplayCheckbox
            v-if="section !== 'work'"
            class="mb-10"
            :display-section="formSettings[displaySection]"
            :section-name="name"
          />
          <CvDynamicSection
            :section-name="section"
            :entries="formSettings[section]"
          />
        </div>
      </template>
    </expansion-panel>
  </fieldset>
</template>

<style>
.form__legend{
  font-size: 14px!important;
}
.icon-style {
  @apply w-4 h-4 text-gray-800;

}
</style>
