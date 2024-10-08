<script setup lang="ts">
import { LockClosedIcon, XMarkIcon } from '@heroicons/vue/24/solid'
import { useRouter } from 'vue-router'
import Input from '@/components/common/Input.vue'
import Modal from '@/components/common/Modal.vue'
import { useCvState } from '~/data/useCvState'
import useLoginStore from '@/stores/auth'
import useResumenStore from '@/stores/resumen'
import useFontStore from '@/stores/font'

const {
  formSettings,

} = useCvState()
const resumenStore = useResumenStore()
const fontStore = useFontStore()
const loginStore = useLoginStore()
const CVFY_IMAGE = 'http://imgfz.com/i/rTZ5AEK.png'
const router = useRouter()
const i18n = useI18n()
const bgCv = ref('white')

const { setUpCvSettings } = useCvState()
const route = useRoute()
const { t, locale } = useI18n()

const href = `https://hojadevida.digital${route.path}`

useHead({
  htmlAttrs: {
    lang: locale,
  },
  title: t('title-tag'),
  link: [
    {
      rel: 'preload',
      as: 'image',
      href: 'https://cdn.ko-fi.com/cdn/kofi5.png?v=3',
    },
    {
      rel: 'canonical',
      href,
    },
  ],
  meta: [
    {
      hid: 'description',
      name: 'description',
      content: t('description'),
    },
    {
      hid: 'author',
      name: 'author',
      content: 'claudiabdm',
    },
    {
      hid: 'og:image',
      property: 'og:image',
      content: CVFY_IMAGE,
    },
    {
      hid: 'og:author',
      property: 'og:author',
      content: 'Claudia Benito',
    },
    {
      hid: 'og:title',
      property: 'og:title',
      content: t('title-tag'),
    },
    {
      hid: 'og:description',
      property: 'og:description',
      content: t('description'),
    },
    {
      hid: 'twitter:creator',
      name: 'twitter:creator',
      content: '@claudiabdm',
    },
    {
      hid: 'twitter:title',
      name: 'twitter:title',
      content: t('title-tag'),
    },
    {
      hid: 'twitter:url',
      name: 'twitter:url',
      content: href,
    },
    {
      hid: 'twitter:description',
      name: 'twitter:description',
      content: t('description'),
    },
    {
      hid: 'twitter:card',
      name: 'twitter:card',
      content: 'summary_large_image',
    },
    {
      hid: 'twitter:image',
      name: 'twitter:image',
      content: CVFY_IMAGE,
    },
    {
      hid: 'twitter:image:alt',
      name: 'twitter:image:alt',
      content: t('description'),
    },
  ],
})

const showPassword = ref(false)
const dataForm = ref({
  password: '',

})
const config = {
  layouts: ['one-column', 'two-column', 'three-column', 'four-column'],
  selectedColor: resumenStore.formSettings ? resumenStore.formSettings?.activeColor : formSettings.value.activeColor,
  languages: [
    { name: 'es-name', code: 'es' },
    { name: 'en-name', code: 'en' },

  ],
}
const error = ref({
  password: '',
})
async function sendPassword() {
  await resumenStore.getCvPassword({
    code: resumenStore.codeUrl,
    password: dataForm.value.password,
  })
  if (resumenStore.isReady) {
    useNuxtApp().$toast.success('¡Ingreso exitoso!')
    showPassword.value = false
  }
  else {
    useNuxtApp().$toast.error('Contraseña incorrecta')
  }
}
function openModalPassword() {
  showPassword.value = !showPassword.value
}

function changeColor(color: string): void {
  config.selectedColor = color
  document.documentElement.style.setProperty('--primary', color)
  document.documentElement.style.setProperty('--primary-darker', darkenColor(color))
  formSettings.value.activeColor = color
}

function darkenColor(color: string, amount = 0.4): string {
  const [r, g, b] = color.match(/\w\w/g)!.map(x => Number.parseInt(x, 16))
  return `#${[
    Math.round(Math.max(0, r - r * amount)).toString(16).padStart(2, '0'),
    Math.round(Math.max(0, g - g * amount)).toString(16).padStart(2, '0'),
    Math.round(Math.max(0, b - b * amount)).toString(16).padStart(2, '0'),
  ].join('')}`
}

watch(
  () => formSettings.value,
  (newValue, oldValue) => {
    localStorage.setItem(`cvSettings-${i18n.locale.value}`, JSON.stringify(newValue))
    if (newValue.activeColor !== oldValue.activeColor) {
      const newColor = config.selectedColor
      // changeColor(resumenStore.formSettings ? resumenStore.formSettings?.activeColor : formSettings.value.activeColor)
      changeColor(
        resumenStore.formSettings && resumenStore.formSettings.activeColor
          ? resumenStore.formSettings.activeColor
          : '#545454',
      )
      bgCv.value = resumenStore.formSettings?.bgCv ? resumenStore.formSettings?.bgCv : 'white'
    }
  },
  { deep: true },
)

onMounted(async () => {
  await resumenStore.getDataUserExternal({
    person: router.currentRoute.value.params.id,
  })

  if (resumenStore.isPassword)
    showPassword.value = true

  else
    showPassword.value = false
  await setUpCvSettings()
  fontStore.getFont(resumenStore.formSettings.font)
  changeFont()
})

function changeFont() {
  const font = resumenStore.formSettings?.font ? resumenStore.formSettings?.font : 'raleway'
  // const fontName = resumenStore.formSettings?.font.replace(/ /g, '+')
  const fontName = font.replace(/ /g, '+')

  const link = document.createElement('link')
  link.href = `https://fonts.googleapis.com/css2?family=${fontName}&display=swap`
  link.rel = 'stylesheet'

  const existingLink = document.getElementById('font-link')
  if (existingLink)
    existingLink.parentNode.removeChild(existingLink)

  link.id = 'font-link'
  document.head.appendChild(link)

  const textContainer = document.querySelector('.font-selected')
  textContainer.style.fontFamily = resumenStore.formSettings?.font
}
</script>

<template>
  <main class="font-app main">
    <Modal v-if="showPassword" with-out-close>
      <section class="bg-white relative p-10 max-w-xl m-auto rounded-lg">
        <div class="mb-6 text-center">
          <h2 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl ">
            {{ $t('addnewpasssmodaluser') }}
          </h2>
        </div>
        <div class="flex max-w-md m-auto flex-col lg:gap-2 gap-4 items-center justify-center rtl:space-x-reverse">
          <div class="w-full">
            <label for="password" class="block mb-2 text-sm font-medium text-gray-900 ">Contraseña</label>
            <input id="password" v-model="dataForm.password" type="password" name="password" placeholder="••••••••" class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5   " required @input="error.password = ''">
          </div>

          <p v-if="error.password" class="text-md bg-red-100 w-full  col-span-2 rounded-md text-center py-2 text-red-600 dark:text-red-500">
            {{ error.password }}
          </p>

          <button class="form__btn text-sm w-full " type="button" @click="sendPassword" v-text="$t('addnewpasssuser')" />
        </div>
      </section>
    </Modal>
    <CvPreview :loading="resumenStore.isPassword" :color="bgCv" />
  </main>
</template>

<style lang="postcss">
@import '@/assets/styles/form.postcss';
</style>

<!-- <script setup lang="ts">
import { useCvState } from '~/data/useCvState'
// import useResumenStore from '@/stores/resumen'
// const resumenStore = useResumenStore()
// await resumenStore.getPerson()

const CVFY_IMAGE = 'http://imgfz.com/i/rTZ5AEK.png'
const { setUpCvSettings } = useCvState()
const route = useRoute()
const { t, locale } = useI18n()
const href = `https://hojadevida.digital${route.path}`

onMounted(async () => {
  await setUpCvSettings()
})

useHead({
  htmlAttrs: {
    lang: locale,
  },
  title: t('title-tag'),
  link: [
    {
      rel: 'preload',
      as: 'image',
      href: 'https://cdn.ko-fi.com/cdn/kofi5.png?v=3',
    },
    {
      rel: 'canonical',
      href,
    },
  ],
  meta: [
    {
      hid: 'description',
      name: 'description',
      content: t('description'),
    },
    {
      hid: 'author',
      name: 'author',
      content: 'claudiabdm',
    },
    {
      hid: 'og:image',
      property: 'og:image',
      content: CVFY_IMAGE,
    },
    {
      hid: 'og:author',
      property: 'og:author',
      content: 'Claudia Benito',
    },
    {
      hid: 'og:title',
      property: 'og:title',
      content: t('title-tag'),
    },
    {
      hid: 'og:description',
      property: 'og:description',
      content: t('description'),
    },
    {
      hid: 'twitter:creator',
      name: 'twitter:creator',
      content: '@claudiabdm',
    },
    {
      hid: 'twitter:title',
      name: 'twitter:title',
      content: t('title-tag'),
    },
    {
      hid: 'twitter:url',
      name: 'twitter:url',
      content: href,
    },
    {
      hid: 'twitter:description',
      name: 'twitter:description',
      content: t('description'),
    },
    {
      hid: 'twitter:card',
      name: 'twitter:card',
      content: 'summary_large_image',
    },
    {
      hid: 'twitter:image',
      name: 'twitter:image',
      content: CVFY_IMAGE,
    },
    {
      hid: 'twitter:image:alt',
      name: 'twitter:image:alt',
      content: t('description'),
    },
  ],
})
</script>

<template>
  <main class="font-app main">
    <CvPreview class="basis-3/4" />
  </main>
</template>

<style lang="postcss">
@import '@/assets/styles/form.postcss';
@media screen and (min-width: 1024px) {
  .main {
    @apply flex h-screen overflow-hidden;
  }
}
</style> -->
