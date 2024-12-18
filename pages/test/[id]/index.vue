<script setup lang="ts">
import { LockClosedIcon, PrinterIcon, ShareIcon, XMarkIcon } from '@heroicons/vue/24/solid'
import { useRouter } from 'vue-router'
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'
import Input from '@/components/common/Input.vue'
import Modal from '@/components/common/Modal.vue'
import { useCvState } from '~/data/useCvState'
import useLoginStore from '@/stores/auth'
import useResumenStore from '@/stores/resumen'
import useFontStore from '@/stores/font'
import MovilNavShare from '~/components/common/movilNavShare.vue'
import Adjuntos from '~/components/common/adjuntos.vue'

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
const showModalAdjuntos = ref(false)
const { setUpCvSettings } = useCvState()
const route = useRoute()
const { t, locale } = useI18n()
const { downloadPdf, downloadPdfDirectly } = usePrint()

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
// async function downloadCvPdf() {
//   const element = document.getElementById('elemento-a-exportar')
//   console.log('ecport')
//   html2canvas(element).then((canvas) => {
//     const imgData = canvas.toDataURL('image/png')

//     const pdf = new jsPDF({
//       orientation: 'portrait',
//       unit: 'mm',
//       format: 'a4',
//     })

//     const pdfWidth = pdf.internal.pageSize.getWidth()
//     const imgWidth = pdfWidth * 0.9 // Ajusta según sea necesario
//     const imgHeight = (canvas.height * imgWidth) / canvas.width
//     const xOffset = (pdfWidth - imgWidth) / 2
//     const yOffset = (pdf.internal.pageSize.getHeight() - imgHeight) / 2

//     pdf.addImage(imgData, 'PNG', xOffset, yOffset, imgWidth, imgHeight)
//     pdf.save('documento.pdf')
//   })
// }
const newUrl = ref('http://app.hojadevida.digital/cv/')

async function copyLink() {
  const url = `${newUrl.value}${resumenStore.codeUrl}`
  await navigator.clipboard.writeText(url)

  useNuxtApp().$toast.success('¡Link copiado al portapapeles!')
}
function goToRoute() {
  const url = `${newUrl.value}${resumenStore.codeUrl}`
  window.open(url, '_blank'); copyLink()
}
function shared(id: any) {
  const _url = `${newUrl.value}${resumenStore.codeUrl}`

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
    copyLink()
  }
}

const formSettingsHref = computed(() => {
  return `data:text/json;charset=utf-8,${encodeURIComponent(
    JSON.stringify({ formSettings: formSettings.value }),
  )}`
})
</script>

<template>
  <div class="group menu-share  fixed z-50 bottom-3 right-6 p-2 hidden  lg:flex items-end justify-end w-24 h-24 ">
    <div :style="`background: ${formSettings.activeColor} `" class=" shadow-xl text-white flex items-center justify-center p-3 rounded-full z-50 absolute  ">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 group-hover:rotate-90 transition  transition-all duration-[0.6s]">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    </div>
    <div :style="`background: ${formSettings.activeColor} `" class="text-white absolute cursor-pointer rounded-full transition-all duration-[0.2s] ease-out scale-y-0 group-hover:scale-y-100 group-hover:-translate-x-16   flex  p-2 hover:p-3 scale-100" @click="shared">
      <ShareIcon class="w-5 h-5 " />
    </div>
    <div :style="`background: ${formSettings.activeColor} `" class="absolute cursor-pointer rounded-full transition-all duration-[0.2s] ease-out scale-x-0 group-hover:scale-x-100 group-hover:-translate-y-16  flex  p-2 hover:p-3 bg-blue-300 hover:bg-blue-400  text-white">
      <a
        :href="formSettingsHref"
        rel="noopener"
        :download="`CV_${formSettings.name}_${formSettings.lastName}_${$i18n.locale}.json`"
        class="text-xs h-5 flex justify-center items-center w-5"
      >  {json}
      </a>
    </div>
    <div :style="`background: ${formSettings.activeColor} `" class="absolute cursor-pointer rounded-full transition-all duration-[0.2s] ease-out scale-x-0 group-hover:scale-x-100 group-hover:-translate-y-14 group-hover:-translate-x-14   flex  p-2 hover:p-3  text-white" @click="downloadPdf">
      <PrinterIcon class="w-5 h-5" />
    </div>
  </div>

  <main class="font-app main relative">
    <!-- <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" @click="downloadCvPdf">
      Descargar PDF
    </button> -->

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

  <MovilNavShare @sharepass="downloadPdfDirectly" @save="downloadPdf" @share="shared" />

  <Adjuntos v-if="resumenStore.showModal" @close="resumenStore.closeModalAdjuntos" />
</template>

<style lang="postcss">
@import '@/assets/styles/form.postcss';
</style>
