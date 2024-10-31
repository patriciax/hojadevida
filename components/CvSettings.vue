<script setup lang="ts">
import { ArrowRightStartOnRectangleIcon, BeakerIcon, ChartPieIcon, ChatBubbleOvalLeftIcon, CloudArrowDownIcon, Cog6ToothIcon, DocumentTextIcon, PrinterIcon, ShareIcon, TrophyIcon, UserIcon, XMarkIcon } from '@heroicons/vue/24/solid'
import type { p } from '@vite-pwa/assets-generator/dist/shared/assets-generator.5e51fd40.mjs'
import { get } from '@vueuse/core'
import { useRouter } from 'vue-router'
import Nav from './Nav.vue'
import Modal from './common/Modal.vue'
import InputPhoneNumber from '@/components/common/InputPhoneNumber.vue'
import { SectionNameList } from '~/types/cvfy'
import { useCvState } from '~/data/useCvState'
import useResumenStore from '@/stores/resumen'
import LocationStore from '@/stores/address'
import useLoginStore from '@/stores/auth'

const props = defineProps<{
  isLoading?: boolean
  id?: string
}>()
const emit = defineEmits(['color'])
const loginStore = useLoginStore()
const router = useRouter()

const resumenStore = useResumenStore()
const locationStore = LocationStore()
const generateIA = ref(false)
const {
  formSettings,
  clearForm,
  myForm,
  resetForm,
} = useCvState()
const countryCode = ref(null)
const countryCodeName = ref(null)
const isOpen = ref(false)

onMounted(async () => {
  await locationStore.getCountry()
  if (resumenStore.formSettings?.country) {
    if (Object.keys(resumenStore.formSettings?.country).length > 0)
      await locationStore.getCity(formSettings.value.country.id)
  }
})

const switchLocalePath = useSwitchLocalePath()
const i18n = useI18n()
const { downloadPdf } = usePrint()
const bgCv = ref('white')
const config = {
  layouts: ['one-column', 'two-column', 'three-column', 'four-column'],
  selectedColor: resumenStore.formSettings?.activeColor ? resumenStore.formSettings?.activeColor : '#545454',
  languages: [
    { name: 'es-name', code: 'es' },
    { name: 'en-name', code: 'en' },

  ],
}

watch(bgCv, (newColor) => {
  localStorage.setItem('bgCv', newColor)
  emit('color', newColor)
  localStorage.setItem(`cvSettings-${i18n.locale.value}`, JSON.stringify({
    ...formSettings.value,
    bgCv: newColor,
  }))
})

watch(
  () => formSettings.value,
  (newValue, oldValue) => {
    localStorage.setItem(`cvSettings-${i18n.locale.value}`, JSON.stringify(newValue))
    if (newValue.activeColor !== oldValue.activeColor) {
      const newColor = config.selectedColor
      changeColor(resumenStore.formSettings?.activeColor ? resumenStore.formSettings?.activeColor : newColor)
      bgCv.value = resumenStore.formSettings?.bgCv ? resumenStore.formSettings?.bgCv : 'white'
    }
  },
  { deep: true },
)
watch(
  () => formSettings.value,
  (newValue, oldValue) => {
    if (JSON.stringify(oldValue) !== JSON.stringify(formSettings.value))
      localStorage.setItem(`cvSettingsMyData-${i18n.locale.value}`, JSON.stringify(oldValue))
  },
  { deep: true },
)

watch (
  () => resumenStore.isShowCarta,
  (newValue) => {
    if (newValue)
      setProfile()
  },
)

async function saveCV() {
  await resumenStore.addCvSettings(JSON.stringify({ formSettings: {
    ...formSettings.value,
    countryCode: countryCode.value,
    countryCodeName: countryCodeName.value,
    bgCv: bgCv.value,
  } }))

  if (resumenStore.isReady) {
    useNuxtApp().$toast.success('¡Hoja de vida guardado!')
    await resumenStore.getDataUser()
  }
  else { useNuxtApp().$toast.error('Error al guardar hoja de vida') }
}

async function saveCarta() {
  await resumenStore.addCvSettings(JSON.stringify({ formSettings: {
    ...formSettings.value,
    company: formSettings.value.company,
    profile: formSettings.value.profile,
  } }))

  if (resumenStore.isReady)
    useNuxtApp().$toast.success('¡Carta guardada!')
}

const availableLocales = computed(() => {
  return i18n.localeCodes.value.filter((locale: any) => !locale.includes('-'))
})

function changeColor(color: string): void {
  config.selectedColor = color
  document.documentElement.style.setProperty('--primary', color)
  document.documentElement.style.setProperty('--primary-darker', darkenColor(color))
  formSettings.value.activeColor = color

  localStorage.setItem(`cvSettings-${i18n.locale.value}`, JSON.stringify({
    ...formSettings.value,
    activeColor: color,
  }))
}

function darkenColor(color: string, amount = 0.4): string {
  const [r, g, b] = color.match(/\w\w/g)!.map(x => Number.parseInt(x, 16))
  return `#${[
    Math.round(Math.max(0, r - r * amount)).toString(16).padStart(2, '0'),
    Math.round(Math.max(0, g - g * amount)).toString(16).padStart(2, '0'),
    Math.round(Math.max(0, b - b * amount)).toString(16).padStart(2, '0'),
  ].join('')}`
}

const newUrl = ref('https://bucolic-souffle-ead4bd.netlify.app/app/')
// https://bucolic-souffle-ead4bd.netlify.app/resume/
async function copyLink() {
  const url = `${newUrl.value}${resumenStore.data.id}`
  await navigator.clipboard.writeText(url)

  useNuxtApp().$toast.success('¡Link copiado al portapapeles!')
}
function goToRoute() {
  const url = `${newUrl.value}${resumenStore.data.id}`
  window.open(url, '_blank'); copyLink()
}

function shared(id: any) {
  const _url = `${newUrl.value}${resumenStore.data.code_url}`

  if (navigator.share) {
    navigator.share({
      title: 'CV',
      text: 'Descubre mi hoja de vida digital:',
      url: _url,
    }).then(() => {
      console.log('¡Enlace compartido con éxito!')
    }).catch((error) => {
      console.error('Error al compartir el enlace:', error)
      alert(`Ocurrió un error al intentar compartir el enlace: ${error}`)
    })
  }
  else {
    goToRoute()
  }
}

function changeFont(font: string) {
  formSettings.value.font = font
}
function handleInputPhone(value: any) {
  const number = value.nationalNumber
  formSettings.value.phoneNumber = `${number}`
}

async function handleInputCountry(_value: any) {
  await locationStore.getCity(_value.id)
}

function logout() {
  loginStore.reset()
  localStorage.removeItem(`cvSettings-${i18n.locale.value}`)
  router.push({ path: '/login' })
}

const dataIA = ref({
  profile: '',
  textIA: '',
})
async function generateAboutIa(text: string) {
  generateIA.value = true
  await resumenStore.getTextIA({
    profile: String(text),
  })
  if (resumenStore.isReady)
    dataIA.value.profile = resumenStore.textIA
}

function getText() {
  formSettings.value.aboutme = dataIA.value.profile
  generateIA.value = false
}

async function sendCarta() {
  await resumenStore.getCarta({
    company: formSettings.value.company,
    job: formSettings.value.jobTitle,
    profile: formSettings.value.profile,
  })

  if (resumenStore.isReady) {
    formSettings.value.profile = resumenStore.carta
    useNuxtApp().$toast.success('¡Carta generada!')
    await resumenStore.addCvSettings(JSON.stringify({ formSettings: {
      ...formSettings.value,
      company: formSettings.value.company,
      profile: formSettings.value.profile,
    } }))
  }
}

function setProfile() {
  if (!formSettings.value.profile)
    formSettings.value.profile = formSettings.value.aboutme || ''

  if (!formSettings.value.company)
    formSettings.value.company = 'Compañia'
}

function showCarta() {
  resumenStore.showAccess(false)
  if (resumenStore.isShowCarta)
    resumenStore.showCarta(false)
  else
    resumenStore.showCarta(true)
}
function showAccessModal() {
  resumenStore.showCarta(false)

  if (resumenStore.openAccess)
    resumenStore.showAccess(false)
  else
    resumenStore.showAccess(true)
}

function save() {
  if (resumenStore.isShowCarta)
    saveCarta()
  else
    saveCV()
}
</script>

<template>
  <div class="settings">
    <div class="flex justify-center items-center title pt-2 px-6 bg-white  py-3">
      <LandingLogo @toggle-sidebar="isOpen = !isOpen">
        <button
          class="flex gap-2 text-sm md:hidden text-gray-700 hover:bg-gray-200 justify-center items-center border border-gray-300 px-2 py-1.5 rounded-lg"

          rel="noopener"
          @click="saveCV"
        >
          <svg width="800px" height="800px" class="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 5.75C3 4.23122 4.23122 3 5.75 3H15.7145C16.5764 3 17.4031 3.34241 18.0126 3.9519L20.0481 5.98744C20.6576 6.59693 21 7.42358 21 8.28553V18.25C21 19.7688 19.7688 21 18.25 21H5.75C4.23122 21 3 19.7688 3 18.25V5.75ZM5.75 4.5C5.05964 4.5 4.5 5.05964 4.5 5.75V18.25C4.5 18.9404 5.05964 19.5 5.75 19.5H6V14.25C6 13.0074 7.00736 12 8.25 12H15.75C16.9926 12 18 13.0074 18 14.25V19.5H18.25C18.9404 19.5 19.5 18.9404 19.5 18.25V8.28553C19.5 7.8214 19.3156 7.37629 18.9874 7.0481L16.9519 5.01256C16.6918 4.75246 16.3582 4.58269 16 4.52344V7.25C16 8.49264 14.9926 9.5 13.75 9.5H9.25C8.00736 9.5 7 8.49264 7 7.25V4.5H5.75ZM16.5 19.5V14.25C16.5 13.8358 16.1642 13.5 15.75 13.5H8.25C7.83579 13.5 7.5 13.8358 7.5 14.25V19.5H16.5ZM8.5 4.5V7.25C8.5 7.66421 8.83579 8 9.25 8H13.75C14.1642 8 14.5 7.66421 14.5 7.25V4.5H8.5Z" fill="#212121" />
          </svg>
          {{ $t("download-cv-settings") }}
        </button>
      </LandingLogo>
    </div>

    <Nav>
      <button
        type="button"
        class="flex gap-2 text-gray-700 hover:bg-gray-200 justify-center items-center border border-gray-300 px-2 py-1.5 rounded-lg text-sm"
        @click="downloadPdf"
      >
        <PrinterIcon class="w-4 h-4" />
        <span>{{ $t("download-cv-pdf") }}</span>
      </button>

      <button
        v-if="!resumenStore.isShowCarta"

        class="flex gap-2 text-gray-700 text-sm hover:bg-gray-200 justify-center items-center border border-gray-300 px-2 py-1.5 rounded-lg"

        rel="noopener"
        @click="saveCV"
      >
        <svg width="800px" height="800px" class="w-4 h-4  text-gray-700" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 5.75C3 4.23122 4.23122 3 5.75 3H15.7145C16.5764 3 17.4031 3.34241 18.0126 3.9519L20.0481 5.98744C20.6576 6.59693 21 7.42358 21 8.28553V18.25C21 19.7688 19.7688 21 18.25 21H5.75C4.23122 21 3 19.7688 3 18.25V5.75ZM5.75 4.5C5.05964 4.5 4.5 5.05964 4.5 5.75V18.25C4.5 18.9404 5.05964 19.5 5.75 19.5H6V14.25C6 13.0074 7.00736 12 8.25 12H15.75C16.9926 12 18 13.0074 18 14.25V19.5H18.25C18.9404 19.5 19.5 18.9404 19.5 18.25V8.28553C19.5 7.8214 19.3156 7.37629 18.9874 7.0481L16.9519 5.01256C16.6918 4.75246 16.3582 4.58269 16 4.52344V7.25C16 8.49264 14.9926 9.5 13.75 9.5H9.25C8.00736 9.5 7 8.49264 7 7.25V4.5H5.75ZM16.5 19.5V14.25C16.5 13.8358 16.1642 13.5 15.75 13.5H8.25C7.83579 13.5 7.5 13.8358 7.5 14.25V19.5H16.5ZM8.5 4.5V7.25C8.5 7.66421 8.83579 8 9.25 8H13.75C14.1642 8 14.5 7.66421 14.5 7.25V4.5H8.5Z" fill=" #374151" />
        </svg>
        {{ $t("download-cv-settings") }}
      </button>
      <button
        v-else

        class="flex gap-2 text-gray-700 text-sm hover:bg-gray-200 justify-center items-center border border-gray-300 px-2 py-1.5 rounded-lg"

        rel="noopener"
        @click=" saveCarta"
      >
        <svg width="800px" height="800px" class="w-4 h-4  text-gray-700" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 5.75C3 4.23122 4.23122 3 5.75 3H15.7145C16.5764 3 17.4031 3.34241 18.0126 3.9519L20.0481 5.98744C20.6576 6.59693 21 7.42358 21 8.28553V18.25C21 19.7688 19.7688 21 18.25 21H5.75C4.23122 21 3 19.7688 3 18.25V5.75ZM5.75 4.5C5.05964 4.5 4.5 5.05964 4.5 5.75V18.25C4.5 18.9404 5.05964 19.5 5.75 19.5H6V14.25C6 13.0074 7.00736 12 8.25 12H15.75C16.9926 12 18 13.0074 18 14.25V19.5H18.25C18.9404 19.5 19.5 18.9404 19.5 18.25V8.28553C19.5 7.8214 19.3156 7.37629 18.9874 7.0481L16.9519 5.01256C16.6918 4.75246 16.3582 4.58269 16 4.52344V7.25C16 8.49264 14.9926 9.5 13.75 9.5H9.25C8.00736 9.5 7 8.49264 7 7.25V4.5H5.75ZM16.5 19.5V14.25C16.5 13.8358 16.1642 13.5 15.75 13.5H8.25C7.83579 13.5 7.5 13.8358 7.5 14.25V19.5H16.5ZM8.5 4.5V7.25C8.5 7.66421 8.83579 8 9.25 8H13.75C14.1642 8 14.5 7.66421 14.5 7.25V4.5H8.5Z" fill=" #374151" />
        </svg>
        {{ $t("download-cv-settings") }}
      </button>
    </Nav>
    <button
      v-if="!resumenStore.isShowCarta"
      class="fixed bottom-0 h-12 w-12 z-10 hover:bg-gray-200 right-5 lg:right-10 mb-10 pr-1 rounded-full text-center items-center justify-center bg-primary hover:bg-primary-darker flex"
      :style="`background: ${resumenStore.formSettings?.activeColor}` || '#0000'"

      type="button"
      @click="shared(props.id)"
    >
      <ShareIcon class="w-6 h-6 text-white" />
    </button>
    <form
      :class="`form ${isOpen ? 'block' : 'hidden lg:block'}`"
      class="form mb-10 transition-all"
      autocomplete="on"
    >
      <fieldset>
        <ExpansionPanel :panel-name="$t('general')">
          <template #icon>
            <Cog6ToothIcon class="icon-style" />
          </template>
          <template #title>
            <legend class="form__legend">
              {{ $t("general") }}
            </legend>
          </template>
          <template #content>
            <div class=" gap-x-3 gap-y-10">
              <div class="form__section ">
                <button
                  class="form__btn form__btn--ghost text-sm"
                  type="button"
                  @click="resetForm"
                >
                  {{ $t("reset-settings") }}
                </button>
                <button
                  class="form__btn form__btn--ghost text-sm"
                  type="button"
                  @click="myForm"
                >
                  {{ $t("mysettings") }}
                </button>
                <button
                  class="form__btn form__btn--ghost text-sm"
                  type="button"
                  @click="clearForm"
                >
                  {{ $t("clear-settings") }}
                </button>
              </div>

              <!-- LANGUAGE -->
              <fieldset class="form__section ">
                <legend class="form__legend">
                  {{ $t("cv-language") }}
                </legend>
                <div class="flex flex-wrap gap-2 justify-start w-full">
                  <nuxt-link
                    v-for="locale in availableLocales"
                    :key="locale"
                    class="form__btn form__btn--ghost text-sm"
                    :to="switchLocalePath(locale)"
                    :exact="true"
                  >
                    {{ $t(`${locale}-name`) }}
                  </nuxt-link>
                </div>
              </fieldset>
              <!-- LANGUAGE -->

              <!-- LAYOUT -->
              <fieldset class="form__section pt-3 ">
                <legend class="form__legend">
                  {{ $t("layout-theme") }}
                </legend>
                <div class="grid grid-cols-4 gap-4 justify-start">
                  <label
                    v-for="layout in config.layouts"
                    :key="layout"
                    tabindex="0"
                    class=" capitalize cursor-pointer "
                    :class="[
                      {
                        '  ':
                          layout === formSettings.layout,
                      },
                    ]"
                  >
                    <!-- {{ $t(layout) }} -->
                    <!-- <template v-if="layout === 'one-column'">
                      <svg
                        height="39" viewBox="0 0 60 39" fill="none" xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect
                          width="60" height="39" rx="3" fill="#8A8A8A"
                        />
                      </svg>

                    </template>
                    <template v-if="layout === 'three-column'">
                      <svg width="59" height="39" viewBox="0 0 59 39" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="31" width="28" height="39" rx="3" fill="#8A8A8A" />
                        <rect x="31" width="28" height="39" rx="3" fill="#8A8A8A" />
                        <rect x="31" width="28" height="39" rx="3" fill="#8A8A8A" />
                        <rect width="28" height="39" rx="3" fill="#8A8A8A" />
                        <rect width="28" height="39" rx="3" fill="#8A8A8A" />
                        <rect width="28" height="39" rx="3" fill="#8A8A8A" />
                      </svg>
                    </template>
                    <template v-if="layout === 'two-column'">
                      <svg width="59" height="39" viewBox="0 0 59 39" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="19" height="39" rx="3" fill="#8A8A8A" />
                        <rect width="19" height="39" rx="3" fill="#8A8A8A" />
                        <rect width="19" height="39" rx="3" fill="#8A8A8A" />
                        <rect x="22" width="37" height="39" rx="3" fill="#8A8A8A" />
                        <rect x="22" width="37" height="39" rx="3" fill="#8A8A8A" />
                        <rect x="22" width="37" height="39" rx="3" fill="#8A8A8A" />
                      </svg>

                    </template>

                    <template v-if="layout === 'four-column'">
                      <svg width="59" height="39" viewBox="0 0 59 39" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="40" width="19" height="39" rx="3" fill="#8A8A8A" />
                        <rect x="40" width="19" height="39" rx="3" fill="#8A8A8A" />
                        <rect x="40" width="19" height="39" rx="3" fill="#8A8A8A" />
                        <rect width="37" height="39" rx="3" fill="#8A8A8A" />
                        <rect width="37" height="39" rx="3" fill="#8A8A8A" />
                        <rect width="37" height="39" rx="3" fill="#8A8A8A" />
                      </svg>

                    </template> -->
                    <template v-if="layout === 'one-column'">
                      <svg
                        height="39" viewBox="0 0 60 39" fill="none" xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect
                          width="60" height="39" rx="3" :fill=" layout === formSettings.layout ? '#334155' : '#8A8A8A'"
                        />
                      </svg>

                    </template>
                    <template v-if="layout === 'three-column'">
                      <svg width="59" height="39" viewBox="0 0 59 39" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="31" width="28" height="39" rx="3" :fill=" layout === formSettings.layout ? '#334155' : '#8A8A8A'" />
                        <rect x="31" width="28" height="39" rx="3" :fill=" layout === formSettings.layout ? '#334155' : '#8A8A8A'" />
                        <rect x="31" width="28" height="39" rx="3" :fill=" layout === formSettings.layout ? '#334155' : '#8A8A8A'" />
                        <rect width="28" height="39" rx="3" :fill=" layout === formSettings.layout ? '#334155' : '#8A8A8A'" />
                        <rect width="28" height="39" rx="3" :fill=" layout === formSettings.layout ? '#334155' : '#8A8A8A'" />
                        <rect width="28" height="39" rx="3" :fill=" layout === formSettings.layout ? '#334155' : '#8A8A8A'" />
                      </svg>
                    </template>
                    <template v-if="layout === 'two-column'">
                      <svg width="59" height="39" viewBox="0 0 59 39" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="19" height="39" rx="3" :fill=" layout === formSettings.layout ? '#334155' : '#8A8A8A'" />
                        <rect width="19" height="39" rx="3" :fill=" layout === formSettings.layout ? '#334155' : '#8A8A8A'" />
                        <rect width="19" height="39" rx="3" :fill=" layout === formSettings.layout ? '#334155' : '#8A8A8A'" />
                        <rect x="22" width="37" height="39" rx="3" :fill=" layout === formSettings.layout ? '#334155' : '#8A8A8A'" />
                        <rect x="22" width="37" height="39" rx="3" :fill=" layout === formSettings.layout ? '#334155' : '#8A8A8A'" />
                        <rect x="22" width="37" height="39" rx="3" :fill=" layout === formSettings.layout ? '#334155' : '#8A8A8A'" />
                      </svg>

                    </template>

                    <template v-if="layout === 'four-column'">
                      <svg width="59" height="39" viewBox="0 0 59 39" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="40" width="19" height="39" rx="3" :fill=" layout === formSettings.layout ? '#334155' : '#8A8A8A'" />
                        <rect x="40" width="19" height="39" rx="3" :fill=" layout === formSettings.layout ? '#334155' : '#8A8A8A'" />
                        <rect x="40" width="19" height="39" rx="3" :fill=" layout === formSettings.layout ? '#334155' : '#8A8A8A'" />
                        <rect width="37" height="39" rx="3" :fill=" layout === formSettings.layout ? '#334155' : '#8A8A8A'" />
                        <rect width="37" height="39" rx="3" :fill=" layout === formSettings.layout ? '#334155' : '#8A8A8A'" />
                        <rect width="37" height="39" rx="3" :fill=" layout === formSettings.layout ? '#334155' : '#8A8A8A'" />
                      </svg>

                    </template>
                    <input
                      v-model="formSettings.layout"
                      :value="layout"
                      type="radio"
                      class="sr-only"
                    >
                  </label>
                </div>
              </fieldset>
              <!-- LAYOUT -->
              <fieldset class="form__section pt-3 mt-3 ">
                <legend class="form__legend">
                  {{ $t("layout-fonts") }}
                </legend>
                <section>
                  <SelectFonts :current-font="formSettings.font" @change-font="changeFont" />
                </section>
              </fieldset>

              <!-- COLOR THEME -->
              <fieldset class="form__section">
                <legend class="form__legend">
                  {{ $t("color-theme") }}
                </legend>
                <div class="flex items-center gap-2">
                  <input
                    type="color"
                    class="form__btn form__btn--color-theme w-52 h-10"
                    :value="config.selectedColor"
                    @input="changeColor($event.target.value)"
                  >
                  <span class="capitalize" />
                </div>
              </fieldset>
              <fieldset class="form__section mt-4">
                <legend class="form__legend">
                  {{ $t("color-theme-bg") }}
                </legend>
                <div class="flex gap-4 mb-4 items-center ">
                  <label :class="[bgCv === 'black' ? 'shadow-sm text-gray-800 ' : 'bg-gray-700 text-white']" class=" cursor-pointer text-sm px-4 py-3   rounded-lg">
                    <input v-model="bgCv" type="radio" value="white">
                    Claro
                  </label>
                  <label :class="[bgCv === 'black' ? 'bg-gray-700 text-white' : 'shadow-sm text-gray-800 ']" class="text-sm cursor-pointer  px-4 py-3    rounded-lg">
                    <input v-model="bgCv" type="radio" value="black">
                    Oscuro
                  </label>
                </div>
              </fieldset>

              <!-- <fieldset class="form__section ">

                <div class="flex flex-wrap gap-2 justify-start">
                  <label
                    v-for="color in config.colors"
                    :key="color.color"
                    tabindex="0"
                    class="form__btn form__btn--color-theme capitalize"
                    :class="[
                      `form__btn--${color.name}`,
                      {
                        'form__btn--color-selected':
                          color.color === formSettings.activeColor,
                      },
                    ]"
                    @keydown.enter="changeColor(color.color, color.darker)"
                  >
                    {{ $t(color.name) }}
                    <input
                      v-model="formSettings.activeColor"
                      type="radio"
                      class="sr-only"
                      :value="color.color"
                      @change="changeColor(color.color, color.darker)"
                    >
                  </label>
                </div>
              </fieldset> -->
              <!-- COLOR THEME -->
            </div>
          </template>
        </expansionpanel>
      </fieldset>
      <!-- PERSONAL DETAILS -->
      <fieldset class="form__section ">
        <expansion-panel :panel-name="$t('personal-details')">
          <template #icon>
            <UserIcon class="icon-style" />
          </template>
          <template #title>
            <legend class="form__legend">
              {{ $t("personal-details") }}
            </legend>
          </template>
          <template #content>
            <div class="grid grid-cols-2 gap-x-2 gap-y-4">
              <div class="form__group col-span-full">
                <span class="form__label">{{ $t("profile-image") }} </span>
                <CvProfileImageUploader
                  v-model="formSettings.profileImageDataUri"
                />
              </div>
              <div class="form__group col-span-full">
                <label
                  class="form__label"
                  for="job-pos"
                > {{ $t("job-title") }}</label>
                <input
                  id="job-pos"
                  v-model="formSettings.jobTitle"
                  class="form__control"
                  type="text"
                >
              </div>
              <!--   <div class="form__group col-span-full">
                <label
                  class="form__label"
                  for="job-pos"
                > {{ $t("profile-title") }}</label>
                <input
                  id="profile-pos"
                  v-model="formSettings.profile"
                  class="form__control"
                  type="text"
                >
              </div> -->
              <!-- <div class="form__group col-span-full">
                <label
                  class="form__label"
                  for="job-pos"
                > {{ $t("company-title") }}</label>
                <input
                  id="profile-pos"
                  v-model="formSettings.company"
                  class="form__control"
                  type="text"
                >
              </div> -->
              <div class="form__group">
                <label
                  class="form__label"
                  for="first-name"
                > {{ $t("first-name") }}</label>
                <input
                  id="first-name"
                  v-model="formSettings.name"
                  class="form__control"
                  type="text"
                >
              </div>
              <div class="form__group">
                <label
                  class="form__label"
                  for="last-name"
                > {{ $t("last-name") }}</label>
                <input
                  id="last-name"
                  v-model="formSettings.lastName"
                  class="form__control"
                  type="text"
                >
              </div>
              <div class="form__group col-span-full">
                <label
                  class="form__label"
                  for="email"
                >{{ $t("email") }}</label>
                <input
                  id="email"
                  v-model="formSettings.email"
                  class="form__control"
                  type="email"
                >
              </div>

              <div class="form__group">
                <p
                  class="mb-4"
                  for="email"
                >
                  {{ $t("country") }}
                </p>

                <select v-model="formSettings.country" class="mb-4 form__control h-10 " @change="handleInputCountry(formSettings.country)">
                  <option disabled value="" v-text=" $t('selectFont')" />
                  <option
                    v-for="(item, index) in locationStore.country"
                    :key="index" :value="item"
                  >
                    {{ item.name }}
                  </option>
                </select>
              </div>

              <div class="form__group ">
                <p
                  class="mb-4"
                  for="email"
                >
                  {{ $t("city") }}
                </p>

                <select v-model="formSettings.city" :disabled="!formSettings.country" class="mb-4 form__control h-10 " @change="handleInputCity(formSettings.city)">
                  <option disabled value="" v-text=" $t('selectFont')" />
                  <option v-for="(item, index) in locationStore.city" :key="index" :value="item">
                    {{ item.name }}
                  </option>
                </select>
              </div>
              <div class="form__group col-span-full">
                <label
                  class="form__label"
                  for="location"
                > {{ $t("location") }}</label>
                <input
                  id="location"
                  v-model="formSettings.location"
                  class="form__control"
                  type="text"
                >
              </div>
              <div class="form__group col-span-full">
                <label
                  class="form__label"
                  for="phone"
                > {{ $t("phone-number") }}</label>
                <!-- {{ resumenStore.profile[0].phone_number }} -->
                <InputPhoneNumber id="phone" v-model="formSettings.phoneNumber" placeholder="1234569" class="mt-px" :code="formSettings.countryCodeName" @code="countryCodeName = $event " @country-code="countryCode = $event " @update="handleInputPhone" />

                <!-- <input
                  id="phone"
                  v-model="formSettings.phoneNumber"
                  class="form__control"
                  type="tel"
                > -->
              </div>
              <div v-if="!resumenStore.isShowCarta" class="form__group col-span-full">
                <label
                  class="form__label justify-between w-full flex items-center"
                  for="aboutme"
                >

                  <span>{{ $t("about-me") }}</span>
                  <button type="button" :disabled="!formSettings.aboutme" :class=" !formSettings.aboutme ? 'cursor-not-allowed  bg-gray-500' : 'bg-[#ff0059] cursor-pointer'" class="text-white py-0.5 rounded-lg px-2 border  " @click="generateAboutIa(formSettings.aboutme)">{{ $t("generar_ia") }}</button>
                </label>
                <textarea
                  id="aboutme"
                  v-model="formSettings.aboutme"
                  class="form__control"
                  name="aboutme"
                  cols="30"
                  rows="10"
                />
              </div>
              <!-- <div v-else class="form__group col-span-full">
                <label
                  class="form__label justify-between w-full flex items-center"
                  for="aboutme"
                >

                  <span>{{ $t("carta") }}</span>
                  <button type="button" :disabled="!formSettings.aboutme" :class=" !formSettings.aboutme ? 'cursor-not-allowed  bg-gray-500' : 'bg-[#ff0059] cursor-pointer'" class="text-white py-0.5 rounded-lg text-xs px-2 border  " @click="generateCarta">{{ $t("generar_ia") }}</button>
                </label>
                <textarea
                  id="aboutme"
                  v-model="formSettings.carta"
                  class="form__control"
                  name="aboutme"
                  cols="30"
                  rows="10"
                />
              </div> -->
            </div>
          </template>
        </expansion-panel>
      </fieldset>
      <!-- PERSONAL DETAILS -->

      <!-- SKILLS -->
      <fieldset v-if="!resumenStore.isShowCarta" class="form__section grid gap-3 ">
        <expansion-panel :panel-name="$t('skills')">
          <template #icon>
            <ChartPieIcon class="icon-style" />
          </template>

          <template #title>
            <legend class="form__legend">
              {{ $t("skills") }}
            </legend>
          </template>
          <template #content>
            <div>
              <CvInputTags
                v-model="formSettings.jobSkills"
                tag-list-name="jobSkills"
                :tag-list-label="` ${$t('technical-skills')}`"
                :display="Boolean(formSettings.displayJobSkills)"
              />
              <CvInputTags
                v-model="formSettings.softSkills"
                tag-list-name="softSkills"
                :tag-list-label="` ${$t('soft-skills')}`"
                :display="Boolean(formSettings.displaySoftSkills)"
              />
              <CvInputTags
                v-model="formSettings.languages"
                tag-list-name="languages"
                :tag-list-label="` ${$t('languages')}`"
                :display="Boolean(formSettings.displayLanguages)"
              />
              <CvInputTags
                v-model="formSettings.interests"
                tag-list-name="interests"
                :tag-list-label="` ${$t('interests')}`"
                :display="Boolean(formSettings.displayInterests)"
              />
            </div>
          </template>
        </expansion-panel>
      </fieldset>
      <!-- SKILLS -->

      <!-- SOCIAL -->
      <fieldset v-if="!resumenStore.isShowCarta" class="form__section grid gap-3 ">
        <expansion-panel :panel-name="$t('social')">
          <template #icon>
            <ChatBubbleOvalLeftIcon class="icon-style" />
          </template>
          <template #title>
            <legend class="form__legend">
              {{ $t("social") }}
            </legend>
          </template>
          <template #content>
            <div>
              <CvDisplayCheckbox
                class="form__display-checkbox mb-10"
                :display-section="formSettings.displaySocial"
                section-name="social"
              />
              <div class="grid grid-cols-2 gap-x-3 gap-y-10">
                <div class="form__group col-span-full">
                  <label
                    class="form__label flex"
                    for="linkedin"
                  >
                    <svg class="form__icon rounded mr-1 w-8 h-8">
                      <use href="@/assets/sprite.svg#linkedin" />
                    </svg>
                    Linkedin
                  </label>
                  <input
                    id="linkedin"
                    v-model="formSettings.linkedin"
                    class="form__control"
                    type="text"
                  >
                </div>
                <div class="form__group col-span-full">
                  <label
                    class="form__label flex"
                    for="linkedin"
                  >
                    <svg class="w-6 h-6 mr-1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="48" height="48" viewBox="0 0 48 48">
                      <radialGradient id="yOrnnhliCrdS2gy~4tD8ma_Xy10Jcu1L2Su_gr1" cx="19.38" cy="42.035" r="44.899" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#fd5" /><stop offset=".328" stop-color="#ff543f" /><stop offset=".348" stop-color="#fc5245" /><stop offset=".504" stop-color="#e64771" /><stop offset=".643" stop-color="#d53e91" /><stop offset=".761" stop-color="#cc39a4" /><stop offset=".841" stop-color="#c837ab" /></radialGradient><path fill="url(#yOrnnhliCrdS2gy~4tD8ma_Xy10Jcu1L2Su_gr1)" d="M34.017,41.99l-20,0.019c-4.4,0.004-8.003-3.592-8.008-7.992l-0.019-20	c-0.004-4.4,3.592-8.003,7.992-8.008l20-0.019c4.4-0.004,8.003,3.592,8.008,7.992l0.019,20	C42.014,38.383,38.417,41.986,34.017,41.99z" /><radialGradient id="yOrnnhliCrdS2gy~4tD8mb_Xy10Jcu1L2Su_gr2" cx="11.786" cy="5.54" r="29.813" gradientTransform="matrix(1 0 0 .6663 0 1.849)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#4168c9" /><stop offset=".999" stop-color="#4168c9" stop-opacity="0" /></radialGradient><path fill="url(#yOrnnhliCrdS2gy~4tD8mb_Xy10Jcu1L2Su_gr2)" d="M34.017,41.99l-20,0.019c-4.4,0.004-8.003-3.592-8.008-7.992l-0.019-20	c-0.004-4.4,3.592-8.003,7.992-8.008l20-0.019c4.4-0.004,8.003,3.592,8.008,7.992l0.019,20	C42.014,38.383,38.417,41.986,34.017,41.99z" /><path fill="#fff" d="M24,31c-3.859,0-7-3.14-7-7s3.141-7,7-7s7,3.14,7,7S27.859,31,24,31z M24,19c-2.757,0-5,2.243-5,5	s2.243,5,5,5s5-2.243,5-5S26.757,19,24,19z" /><circle cx="31.5" cy="16.5" r="1.5" fill="#fff" /><path fill="#fff" d="M30,37H18c-3.859,0-7-3.14-7-7V18c0-3.86,3.141-7,7-7h12c3.859,0,7,3.14,7,7v12	C37,33.86,33.859,37,30,37z M18,13c-2.757,0-5,2.243-5,5v12c0,2.757,2.243,5,5,5h12c2.757,0,5-2.243,5-5V18c0-2.757-2.243-5-5-5H18z" />
                    </svg>
                    Instagram
                  </label>
                  <input
                    id="linkedin"
                    v-model="formSettings.instagram"
                    class="form__control"
                    type="text"
                  >
                </div>
                <div class="form__group col-span-full">
                  <label
                    class="form__label flex"
                    for="twitter"
                  >
                    <svg class="w-6 h-6 mr-1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="48" height="48" viewBox="0 0 48 48">
                      <path fill="#212121" fill-rule="evenodd" d="M38,42H10c-2.209,0-4-1.791-4-4V10c0-2.209,1.791-4,4-4h28	c2.209,0,4,1.791,4,4v28C42,40.209,40.209,42,38,42z" clip-rule="evenodd" /><path fill="#fff" d="M34.257,34h-6.437L13.829,14h6.437L34.257,34z M28.587,32.304h2.563L19.499,15.696h-2.563 L28.587,32.304z" /><polygon fill="#fff" points="15.866,34 23.069,25.656 22.127,24.407 13.823,34" /><polygon fill="#fff" points="24.45,21.721 25.355,23.01 33.136,14 31.136,14" />
                    </svg>
                    <!-- <svg class="form__icon rounded mr-1">
                      <use href="@/assets/sprite.svg#twitter" />
                    </svg> -->

                    X
                  </label>
                  <input
                    id="twitter"
                    v-model="formSettings.twitter"
                    class="form__control"
                    type="text"
                  >
                </div>
                <div class="form__group col-span-full">
                  <label
                    class="form__label flex"
                    for="github"
                  >
                    <svg class="w-6 h-6 mr-1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="48" height="48" viewBox="0 0 48 48">
                      <linearGradient id="Ld6sqrtcxMyckEl6xeDdMa_uLWV5A9vXIPu_gr1" x1="9.993" x2="40.615" y1="9.993" y2="40.615" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#2aa4f4" /><stop offset="1" stop-color="#007ad9" /></linearGradient><path fill="url(#Ld6sqrtcxMyckEl6xeDdMa_uLWV5A9vXIPu_gr1)" d="M24,4C12.954,4,4,12.954,4,24s8.954,20,20,20s20-8.954,20-20S35.046,4,24,4z" /><path fill="#fff" d="M26.707,29.301h5.176l0.813-5.258h-5.989v-2.874c0-2.184,0.714-4.121,2.757-4.121h3.283V12.46 c-0.577-0.078-1.797-0.248-4.102-0.248c-4.814,0-7.636,2.542-7.636,8.334v3.498H16.06v5.258h4.948v14.452 C21.988,43.9,22.981,44,24,44c0.921,0,1.82-0.084,2.707-0.204V29.301z" />
                    </svg>
                    Facebook
                  </label>
                  <input
                    id="github"
                    v-model="formSettings.facebook"
                    class="form__control"
                    type="text"
                  >
                </div>
                <div class="form__group col-span-full">
                  <label
                    class="form__label flex"
                    for="website"
                  >
                    <svg class="form__icon mr-1">
                      <use href="@/assets/sprite.svg#website" />
                    </svg>
                    Website
                  </label>
                  <input
                    id="website"
                    v-model="formSettings.website"
                    class="form__control"
                    type="text"
                  >
                </div>
              </div>
            </div>
          </template>
        </expansion-panel>
      </fieldset>
      <!-- SOCIAL -->

      <!-- HISTORY SECTIONS -->
      <template v-if="!resumenStore.isShowCarta">
        <CvSettingsHistorySection
          v-for="(value, key) in SectionNameList"
          :key="key"
          :section="key"
          :name="value"
        />
      </template>

      <!-- HISTORY SECTIONS -->

      <!-- CTA -->

      <!-- carta de presentacion -->
      <fieldset v-if="resumenStore.isShowCarta" class="form__section grid gap-3 " @click="setProfile">
        <expansion-panel :panel-name="$t('carta')">
          <template #icon>
            <DocumentTextIcon class="icon-style" />
          </template>

          <template #title>
            <legend class="form__legend">
              {{ $t("carta") }}
            </legend>
          </template>
          <template #content>
            <div>
              <div class="form__group col-span-full w-full">
                <Cvfirma
                  v-model="formSettings.firma"
                />
              </div>
              <div class="form__group col-span-full w-full mt-6">
                <label
                  class="form__label"
                  for="job-pos"
                > {{ $t("company-title") }}</label>
                <input
                  v-model="formSettings.company"
                  class="form__control"
                  type="text"
                >
              </div>
              <div class="form__group col-span-full my-4">
                <label
                  class="form__label justify-between w-full flex items-center"
                  for="aboutme2"
                >

                  <span>{{ $t("carta") }}</span>
                  <button type="button" :disabled="resumenStore.isLoadingIA || !formSettings.profile " :class=" !formSettings.profile ? 'cursor-not-allowed  bg-gray-500' : 'bg-[#ff0059] cursor-pointer'" class="text-white py-0.5 rounded-lg px-2 border  " @click="sendCarta">{{ $t("generar_ia") }}</button>
                </label>
                <textarea
                  id="aboutme2"
                  v-model="formSettings.profile"
                  class="form__control"
                  name="aboutme2"
                  cols="30"
                  rows="10"
                />
              </div>
            </div>
          </template>
        </expansion-panel>
      </fieldset>
      <!-- SKILLS -->

      <p
        class="flex gap-2 ml-4 cursor-pointer lg:hidden  text-sm font-bold border-gray-300 px-2 py-1.5 rounded-lg"
        @click="logout"
      >
        <ArrowRightStartOnRectangleIcon class="w-4 h-4" />
        {{ $t('logout') }}
      </p>
      <!-- CTA -->
    </form>

    <Modal v-if="generateIA" with-out-close @close="generateIA = false">
      <section class="bg-white relative p-10 max-w-xl m-auto rounded-lg">
        <button class="hiddem absolute right-3 top-3 focus:outline-none " @click="generateIA = false">
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
            id="aboutme"
            v-model=" dataIA.profile"
            class="form__control"
            name="aboutme"
            cols="30"
            rows="8"
          />

          <div class="flex gap-2 w-full lg:flex-row flex-col">
            <button class="form__legend text-sm w-full " type="button" @click="generateIA = false" v-text="$t('cancel')" />
            <button class="form__btn text-sm w-full " type="button" @click="getText" v-text="$t('addnewpasss')" />
          </div>
        </div>
      </section>
    </Modal>

    <CommonMovilNav @carta="showCarta" @sharepass="showAccessModal" @save="save" />
  </div>
</template>

<style lang="postcss" scoped>
.settings {
  @apply bg-[#f9f9f9dc]  shadow-lg font-bold z-10;

  @media screen and (min-width: 1024px) {
    & {
      @apply overflow-y-auto;
    }
  }

  @media print {
    display: none;
    box-shadow: none;
    z-index: 0;
  }
}

.buy-me-a-coffee {
  flex-shrink: 1;

  &__image {
    width: 118px;
    height: 30px;
    font-size: 0.5rem;
  }
}

.form__legend{
  font-size: 14px!important;
}
.icon-style {
  @apply w-4 h-4 text-gray-800;

}
</style>
