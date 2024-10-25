<script lang="ts" setup>
import { AcademicCapIcon, BriefcaseIcon, FolderIcon, LightBulbIcon, XMarkIcon } from '@heroicons/vue/24/solid'
import Modal from './common/Modal.vue'
import { useCvState } from '~/data/useCvState'
import type { OptionalSection, SectionName, SectionNameList } from '~/types/cvfy'
import useResumenStore from '@/stores/resumen'

const props = defineProps<
  {
    section: SectionName
    name: typeof SectionNameList[SectionName]
  }
>()

const { formSettings } = useCvState()
const displaySection = computed(() => `display${props.section[0].toLocaleUpperCase}${props.section.slice(1)}` as OptionalSection)

const resumenStore = useResumenStore()
const generateIA = ref(false)
const textia = ref('')
const i18n = useI18n()
const currentSection = ref('')
const currentText = ref('')
const currentId = ref('')

async function generateText(entry: any, sec: string) {
  generateIA.value = true
  currentSection.value = sec
  currentText.value = entry.summary
  currentId.value = entry.id

  await resumenStore.getTextIADescription({
    writing: String(entry.summary),
  })
  if (resumenStore.isReady)
    textia.value = resumenStore.textIA
}

function generateTextSection() {
  generateIA.value = false

  const items = formSettings.value[currentSection.value]
  const itemToUpdate = items.find((item: any) => item.id === currentId.value)

  if (itemToUpdate)
    itemToUpdate.summary = textia.value

  resumenStore.resetText()
}

function handledClose() {
  generateIA.value = false
  resumenStore.resetText()
  currentSection.value = ''
  currentText.value = ''
  currentId.value = ''
}
</script>

<template>
  <fieldset class="form__section grid gap-3">
    <expansion-panel :panel-name="$t(name)">
      <template #icon>
        <BriefcaseIcon v-if="section === 'work'" class="icon-style" />
        <AcademicCapIcon v-if="section === 'education'" class="icon-style" />
        <LightBulbIcon v-if="section === 'projects'" class="icon-style" />
        <FolderIcon v-if="section === 'references'" class="icon-style" />
      </template>
      <template #title>
        <legend class="form__legend">
          <template v-if="section === 'work'">
            {{ $t("experience") }}
          </template>
          <template v-else>
            {{ $t(name) }}
          </template>
        </legend>
      </template>
      <template
        v-if="section === 'references'"
        #content
      >
        <div>
          <CvDisplayCheckbox
            v-if="section !== 'worka'"
            class="mb-10"
            :display-section="formSettings[displaySection]"
            :section-name="name"
          />
          <CvDynamicSection
            :section-name="section"
            :reference="formSettings.references"
          />
        </div>
      </template>
      <template v-else #content>
        <div>
          <CvDisplayCheckbox
            v-if="section !== 'worka'"
            class="mb-10"
            :display-section="formSettings[displaySection]"
            :section-name="name"
          />
          <CvDynamicSection
            :section-name="section"
            :entries="formSettings[section]"
            @generateia="generateText($event, section)"
          />
        </div>
      </template>
    </expansion-panel>
  </fieldset>

  <Teleport to="body">
    <Modal v-if="generateIA" with-out-close @close="handledClose">
      <section class="bg-white relative p-10 max-w-xl m-auto rounded-lg">
        <button class="hiddem absolute right-3 top-3 focus:outline-none " @click="handledClose">
          <XMarkIcon class="w-6 text-gray-700" />
        </button>
        <div class="mb-4 text-center">
          <h2 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl ">
            {{ $t('modalia') }}
          </h2>
        </div>
        <div class="flex max-w-md m-auto flex-col lg:gap-2 gap-4 items-center justify-center rtl:space-x-reverse">
          <section class="w-full flex gap-4 items-center " />
          <button v-if="resumenStore.isLoadingIA" type="button" class="w-full text-center h-48 justify-center inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-black bg-transparent border border-gray-300 mb-2  transition ease-in-out duration-150 cursor-not-allowed">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Generando...
          </button>

          <textarea
            v-else
            v-model="textia"
            class="form__control"
            cols="30"
            rows="8"
          />

          <div class="flex gap-2 w-full lg:flex-row flex-col">
            <button class="form__legend text-sm w-full " type="button" @click="generateIA = false" v-text="$t('cancel')" />
            <button class="form__btn text-sm w-full " type="button" @click="generateTextSection" v-text="$t('addnewpasss')" />
          </div>
        </div>
      </section>
    </Modal>
  </Teleport>
</template>

<style>
.form__legend{
  font-size: 14px!important;
}
.icon-style {
  @apply w-4 h-4 text-gray-800;

}
</style>
