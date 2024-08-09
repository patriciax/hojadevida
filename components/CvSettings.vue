<script setup lang="ts">
import { BeakerIcon, ChartPieIcon, ChatBubbleOvalLeftIcon, Cog6ToothIcon, TrophyIcon, UserIcon } from '@heroicons/vue/24/solid'
import { SectionNameList } from '~/types/cvfy'
import { useCvState } from '~/data/useCvState'

const {
  formSettings,
  uploadCV,
  clearForm,
  resetForm,
} = useCvState()
const switchLocalePath = useSwitchLocalePath()
const i18n = useI18n()
const { downloadPdf } = usePrint()

const config = {
  layouts: ['one-column', 'two-column'],
  colors: [
    { name: 'pink', color: '#9D174D', darker: '#831843' },
    { name: 'purple', color: '#5B21B6', darker: '#4C1D95' },
    { name: 'blue', color: '#1E40AF', darker: '#1E3A8A' },
    { name: 'green', color: '#065F46', darker: '#064E3B' },
    { name: 'black', color: '#1F2937', darker: '#111827' },
  ],
  languages: [
    { name: 'es-name', code: 'es' },
    { name: 'en-name', code: 'en' },
    // { name: 'id-name', code: 'id' },
    // { name: 'fr-name', code: 'fr' },
    // { name: 'zh-name', code: 'zh' },
    // { name: 'de-name', code: 'de' },
    // { name: 'ar-name', code: 'ar' },
    // { name: 'pt-name', code: 'pt' },
  ],
}

watch(
  () => formSettings.value,
  (newValue, oldValue) => {
    localStorage.setItem(`cvSettings-${i18n.locale.value}`, JSON.stringify(newValue))
    if (newValue.activeColor !== oldValue.activeColor) {
      const newColor = getCurrentColor(newValue.activeColor)
      changeColor(newColor.color, newColor.darker)
    }
  },
  { deep: true },
)

const formSettingsHref = computed(() => {
  return `data:text/json;charset=utf-8,${encodeURIComponent(
    JSON.stringify({ formSettings: formSettings.value }),
  )}`
})

const availableLocales = computed(() => {
  return i18n.localeCodes.value.filter((locale: any) => !locale.includes('-'))
})

function changeColor(color: string, darker: string): void {
  formSettings.value.activeColor = color
  document.documentElement.style.setProperty('--primary', color)
  document.documentElement.style.setProperty('--primary-darker', darker)
}

function getCurrentColor(colorValue: string): {
  color: string
  darker: string
} {
  return (
    config.colors.find(color => color.color === colorValue)
    || config.colors[1]
  )
}
</script>

<template>
  <div class="settings">
    <div class="flex justify-center items-center title pt-2 px-6 bg-white py-4">
      <LandingLogo />
      <!-- <a
        class="buy-me-a-coffee"
        href="https://ko-fi.com/X8X4COWK0"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Buy me a coffee"
      >
        <img
          class="buy-me-a-coffee__image"
          src="https://cdn.ko-fi.com/cdn/kofi5.png?v=3"
          width="118px"
          height="30px"
          alt="Buy me a coffee button"
        >
      </a> -->
    </div>
    <!-- <h2 class="flex flex-wrap text-xl/normal pt-10 px-6 tracking-wide uppercase">
      <span class="title__text">
        {{ $t("cv-settings") }}
      </span>
    </h2> -->
    <form
      class="form mb-10"
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
                  class="form__btn form__btn--ghost"
                  type="button"
                  @click="resetForm"
                >
                  {{ $t("reset-settings") }}
                </button>
                <button
                  class="form__btn form__btn--ghost"
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
                    class="form__btn form__btn--ghost"
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
                <div class="flex flex-wrap gap-2 justify-start">
                  <label
                    v-for="layout in config.layouts"
                    :key="layout"
                    tabindex="0"
                    class="form__btn form__btn--ghost capitalize"
                    :class="[
                      {
                        'form__btn--active':
                          layout === formSettings.layout,
                      },
                    ]"
                  >
                    {{ $t(layout) }}
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

              <!-- COLOR THEME -->
              <fieldset class="form__section ">
                <legend class="form__legend">
                  <!-- {{ $t("color-theme") }} -->
                </legend>
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
              </fieldset>
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
            <div class="grid grid-cols-2 gap-x-3 gap-y-10">
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
              <div class="form__group">
                <label
                  class="form__label"
                  for="phone"
                > {{ $t("phone-number") }}</label>
                <input
                  id="phone"
                  v-model="formSettings.phoneNumber"
                  class="form__control"
                  type="tel"
                >
              </div>
              <div class="form__group col-span-full">
                <label
                  class="form__label"
                  for="aboutme"
                > {{ $t("about-me") }}</label>
                <textarea
                  id="aboutme"
                  v-model="formSettings.aboutme"
                  class="form__control"
                  name="aboutme"
                  cols="30"
                  rows="10"
                />
              </div>
            </div>
          </template>
        </expansion-panel>
      </fieldset>
      <!-- PERSONAL DETAILS -->

      <!-- SKILLS -->
      <fieldset class="form__section grid gap-3 ">
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
      <fieldset class="form__section grid gap-3 ">
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
      <CvSettingsHistorySection
        v-for="(value, key) in SectionNameList"
        :key="key"
        :section="key"
        :name="value"
      />
      <!-- HISTORY SECTIONS -->

      <!-- CTA -->
      <div class="form__section flex justify-center p-6 gap-2">
        <button
          type="button"
          class="form__btn flex flex-col justify-center h-fit w-full"
          @click="downloadPdf"
        >
          <span>{{ $t("download-cv-pdf") }}</span>
        </button>
        <label
          tabindex="0"
          class="form__btn flex justify-center w-full h-fit"
        >
          {{ $t("upload-cv") }}
          <input
            type="file"
            accept=".json"
            name="uploadCV"
            class="hidden"
            @change="uploadCV"
          >
        </label>
        <a
          :href="formSettingsHref"
          rel="noopener"
          :download="`CV_${formSettings.name}_${formSettings.lastName}_${$i18n.locale}.json`"
          class="form__btn flex justify-center w-full h-fit"
        >{{ $t("download-cv-settings") }}
        </a>
      </div>
      <!-- CTA -->
    </form>
  </div>
</template>

<style lang="postcss" scoped>
.settings {
  @apply bg-[#f9f9f9] bg-opacity-100 shadow-lg font-bold z-10;

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
