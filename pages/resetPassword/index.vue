<script  setup>
import { useRouter } from 'vue-router'
import { set } from '@vueuse/core'
import useLoginStore from '@/stores/auth'
import InputsOpt from '~/components/common/InputsOpt.vue'

const router = useRouter()
const currentstep = ref(1)
const loginStore = useLoginStore()
const codeTemp = ref('')
const currentCode = ref('')
const loading = ref(false)
const dataForm = ref({
  email: '',
  password: '',
  confirm_password: '',
  code: '',
})

onMounted(() => {
  if (loginStore.token)
    router.push({ path: '/' })
})

async function changePassword() {
  if (dataForm.value.password !== dataForm.value.confirm_password) {
    useNuxtApp().$toast.error('Las contraseñas no coinciden.')
    return
  }
  loading.value = true
  try {
    dataForm.value.code = codeTemp.value
    const { $axios } = useNuxtApp()
    const response = await $axios.post('password/change', dataForm.value, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    if (response.status === 200) {
      if (response.data.message === 'Código de recuperación expirado') {
        useNuxtApp().$toast.error(`${response.data.message} ` + `, Intenta de nuevo`)
        currentstep.value = 1
        codeTemp.value = ''
        return
      }
      useNuxtApp().$toast.success('¡Contraseña cambiada exitosamente!')

      setTimeout(() => {
        router.push({ path: '/login' })
      }, 1000)
    }
    else if (response.message === 'Código de recuperación expirado') {
      useNuxtApp().$toast.error(response.data.message)
    }
    else {
      useNuxtApp().$toast.error('Error al cambiar contraseña.')
    }
  }
  catch (error) {
    useNuxtApp().$toast.error(error.response.data.messages.errors.password)
  }
  finally {
    loading.value = false
  }
}

async function resetPassword() {
  try {
    const { $axios } = useNuxtApp()
    const response = await $axios.post('password/reset', { email: dataForm.value.email }, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    if (response.status === 200) {
      currentstep.value++
      codeTemp.value = response.data.codetemp
    }
    else {
      useNuxtApp().$toast.error('Correo electronico de la persona no registrado')
    }
  }
  catch (error) {
    useNuxtApp().$toast.error(error.response.data.message)
  }
  finally {
    loading.value = false
  }
}

async function continueStep(step) {
  if (step === 1) {
    if (dataForm.value.email === '') {
      useNuxtApp().$toast.warning('Ingrese correo electrónico valido')
      return
    }
    await resetPassword()
  }

  if (step === 2) {
    loading.value = true
    if (currentCode.value === '') {
      useNuxtApp().$toast.warning('Ingrese codigo temporal')
      return
    }
    if (codeTemp.value !== currentCode.value) {
      useNuxtApp().$toast.warning('Codigo temporal no valido')
      currentCode.value = ''
      loading.value = false
      return
    }
    currentstep.value = 3
    loading.value = false
  }

  if (step === 3)
    await changePassword()
}
</script>

<template>
  <section class="bg-gray-50 ">
    <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      <a href="#" class="flex items-center mb-6 text-2xl font-semibold text-gray-900 ">
        <img class="w-52 mr-2" src="/assets/img/logo.png" alt="logo">
      </a>
      <div class="w-full bg-white rounded-lg shadow r md:mt-0 sm:max-w-md xl:p-0 ">
        <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl ">
            <span v-if="currentstep === 1">  {{ $t("reset-passwordtitle") }}</span>
            <span v-if="currentstep === 2" v-text="'Revisa tu correo electrónico'" />
            <span v-if="currentstep === 3" v-text="'Crear nueva contraseña'" />
          </h1>

          <p v-if="currentstep === 2" class="text-sm font-light text-gray-500 " v-text="'Se ha enviado un código de seguridad a tu correo electrónico, cópialo y pégalo en el siguiente campo de texto'" />
          <section class="space-y-4 md:space-y-6">
            <div v-if="currentstep === 1">
              <label for="email" class="block mb-2 text-sm font-medium text-gray-900 ">Ingrese su correo electrónico</label>
              <input id="email" v-model="dataForm.email" type="email" name="email" class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 " placeholder="name@email.com" required="">
            </div>

            <section v-if="currentstep === 2" class="my-8 flex justify-center">
              <InputsOpt v-model="currentCode" :is-disabled="false" :code-length="6" />
            </section>

            <div v-if="currentstep === 3">
              <div class="mb-4">
                <label for="password" class="block mb-2 text-sm font-medium text-gray-900 ">Ingrese la contraseña</label>
                <input id="password" v-model="dataForm.password" type="password" name="password" placeholder="••••••••" class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5   " required="">
              </div>
              <div>
                <label for="password" class="block mb-2 text-sm font-medium text-gray-900 ">Confirme la contraseña</label>
                <input id="password" v-model="dataForm.confirm_password" type="password" name="password" placeholder="••••••••" class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5   " required="">
              </div>
            </div>

            <button v-if="currentstep === 1" type="submit" class="w-full text-white bg-blue-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center " @click="continueStep(1)">
              <span v-text="loading ? 'Cargando...' : 'Continuar'" />
            </button>
            <button v-if="currentstep === 2" type="submit" class="w-full text-white bg-blue-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center " @click="continueStep(2)">
              <span v-text="loading ? 'Cargando...' : 'Validar'" />
            </button>
            <button v-if="currentstep === 3" type="submit" class="w-full text-white bg-blue-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center " @click="continueStep(3)">
              <span v-text="loading ? 'Cargando...' : 'Guardar'" />
            </button>
          </section>

          <p class="text-sm font-light text-center text-gray-500 col-span-2">
            ¿Ya tienes cuenta? <nuxt-link to="/login" class="font-medium text-blue-600 hover:underline ">
              Iniciar sesión
            </nuxt-link>
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
