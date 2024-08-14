<script lang="ts" setup>
import { BriefcaseIcon } from '@heroicons/vue/24/solid'
import useFormatDate from '~/composables/useFormatDate'
import { orderEvents } from '~/utils/functions'
import { useCvState } from '~/data/useCvState'

const { formSettings } = useCvState()

const formatDate = useFormatDate()

const workSorted = computed(() => {
  return orderEvents(formSettings.value.work)
})
</script>

<template>
  <section
    v-if="formSettings.displayWork"
    class="cv__section cv__section--main w-full"
  >
    <h4 class="cv__section-title cv__section-title--main " :class="formSettings.layout === 'two-column' || formSettings.layout === 'three-column' || formSettings.layout === 'four-column' ? 'border-b flex gap-2 pb-2.5' : ''">
      <div :class="formSettings.layout === 'two-column' || formSettings.layout === 'three-column' || formSettings.layout === 'four-column' ? 'h-6 w-6' : 'w-8 h-7 mr-2'" class="bg-change rounded-full   flex justify-center items-center">
        <BriefcaseIcon class="icon-style" />
      </div>
      {{ $t("experience") }}
    </h4>
    <ul class="cv__event">
      <li
        v-for="job in workSorted"
        :key="job.id"
      >
        <div class="flex justify-between gap-2 ">
          <h5 class="cv__section-title cv__section-title--sm">
            {{ job.title }}
          </h5>
          <span class="justify-self-end">
            {{ formatDate(job.from) }} –
            <template v-if="job.current">{{ $t("current")
            }}</template>
            <template v-else>
              {{ formatDate(job.to) }}
            </template>
          </span>
        </div>
        <p class="justify-self-center my-2">
          {{ job.location }}
        </p>

        <CvTextEditor
          v-model="job.summary"
          :read-only="true"
          class="cv__desc"
        />
      </li>
    </ul>
  </section>
</template>
