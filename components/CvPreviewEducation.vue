<script lang="ts" setup>
import { AcademicCapIcon } from '@heroicons/vue/24/solid'
import useFormatDate from '~/composables/useFormatDate'
import { orderEvents } from '~/utils/functions'
import { useCvState } from '~/data/useCvState'

const { formSettings } = useCvState()

const formatDate = useFormatDate()

const educationSorted = computed(() => {
  return orderEvents(formSettings.value.education)
})
</script>

<template>
  <section
    v-if="formSettings.displayEducation"
    class="cv__section cv__section--main w-full"
  >
    <h4 class="cv__section-title cv__section-title--main  " :class="formSettings.layout === 'two-column' || formSettings.layout === 'three-column' || formSettings.layout === 'four-column' ? 'border-b flex pb-2.5 gap-2' : ''">
      <div :class="formSettings.layout === 'two-column' || formSettings.layout === 'three-column' || formSettings.layout === 'four-column' ? 'h-6 w-6' : 'w-8 h-7 mr-2'" class="bg-change rounded-full  w-8 h-8 flex justify-center items-center">
        <AcademicCapIcon class="icon-style" />
      </div>
      {{ $t("education") }}
    </h4>
    <ul class="cv__event">
      <li
        v-for="edu in educationSorted"
        :key="edu.id"
      >
        <div class="flex justify-between gap-2 mb-2">
          <h5 class="cv__section-title cv__section-title--sm">
            {{ edu.title }}
          </h5>
          <span class="justify-self-end flex-shrink-0">
            {{ formatDate(edu.from) }} –
            <template v-if="edu.current">{{ $t("current")
            }}</template>
            <template v-else>{{ formatDate(edu.to) }}</template>
          </span>
        </div>
        <p class="justify-self-start col-span-2 my-1">
          {{ edu.location }}
        </p>

        <CvTextEditor
          v-model="edu.summary"
          :read-only="true"
          class="cv__desc"
        />
      </li>
    </ul>
  </section>
</template>
