<script setup>
import { AdjustmentsVerticalIcon, ArrowRightIcon, ArrowRightStartOnRectangleIcon, Cog6ToothIcon, DocumentDuplicateIcon, LockClosedIcon, XMarkIcon } from '@heroicons/vue/24/solid'
import { useRouter } from 'vue-router'
import useLoginStore from '@/stores/auth'
import useResumenStore from '@/stores/resumen'
import Modal from '@/components/common/Modal.vue'
import Input from '@/components/common/Input.vue'

const loginStore = useLoginStore()
const router = useRouter()
const resumenStore = useResumenStore()
const publicCheck = ref(false)
const privateCheck = ref(false)
const showPassword = ref(false)
const dataForm = ref({
  password: '',
  confirm_password: '',

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

    if (resumenStore.isReady)
      useNuxtApp().$toast.success('¡Perfil publico exitoso!')

    if (resumenStore.isError)
      useNuxtApp().$toast.error('Error al publicar perfil')

    showPassword.value = false

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

// const newId = ref(resumenStore.data.id)
const newUrl = ref(`https://bucolic-souffle-ead4bd.netlify.app/app/${resumenStore.data?.id}`)
async function copyLink() {
  const url = `${newUrl.value}`
  await navigator.clipboard.writeText(url)

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
</script>

<template>
  <section>
    <nav class="bg-white -z-20 hidden md:block  w-full top-0  border-gray-200 shadow-sm lg:fixed">
      <div class="max-w-screen-xl flex flex-wrap items-center justify-between 2xl:ml-[500px]  lg:ml-[365px] p-4">
        <div id="navbar-default" class="flex justify-between  w-full">
          <div class="flex h-9 items-center gap-4 cursor-pointer text-gray-700 hover:text-gray-900">
            <div
              class="flex gap-2 cursor-pointer hover:bg-gray-200 text-gray-700 justify-center items-center border border-gray-300 px-2 py-1.5 rounded-lg"
              @click="openModalPassword"
            >
              <Cog6ToothIcon class="w-4 h-4" />
              <p class="text-sm font-normal  " v-text="$t('addPassword')" />
            </div>
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
        <section class="w-full flex gap-4 items-center mb-2">
          <div class="flex items-center  ">
            <input id="default-radio-1" :checked="resumenStore.isPassword" type="radio" value="public" name="default-radio" class="w-4 h-4 text-blue-600 cursor-pointer  border-gray-300  " @change="changePrivate">
            <label for="default-radio-1" class="ms-2 text-sm cursor-pointer font-medium text-gray-900 "> {{ $t('addpublic') }} </label>
          </div>
          <div class="flex items-center">
            <input id="default-radio-2" :checked="!resumenStore.isPassword" type="radio" value="private" name="default-radio" class="w-4 h-4 text-blue-600  border-gray-300 cursor-pointer  " @change="changePublic">
            <label for="default-radio-2" class="ms-2 text-sm cursor-pointer font-medium text-gray-900 ">
              {{ $t('addprivate') }}
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
          <p class="bg-gray-50 border border-gray-300 text-gray-500 rounded-lg focus:ring-primary-600 focus:border-primary-600 font-normal block w-full p-2.5   ">
            {{ `https://bucolic-souffle-ead4bd.netlify.app/app/${resumenStore.data?.id}` }}
            <button type="button" class="absolute right-3 top-2 text-gray-600 hover:text-gray-600" @click="copyLink">
              <DocumentDuplicateIcon class="w-6  " />
            </button>
          </p>
        </div>
      </div>
    </section>
  </Modal>
</template>
