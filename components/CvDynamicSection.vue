<script setup lang="ts">
import { CheckIcon, TrashIcon } from '@heroicons/vue/24/solid'
import type { CvEvent, CvEventReference, SectionName } from '~/types/cvfy'
import { useCvState } from '~/data/useCvState'

const { sectionName, entries = [] } = defineProps<{
  sectionName: SectionName
  entries: CvEvent[]
  reference: CvEventReference[]
}>()
const { addEntry, addEntryReference, removeEntry } = useCvState()
function focusEditor(id: string) {
  const editorElem = document.getElementById(`${id}-editor`)
  if (editorElem)
    editorElem.focus()
}

const entry = ref({
  current: false,
  to: '',
  id: 1,
})

const maxDate = ref('')

onMounted(() => {
  calculateMaxDate()
})

function calculateMaxDate() {
  const today = new Date()
  const dd = String(today.getDate()).padStart(2, '0')
  const mm = String(today.getMonth() + 1).padStart(2, '0') // Enero es 0!
  const yyyy = today.getFullYear()
  maxDate.value = `${yyyy}-${mm}-${dd}`
}
</script>

<template>
  <div
    v-if="sectionName"
    class="dynamic-section"
  >
    <button
      v-if="sectionName === 'references'"
      class="form__btn col-span-full"
      type="button"
      @click="addEntryReference({ sectionName })"
    >
      {{ $t("add") }} {{ $t(sectionName) }}
    </button>
    <button
      v-else
      class="form__btn col-span-full"
      type="button"
      @click="addEntry({ sectionName })"
    >
      {{ $t("add") }} {{ $t(sectionName) }}
    </button>
    <ul v-if="sectionName === 'references'" class="col-span-full">
      <li
        v-for="entry in reference"
        :key="entry.id"
      >
        <expansion-panel
          :panel-name="`${entry.nameref}`"
          class="mb-3 gap-10"
        >
          <template #title>
            <h3 class="form__legend form__legend--small dynamic-section__title">
              <span v-if="entry.nameref">
                {{ entry.nameref }}
              </span>
              <span v-else class="text-gray-600">Añade información</span>
            </h3>
          </template>
          <template #action-button>
            <button
              :aria-label="`Remove ${entry.nameref} ${$t(sectionName)} from CV`"
              type="button"
              class="form__btn form__btn--delete btn-transparent mr-3 group"
              @click.stop="removeEntry({ sectionName, entry })"
            >
              <!-- <svg class="form__icon">
                <use href="@/assets/sprite.svg#trash" />
              </svg> -->
              <TrashIcon class="text-red-600 group-hover:text-white h-5 w-5" />
            </button>
          </template>
          <template #content>
            <div class="dynamic-section">
              <div class="form__group col-span-full">
                <label
                  class="form__label"
                  :for="`entryTitle--${entry.id}`"
                >

                  {{ $t("name") }}
                </label>
                <input
                  :id="`entryTitle--${entry.id}`"
                  v-model="entry.nameref"
                  class="form__control"
                  type="text"
                >
              </div>
              <div class="form__group col-span-full">
                <label
                  class="form__label"
                  :for="`entryLocation-${entry.id}`"
                >

                  Cargo

                </label>
                <input
                  :id="`entryLocation-${entry.id}`"
                  v-model="entry.cargo"
                  class="form__control"
                  type="text"
                >
              </div>
              <div class="form__group col-span-full">
                <label
                  class="form__label"
                  :for="`entryLocation-${entry.id}`"
                >

                  Empresa

                </label>
                <input
                  :id="`entryLocation-${entry.id}`"
                  v-model="entry.company"
                  class="form__control"
                  type="text"
                >
              </div>
              <div class="form__group col-span-full">
                <label
                  class="form__label"
                  :for="`entryLocation-${entry.id}`"
                >

                  Email

                </label>
                <input
                  :id="`entryLocation-${entry.id}`"
                  v-model="entry.email"
                  class="form__control"
                  type="text"
                >
              </div>
              <div class="form__group col-span-full">
                <label
                  class="form__label"
                  :for="`entryLocation-${entry.id}`"
                >

                  {{ $t("tel") }}

                </label>
                <input
                  :id="`entryLocation-${entry.id}`"
                  v-model="entry.tel"
                  class="form__control"
                  type="text"
                >
              </div>
            </div>
          </template>
        </expansion-panel>
      </li>
    </ul>
    <ul v-else class="col-span-full">
      <li
        v-for="entry in entries"
        :key="entry.id"
      >
        <expansion-panel
          :panel-name="`${entry.title}`"
          class="mb-3 gap-10"
        >
          <template #title>
            <h3 class="form__legend form__legend--small dynamic-section__title">
              <span v-if="entry.title">
                {{ entry.title }}
              </span>

              <span v-else class="text-gray-600">Añade información</span>
            </h3>
          </template>
          <template #action-button>
            <button
              :aria-label="`Remove ${entry.title} ${$t(sectionName)} from CV`"
              type="button"
              class="form__btn form__btn--delete btn-transparent group mr-3"
              @click.stop="removeEntry({ sectionName, entry })"
            >
              <!-- <svg class="form__icon">
                <use href="@/assets/sprite.svg#trash" />
              </svg> -->
              <TrashIcon class="text-red-600 group-hover:text-white h-5 w-5" />
            </button>
          </template>
          <template #content>
            <div class="dynamic-section">
              <div class="form__group col-span-full">
                <label
                  class="form__label"
                  :for="`entryTitle--${entry.id}`"
                >
                  <template v-if="sectionName === 'education'">
                    {{ $t("title_edu") }}

                  </template>
                  <template v-if="sectionName === 'projects'" />
                  <template v-if="sectionName === 'work'">   {{ $t("title_company") }}</template>
                  <template v-else-if="sectionName === 'projects'">
                    {{ $t("title") }}
                  </template>
                </label>
                <input
                  :id="`entryTitle--${entry.id}`"
                  v-model="entry.title"
                  class="form__control"
                  type="text"
                >
              </div>
              <div class="form__group col-span-full">
                <label
                  class="form__label"
                  :for="`entryLocation-${entry.id}`"
                >
                  <template v-if="sectionName === 'projects'">
                    Link
                  </template>
                  <template v-else-if="sectionName === 'education'">
                    {{ $t("tituloabtenido") }}
                  </template>
                  <template v-else>
                    {{ $t("location") }}
                  </template>
                </label>
                <input
                  :id="`entryLocation-${entry.id}`"
                  v-model="entry.location"
                  class="form__control"
                  type="text"
                >
              </div>
              <div class="form__group col-span-full">
                <label
                  class="form__label"
                  :for="`entryFrom-${entry.id}`"
                >

                  <template v-if="sectionName === 'work'">   {{ $t("retiro") }}</template>
                  <template v-if="sectionName === 'education'">   {{ $t("fechainicio") }}</template>
                  <template v-if="sectionName === 'projects' || sectionName === 'references'">
                    {{ $t("from")
                    }}
                  </template>

                </label>
                <input
                  :id="`entryFrom-${entry.id}`"
                  v-model="entry.from"
                  class="form__control"
                  type="date"
                >
              </div>
              <div class="form__group col-span-full">
                <label
                  class="form__label flex justify-between"
                  :for="`entryTo-${entry.id}`"
                >
                  <template v-if="sectionName === 'work'">   {{ $t("noretiro") }}</template>
                  <template v-if="sectionName === 'education'">   {{ $t("fechafin") }}</template>
                  <template v-if="sectionName === 'projects' || sectionName === 'references'">
                    {{ $t("to") }}
                  </template>

                  <label class="form__label flex items-center">
                    <input
                      v-model="entry.current"
                      class="form__control form__control--checkbox"
                      type="checkbox"
                    >
                    {{ $t("current") }}
                  </label>
                </label>
                <input
                  v-if="!entry.current"
                  :id="`entryTo-${entry.id}`"
                  v-model="entry.to"
                  class="form__control"
                  type="date"
                  :max="sectionName === 'education' ? maxDate : undefined"
                >
              </div>
              <div class="form__group col-span-full">
                <label
                  class="form__label"
                  :for="`entrySummary-${entry.id}`"
                  @click="focusEditor(`entrySummary-${entry.id}`)"
                >
                  <template v-if="sectionName === 'work'">
                    {{ $t("funcion") }}
                  </template>

                  <template v-else>

                    {{ $t("summary")
                    }}
                  </template>
                </label>
                <CvTextEditor
                  :id="`entrySummary-${entry.id}`"
                  v-model="entry.summary"
                  class="form__control"
                  :read-only="false"
                />
              </div>
            </div>
          </template>
        </expansion-panel>
      </li>
    </ul>
  </div>
</template>

<style lang="postcss" scoped>
.dynamic-section {
  @apply grid grid-cols-2 gap-x-3 gap-y-4;

  &__title {
    @apply flex items-center flex-row-reverse;
  }
}
.form__btn--delete {
  background-color: transparent;
}
</style>
