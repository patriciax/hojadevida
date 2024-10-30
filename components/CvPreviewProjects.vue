<script lang="ts" setup>
import { LightBulbIcon } from '@heroicons/vue/24/solid'
import useFormatDate from '~/composables/useFormatDate'
import { orderEvents } from '~/utils/functions'
import { useCvState } from '~/data/useCvState'

const { formSettings } = useCvState()

const projectsSorted = computed(() => {
  return orderEvents(formSettings.value.projects)
})

const formatDate = useFormatDate()
</script>

<template>
  <section
    v-if="formSettings.displayProjects"
    class="cv__section cv__section--main w-full"
  >
    <h4 class="cv__section-title cv__section-title--main " :class="formSettings.layout === 'two-column' || formSettings.layout === 'three-column' || formSettings.layout === 'four-column' ? 'border-b flex pb-2.5 gap-2' : ''">
      <div :class="formSettings.layout === 'two-column' || formSettings.layout === 'three-column' || formSettings.layout === 'four-column' ? 'w-8 h-8' : 'w-8 h-7 mr-2'" class="bg-change rounded-full   flex justify-center items-center">
        <LightBulbIcon class="icon-style" />
      </div>
      {{ $t("projects") }}
    </h4>
    <ul class="cv__event">
      <li
        v-for="project in projectsSorted"
        :key="project.id"
      >
        <div class="flex justify-between">
          <h5 class="cv__section-title cv__section-title--sm">
            {{ project.title }}
          </h5>
          <span>
            {{ formatDate(project.from) }} –
            <template v-if="project.current">{{
              $t("current")
            }}</template>
            <template v-else>{{ formatDate(project.to) }}</template>
          </span>
        </div>
        <a
          class="font-thin italic underline-offset-2 underline mb-2"
          target="_blank"
          rel="noopener"
          :href="project.location"
        >
          {{ project.location }}
        </a>
        <CvTextEditor
          v-model="project.summary"
          :read-only="true"
          class="cv__desc"
        />
      </li>
    </ul>
  </section>
</template>
