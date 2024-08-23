<script setup lang="ts">
import { LockClosedIcon, XMarkIcon } from '@heroicons/vue/24/solid'
import { useRouter } from 'vue-router'
import Input from '@/components/common/Input.vue'
import Modal from '@/components/common/Modal.vue'
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
const router = useRouter()
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

const showPassword = ref(false)
const dataForm = ref({
  password: '',
  confirm_password: '',

})
const error = ref({
  password: '',
})
async function sendPassword() {
  if (dataForm.value.password !== dataForm.value.confirm_password) {
    error.value.password = 'Las contraseñas no coinciden'
    return
  }

  await resumenStore.addPasswordCV(dataForm.value)
  if (resumenStore.isReadyPass) {
    useNuxtApp().$toast.success('¡Contraseña agregada!')
    showPassword.value = false
  }
  else {
    useNuxtApp().$toast.error('Error al agregar contraseña')
  }
}
function openModalPassword() {
  showPassword.value = !showPassword.value
}
function logout() {
  loginStore.reset()
  localStorage.removeItem(`cvSettings-${i18n.locale.value}`)
  router.push({ path: '/login' })
}
</script>

<template>
  <main class="font-app main">
    <Modal v-if="showPassword" with-out-close @close="showPassword = false">
      <section class="bg-white relative p-10 max-w-xl m-auto rounded-lg">
        <button class="hiddem absolute right-3 top-3 focus:outline-none " @click="showPassword = false">
          <XMarkIcon class="w-6 text-gray-700" />
        </button>
        <div class="mb-6 text-center">
          <h2 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl ">
            {{ $t('addnewpasssmodal') }}
          </h2>
        </div>
        <div class="flex max-w-md m-auto flex-col lg:gap-2 gap-4 items-center justify-center rtl:space-x-reverse">
          <!-- <input ref="passwordInput" type="password" class="form__control h-10 -mb-1 " @focus="true"> -->
          <!-- <Input
            id="password"
            v-model="password"
            name="password"
            type="password"
            class="md:w-1/2 w-full"
          /> -->
          <div class="w-full">
            <label for="password" class="block mb-2 text-sm font-medium text-gray-900 ">Contraseña</label>
            <input id="password" v-model="dataForm.password" type="password" name="password" placeholder="••••••••" class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5   " required @input="error.password = ''">
          </div>
          <div class="w-full">
            <label for="password" class="block mb-2 text-sm font-medium text-gray-900 ">Confirmar ontraseña</label>
            <input id="password" v-model="dataForm.confirm_password" type="password" name="password" placeholder="••••••••" class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5   " required @input="error.password = ''">
          </div>
          <p v-if="error.password" class="text-md bg-red-100 w-full  col-span-2 rounded-md text-center py-2 text-red-600 dark:text-red-500">
            {{ error.password }}
          </p>

          <button class="form__btn text-sm w-full " type="button" @click="sendPassword" v-text="$t('addnewpasss')" />
        </div>
      </section>
    </Modal>

    <CvSettings :id="resumenStore.data?.id" class="basis-1/4 min-w-80" :is-loading="resumenStore.isLoading" @color="color = $event" />
    <CvPreview
      :loading=" resumenStore.isLoading || loadingFont"
      class="basis-3/4
" :color="color"
    >
      <nav class="bg-white  z-[1] w-full top-0  border-gray-200 shadow-sm ">
        <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <div class="flex h-9 items-center gap-4 cursor-pointer text-gray-700 hover:text-gray-900">
            <div class="flex items-center gap-1" @click="openModalPassword">
              <LockClosedIcon class="w-3.5 h-3.5" />
              <p class="text-sm  " v-text="$t('addPassword')" />
            </div>
          </div>

          <div id="navbar-default" class="  block w-auto">
            <ul class="font-medium flex  rounded-lg  flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 ">
              <li v-if="loginStore.authenticated">
                <p class="block cursor-pointer px-3 text-gray-700 rounded md:bg-transparent  " @click="logout">
                  Cerrar sesión
                </p>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </CvPreview>
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
