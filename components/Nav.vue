<script setup>
import { ArrowRightStartOnRectangleIcon, Cog6ToothIcon, DocumentDuplicateIcon, DocumentTextIcon, XMarkIcon } from '@heroicons/vue/24/solid'
import { useRouter } from 'vue-router'
import Msg from './common/msg.vue'
import PlansModal from './common/ModalPlans.vue'
import useLoginStore from '@/stores/auth'
import useResumenStore from '@/stores/resumen'
import Modal from '@/components/common/Modal.vue'
import Input from '@/components/common/Input.vue'
import { useCvState } from '~/data/useCvState'

const loginStore = useLoginStore()
const router = useRouter()
const resumenStore = useResumenStore()
const publicCheck = ref()
const privateCheck = ref()
const showPassword = ref(false)
const showCarta = ref(false)
const i18n = useI18n()
const showPlansModal = ref(false)
const { t, locale } = useI18n()
const showSuccess = ref(false)
const showError = ref(false)
const dataForm = ref({
  password: '',
  confirm_password: '',

})

const datacarta = ref({
  profile: '',
  jobTitle: '',
  company: 'My Company Inc.',
  general: '',
})
const errorcarta = ref({
  jobTitle: '',
  company: '',
  profile: '',
})

const error = ref({
  password: '',
})
async function sendPassword() {
  if (!publicCheck.value) {
    if (dataForm.value.password === '' || dataForm.value.confirm_password === '') {
      error.value.password = 'Todos los campos son requeridos'
      return
    }
  }
  if (dataForm.value.password !== dataForm.value.confirm_password) {
    error.value.password = 'Las contraseñas no coinciden'
    return
  }

  if (publicCheck.value) {
    await resumenStore.setPassword(resumenStore.data.id, {
      public: true,
    })
    publicCheck.value = true
    if (resumenStore.isReady)
      useNuxtApp().$toast.success('¡Perfil publico exitoso!')

    if (resumenStore.isError)
      useNuxtApp().$toast.error('Error al publicar perfil')

    showPassword.value = false
    resumenStore.showAccess(false)

    return
  }

  await resumenStore.addPasswordCV(dataForm.value)

  if (resumenStore.isReadyPass) {
    useNuxtApp().$toast.success('¡Contraseña agregada!')
    showPassword.value = false
    resumenStore.showAccess(false)
    privateCheck.value = true
  }
  else {
    useNuxtApp().$toast.error('Error al agregar contraseña')
  }
}
const {
  formSettings,

} = useCvState()
function openModalPassword() {
  // showPassword.value = !showPassword.value
  if (resumenStore.openAccess)
    resumenStore.showAccess(false)
  else
    resumenStore.showAccess(true)
}
function logout() {
  loginStore.reset()
  localStorage.removeItem(`cvSettings-${i18n.locale.value}`)
  router.push({ path: '/login' })
}

// const newId = ref(resumenStore.data.id)
const newUrl = ref(`http://app.hojadevida.digital/cv/${resumenStore.data?.code_url}`)
async function copyLink() {
  const url = `${newUrl.value}`
  await navigator.clipboard.writeText(`http://app.hojadevida.digital/cv/${resumenStore.data?.code_url}`)

  useNuxtApp().$toast.success('¡Link copiado al portapapeles!')
}

function changePrivate() {
  publicCheck.value = !publicCheck.value
  error.value.password = ''
}
function changePublic() {
  publicCheck.value = false
  error.value.password = ''
}

const data = ref([
  {
    id: 1,
    name: 'public',
    label: 'Público',
  },
  {
    id: 2,
    name: 'private',
    label: 'Privado',
  },
])
const selectedOption = ref()

function setData() {
  selectedOption.value = resumenStore.isPassword ? 'private' : 'public'
}
function handleRadioChange(value) {
  selectedOption.value = value
  if (selectedOption.value === 'private')
    publicCheck.value = false
  else
    publicCheck.value = true
}

onMounted(() => {
  setData()

  if (selectedOption.value === 'public')
    publicCheck.value = true
})

async function handleCarta() {
  resumenStore.showCarta(true)

  // if (formSettings.value.profile || formSettings.value.jobTitle || formSettings.value.company) {
  //   resumenStore.showCarta(true)
  //   return
  // }
  // resumenStore.showCarta(true)
  // datacarta.value.jobTitle = formSettings.value.jobTitle

  // await resumenStore.getCarta({
  //   company: datacarta.value.company,
  //   job: datacarta.value.jobTitle,
  //   profile: formSettings.value.aboutme,
  // })

  // await resumenStore.addCvSettings(JSON.stringify({ formSettings: {
  //   ...formSettings.value,
  //   company: datacarta.value.company,
  //   profile: resumenStore.carta,
  // } }))
}

function closeCarta() {
  showCarta.value = false
  resumenStore.showCarta(showCarta.value)
}

// async function sendCarta() {
//   formSettings.value.company = datacarta.value.company
//   formSettings.value.profile = datacarta.value.profile
//   formSettings.value.jobTitle = datacarta.value.jobTitle

//   if (datacarta.value.jobTitle === '' || datacarta.value.company === '' || datacarta.value.profile === '') {
//     errorcarta.value.general = 'Todos los campos son requeridos'
//     return
//   }

//   await resumenStore.getCarta({
//     company: datacarta.value.company,
//     job: datacarta.value.jobTitle,
//     profile: datacarta.value.profile,
//   })

//   await resumenStore.addCvSettings(JSON.stringify({ formSettings: {
//     ...formSettings.value,
//     company: datacarta.value.company,
//     profile: datacarta.value.profile,
//   } }))

//   if (resumenStore.isReady) {
//     useNuxtApp().$toast.success('¡Carta generada!')
//     showCarta.value = false
//   }

//   if (resumenStore.isError) {
//     if (resumenStore.error.company)
//       errorcarta.value.company = 'El campo del company debe tener al menos 5 caracteres'

//     if (resumenStore.error.job)
//       errorcarta.value.job = 'El campo del trabajo  debe tener al menos 5 caracteres'

//     if (resumenStore.error.profile)
//       errorcarta.value.profile = 'El campo del perfil debe tener al menos 5 caracteres'
//   }
// }

// watch(
//   () => formSettings.value,
//   (newValue, oldValue) => {
//     if (JSON.stringify(oldValue) !== JSON.stringify(formSettings.value))
//       localStorage.setItem(`cvSettingsMyData-${i18n.locale.value}`, JSON.stringify(oldValue))
//   },
//   { deep: true },
// )

function handleContinue() {
  showSuccess.value = false
  window.location.reload()
}
function handleError() {
  showError.value = false
  window.location.reload()
}
</script>

<template>
  <section>
    <nav class="bg-white -z-20 hidden md:block  w-full top-0  border-gray-200 shadow-sm lg:fixed">
      <div class="max-w-screen-xl flex flex-wrap items-center justify-between 2xl:ml-[500px]  lg:ml-[365px] p-4">
        <div id="navbar-default" class="flex justify-between  w-full">
          <div class="flex h-9 items-center gap-4 cursor-pointer text-gray-700 hover:text-gray-900">
            <div class="relative group">
              <button
                :disabled="!resumenStore.plan"
                :class="{ 'opacity-60 !cursor-not-allowed': !resumenStore.plan }"
                class="flex gap-2 cursor-pointer hover:bg-gray-200 text-gray-700 justify-center items-center border border-gray-300 px-2 py-1.5 rounded-lg"
                @click="openModalPassword"
              >
                <Cog6ToothIcon class="w-4 h-4" />
                <p class="text-sm font-normal" v-text="$t('addPassword')" />
              </button>
              <Msg v-if="!resumenStore.plan" />
            </div>
            <div
              v-if="!resumenStore.isShowCarta"
              :class="{ 'bg-blue-500 !text-white': resumenStore.isShowCarta }"
              class="flex gap-2 cursor-pointer text-gray-700 justify-center items-center border border-gray-300 px-2 py-1.5 rounded-lg"
              @click="handleCarta"
            >
              <DocumentTextIcon class="w-4 h-4" />
              <p class="text-sm font-normal  " v-text="$t('carta')" />
            </div>
            <div
              v-else

              :class="{ 'bg-blue-500 !text-white': resumenStore.isShowCarta }"
              class="flex gap-2 cursor-pointer text-gray-700 justify-center items-center border border-gray-300 px-2 py-1.5 rounded-lg"
              @click="closeCarta"
            >
              <DocumentTextIcon class="w-4 h-4" />
              <p class="text-sm font-normal  " v-text="$t('cartacerrar')" />
            </div>
            <button
              v-if="!resumenStore.plan"
              type="button"
              class="flex gap-2 text-gray-700 hover:bg-gray-200 justify-center items-center border border-gray-300 px-2 py-1.5 rounded-lg text-sm"
              @click="showPlansModal = !showPlansModal"
            >
              <svg class="KNAong" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M13.91 4.91a1.91 1.91 0 0 1-1.044 1.701c.942 2.366 1.928 3.53 2.795 3.622.982.104 1.88-.323 2.76-1.377a.977.977 0 0 1 .072-.078 1.91 1.91 0 1 1 1.468.873l-1.423 5.42c-.297 1.13-1.363 1.922-2.586 1.922H8.066c-1.223 0-2.29-.792-2.586-1.922L4.063 9.675a1.91 1.91 0 1 1 1.46-.898c.03.028.059.06.086.093.837 1.048 1.727 1.471 2.748 1.363.908-.096 1.888-1.253 2.793-3.614a1.91 1.91 0 1 1 2.76-1.71ZM6.561 19.008h10.875c.518 0 .938.448.938 1s-.42 1-.938 1H6.563c-.517 0-.937-.448-.937-1s.42-1 .937-1Z" fill="currentColor" /></svg>
              <span>{{ $t("pro") }}</span>
            </button>
          </div>
          <ul class="font-medium flex gap-3 rounded-lg  flex-row rtl:space-x-reverse md:mt-0 md:border-0 ">
            <slot />
            <li v-if="loginStore.authenticated">
              <p
                class="flex gap-2 cursor-pointer hover:bg-gray-200 text-gray-700 justify-center items-center border text-sm border-gray-300 px-2 py-1.5 rounded-lg"
                @click="logout"
              >
                <ArrowRightStartOnRectangleIcon class="w-4 h-4" />
                {{ $t('logout') }}
              </p>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </section>

  <Modal v-if="resumenStore.openAccess" with-out-close @close="resumenStore.showAccess(false)">
    <section class="bg-white relative p-10 max-w-xl m-auto rounded-lg">
      <button class="hiddem absolute right-3 top-3 focus:outline-none " @click="resumenStore.showAccess(false)">
        <XMarkIcon class="w-6 text-gray-700" />
      </button>
      <div class="mb-6 text-center">
        <h2 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl ">
          {{ $t('addnewpasssmodal') }}
        </h2>
      </div>
      <div class="flex max-w-md m-auto flex-col lg:gap-2 gap-4 items-center justify-center rtl:space-x-reverse">
        <section class="w-full flex gap-4 items-center mb-2">
          <div v-for="item in data" :key="item.id" class="flex items-center">
            <input
              :id="`default-radio-${item.id}`"
              v-model="selectedOption"
              type="radio"
              :value="item.name"
              class="w-4 h-4 text-blue-600 cursor-pointer border-gray-300"
              @change="handleRadioChange(item.name)"
            >
            <label :for="`default-radio-${item.id}`" class="ms-2 text-sm cursor-pointer font-medium text-gray-900">
              {{ item.label }}
            </label>
          </div>
        </section>
        <div class="grid grid-cols-2 gap-2" :class="{ 'opacity-50': publicCheck }">
          <div class="w-full">
            <label for="password" class="block mb-2 text-sm font-medium text-gray-900 ">Ingresar contraseña de acceso</label>
            <input id="password" v-model="dataForm.password" :disabled="publicCheck" type="password" name="password" placeholder="••••••••" class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5   " required @input="error.password = ''">
          </div>
          <div class="w-full">
            <label for="password" class="block mb-2 text-sm font-medium text-gray-900 ">Confirmar ontraseña</label>
            <input id="password" v-model="dataForm.confirm_password" :disabled="publicCheck" type="password" name="password" placeholder="••••••••" class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5   " required @input="error.password = ''">
          </div>
        </div>
        <p v-if="error.password" class="text-md bg-red-100 w-full  col-span-2 rounded-md text-center py-2 text-red-600 dark:text-red-500">
          {{ error.password }}
        </p>

        <button class="form__btn text-sm w-full " type="button" @click="sendPassword" v-text="$t('addnewpasss')" />

        <div class="w-full relative">
          <p class="bg-gray-50 border border-gray-300 text-gray-500 rounded-lg focus:ring-primary-600 focus:border-primary-600 font-normal block w-full p-2.5 text-xs  ">
            {{ `http://app.hojadevida.digital/cv/${resumenStore.data?.code_url
            }` }}
            <button type="button" class="absolute right-3 top-2 text-gray-600 hover:text-gray-600" @click="copyLink">
              <DocumentDuplicateIcon class="w-6  " />
            </button>
          </p>
        </div>
      </div>
    </section>
  </Modal>

  <Teleport to="body">
    <PlansModal v-if="showPlansModal" @close="showPlansModal = false" @success="showSuccess = true" @error="showError = true" />
  </Teleport>

  <Teleport to="body">
    <Modal v-if="showSuccess" with-out-close @close="showSuccess = false">
      <section class="fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center">
        <div class="absolute inset-0 -m-4 bg-black bg-opacity-50" />
        <section class="sm:w-475 relative w-full rounded-lg p-4">
          <section>
            <div class="max-h-[95vh] text-center  overflow-hidden bg-white border border-gray-200 rounded-xl shadow-2xl top-0 left-0 z-50 items-center justify-center w-full px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-lg md:px-24 lg:px-8 lg:py-10">
              <svg xmlns="http://www.w3.org/2000/svg" class="text-[#059669] mx-auto h-11 rounded-full bg-[#D1FAE5] w-11" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M5 13l4 4L19 7" />
              </svg>
              <span class="text-2xl font-medium">Pago con éxito</span>
              <p class="text-center my-7">
                Gracias por adquirir el <b>Plan Profesional</b>. Ahora tienes acceso a todas las herramientas para destacar con tu CV y carta de presentación.
              </p>
              <button class="p-3 bg-[#4F46E5] rounded-lg w-full text-white" @click="handleContinue">
                Continuar
              </button>
            </div>
          </section>
        </section>
      </section>
    </Modal>

    <section v-if="showError">
      <section class="fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center">
        <div class="absolute inset-0 -m-4 bg-black bg-opacity-50" />
        <section class="sm:w-475 relative w-full rounded-lg p-4">
          <section>
            <div class="max-h-[95vh] text-center  overflow-hidden bg-white border border-gray-200 rounded-xl shadow-2xl top-0 left-0 z-50 items-center justify-center w-full px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-lg md:px-24 lg:px-8 lg:py-10">
              <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 48 48" class="text-[#96051d] mx-auto h-11 rounded-full bg-[#D1FAE5] w-11">
                <circle cx="24" cy="24" r="20" fill="#fc9c9c" /><path fill="#324561" d="M31,32c-0.256,0-0.512-0.098-0.707-0.293l-14-14c-0.391-0.391-0.391-1.023,0-1.414	s1.023-0.391,1.414,0l14,14c0.391,0.391,0.391,1.023,0,1.414C31.512,31.902,31.256,32,31,32z" /><path fill="#324561" d="M17,32c-0.256,0-0.512-0.098-0.707-0.293c-0.391-0.391-0.391-1.023,0-1.414l14-14	c0.391-0.391,1.023-0.391,1.414,0s0.391,1.023,0,1.414l-14,14C17.512,31.902,17.256,32,17,32z" />
              </svg>
              <span class="text-2xl font-medium">Pago Fallido</span>
              <p class="text-center my-4">
                Lo sentimos, tu pago ha fallado. Por favor, intenta nuevamente.
              </p>
              <button class="p-3 bg-[#4F46E5] rounded-lg w-full text-white" @click="handleError">
                Salir
              </button>
            </div>
          </section>
        </section>
      </section>
    </section>
  </Teleport>
</template>

<style scoped>
.KNAong {
  color: #fdbc68;
}
</style>
