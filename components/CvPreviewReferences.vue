<script lang="ts" setup>
import { BriefcaseIcon, BuildingOffice2Icon, CheckIcon, EnvelopeIcon, FolderIcon, LightBulbIcon, PhoneArrowDownLeftIcon } from '@heroicons/vue/24/solid'
import { orderEvents, orderEventsREF } from '~/utils/functions'
import { useCvState } from '~/data/useCvState'

const props = defineProps<{
  color?: string
}>()

const { formSettings } = useCvState()

const projectsSorted = computed(() => {
  return orderEventsREF(formSettings.value.references)
})
</script>

<template>
  <section
    v-if="formSettings.displayReferences"
    class="cv__section cv__section--main w-full pt-3"
  >
    <h4 class="cv__section-title  " :class="formSettings.layout === 'two-column' || formSettings.layout === 'three-column' || formSettings.layout === 'four-column' ? 'flex pb-1 gap-2' : ''">
      <div :class="formSettings.layout === 'two-column' || formSettings.layout === 'three-column' || formSettings.layout === 'four-column' ? 'h-6 w-6' : 'w-8 h-7 mr-2'" class="bg-change rounded-full   flex justify-center items-center">
        <FolderIcon class="icon-style" />
      </div>
      {{ $t("references") }}
    </h4>
    <ul class="cv__event">
      <div
        v-for="project in projectsSorted"
        :key="project.id"
      >
        <div class="flex justify-between ">
          <h5 class="cv__section-title cv__section-title--sm ">
            <ul class="tiptap">
              <li class="font-bold mb-1">
                {{ project.nameref }}
              </li>
            </ul>
          </h5>
        </div>
        <div v-if="project.cargo" class="flex gap-2 mb-1">
          <BriefcaseIcon class=" w-4 h-4" />
          <p v-text="project.cargo" />
        </div>
        <div v-if="project.email" class="flex gap-2 mb-1">
          <EnvelopeIcon class=" w-4 h-4" />
          <a :href="`mailto:${project.email}`" v-text="project.email" />
        </div>
        <div v-if="project.company" class="flex gap-2 mb-1">
          <BuildingOffice2Icon class=" w-4 h-4" />
          <p v-text="project.company" />
        </div>
        <div v-if="project.tel" class="flex gap-2 mb-1">
          <PhoneArrowDownLeftIcon class=" w-4 h-4" />
          <a :href="`tel:${project.tel}`" v-text="project.tel" />
        </div>
        <!-- <a
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
        /> -->
      </div>
    </ul>
    <div v-if="formSettings.layout !== 'one-column' " class="border-dashed border-b border-var-color py-4" />
  </section>
</template>

<style lang="postcss" scoped>
.tiptap {
  font-weight: 300;
  line-height: 1.5;
  ul,
  ol {
    list-style: initial;
  }

  li::marker {
    color: var(--primary);
  }
}
.tiptap li::marker {

  color: var(--primary);
}
ul,
  ol {
    @apply pl-[8px];
    list-style: initial;
  }
  .border-var-color{
    border-color: var(--primary);
  }
</style>
