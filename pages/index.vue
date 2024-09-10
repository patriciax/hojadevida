<script setup lang="ts">
import { useCvState } from '~/data/useCvState'
import useLoginStore from '@/stores/auth'
import useResumenStore from '@/stores/resumen'

const resumenStore = useResumenStore()
const i18n = useI18n()

const loginStore = useLoginStore()
const CVFY_IMAGE = 'http://imgfz.com/i/rTZ5AEK.png'
const { setUpCvSettings } = useCvState()
const route = useRoute()
const { t, locale } = useI18n()
const loadingFont = ref(true)
const href = `https://hojadevida.digital${route.path}`
const {
  formSettings,

} = useCvState()

onMounted(async () => {
  await resumenStore.getPerson()
  await resumenStore.getDataUser()
  await setUpCvSettings()
  changeFont()
  loadingFont.value = false
})

function changeFont() {
  const fontName = resumenStore.formSettings?.font?.replace(/ /g, '+')
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

definePageMeta({
  middleware: 'auth',
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

const color = ref('')
</script>

<template>
  <main class="font-app main">
    <CvSettings :id="resumenStore.data?.id" class="basis-1/4 min-w-80" :is-loading="resumenStore.isLoading" @color="color = $event" />
    <CvPreview
      :loading=" resumenStore.isLoading || loadingFont"
      class="basis-3/4
" :color="color"
    />
  </main>
</template>

<style lang="postcss">
@import '@/assets/styles/form.postcss';
@media screen and (min-width: 1024px) {
  .main {
    @apply flex h-screen overflow-hidden;
  }
}
</style>
