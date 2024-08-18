<script lang="ts" setup>
import useLoginStore from '@/stores/auth'

const loginStore = useLoginStore()
const isInvalidLastName = ref(false)
const message = ref('')
const rulesPassword = ref(false)
const error = ref({
  dni: '',
  email: '',
  password: '',
})

const dataForm = ref({
  email: '',
  password: '',
  confirm_password: '',
  name: '',
  last_name: '',
  phone_number: '',
  dni: '',
})
async function register() {
  isInvalidLastName.value = dataForm.value.last_name.length < 4
  if (isInvalidLastName.value) {
    message.value = 'Campo con al menos 4 caracteres'
    return
  }
  if (dataForm.value.password.length < 8) {
    error.value.password = 'La contraseña debe tener al menos 8 caracteres'
    return
  }
  if (dataForm.value.password !== dataForm.value.confirm_password) {
    error.value.password = 'Las contraseñas no coinciden'
    return
  }

  await loginStore.register(dataForm.value)

  if (loginStore.isReady) {
    useNuxtApp().$toast.success('¡Registro exitoso!')
    setTimeout(() => {
      navigateTo('/login')
    }, 2000)
  }

  if (loginStore.isError) {
    useNuxtApp().$toast.error('Error al registrar')
    if (loginStore.error?.dni)
      error.value.dni = 'DNI ya registrado'

    if (loginStore.error?.email)
      error.value.email = 'Email ya esta en uso'

    if (loginStore.error?.password)
      error.value.password = 'Contraseña invalida'
  }
}
</script>

<template>
  <section class="bg-gray-50 ">
    <div class="flex flex-col  items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      <a href="#" class="flex items-center mb-6 text-2xl font-semibold text-gray-900 ">
        <img class="w-52 mr-2" src="/assets/img/logo.png" alt="logo">
      </a>
      <div class="w-full relative bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-lg xl:p-0 ">
        <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl ">
            {{ $t("regsiterIn") }}
          </h1>
          <form class="gap-y-4 flex flex-col lg:grid grid-cols-2 gap-3" @submit.prevent="register">
            <div>
              <label for="name" class="block mb-2 text-sm font-medium text-gray-900 ">Nombre</label>
              <input id="name" v-model="dataForm.name" type="text" name="name" class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 " placeholder="Jhon" required>
            </div>
            <div>
              <label for="last_name" class="block mb-2 text-sm font-medium text-gray-900 ">Apellido</label>
              <input id="last_name" v-model="dataForm.last_name" :class="{ 'border-red-500': isInvalidLastName }" type="text" name="last_name" class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 " placeholder="Doe" required @input="message = ''">
              <p v-if="isInvalidLastName" class="text-xs absolute max-w-max text-red-600 dark:text-red-500">
                {{ message }}
              </p>
            </div>
            <div class="col-span-2">
              <label for="email" class="block mb-2 text-sm font-medium text-gray-900 ">Email</label>
              <input id="email" v-model="dataForm.email" :class="{ 'border-red-500': error.email }" type="email" name="email" class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 " placeholder="name@email.com" required @input="error.email = ''">
              <p v-if="error.email" class="text-xs absolute max-w-max text-red-600 dark:text-red-500">
                {{ error.email }}
              </p>
            </div>
            <div>
              <label for="dni" class="block mb-2 text-sm font-medium text-gray-900 ">Identificación</label>
              <input id="dni" v-model="dataForm.dni" :class="{ 'border-red-500': error.dni }" type="text" name="dni" class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 " placeholder="123345567" required @input="error.dni = ''">
              <p v-if="error.dni" class="text-xs absolute max-w-max text-red-600 dark:text-red-500">
                {{ error.dni }}
              </p>
            </div>
            <div>
              <label for="phone" class="block mb-2 text-sm font-medium text-gray-900 ">Teléfono</label>
              <input id="phone" v-model="dataForm.phone_number" type="text" name="phone" class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 " placeholder="571234569" required>
            </div>
            <section class="group col-span-2 flex flex-col lg:grid grid-cols-2 gap-3">
              <div class="">
                <label for="password" class="block mb-2 text-sm font-medium text-gray-900 ">Contraseña</label>
                <input id="password" v-model="dataForm.password" type="password" name="password" placeholder="••••••••" class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5   " required @input="error.password = ''">
              </div>
              <div>
                <label for="password" class="block mb-2 text-sm font-medium text-gray-900 ">Confirmar ontraseña</label>
                <input id="password" v-model="dataForm.confirm_password" type="password" name="password" placeholder="••••••••" class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5   " required @input="error.password = ''">
              </div>
              <p v-if="error.password" class="text-md bg-red-100 w-full  col-span-2 rounded-md text-center py-2 text-red-600 dark:text-red-500">
                {{ error.password }}
              </p>
              <!-- <div class="flex items-center justify-between col-span-2">
              <div class="flex items-start">
                <div class="flex items-center h-5" />
              </div>
              <a href="#" class="text-sm font-medium text-blue-600 hover:underline ">Olvidaste la contraseña?</a>
            </div> -->
              <div class="opacity-0 group-hover:opacity-100  absolute  xl:bottom-[28%] top-[50%] lg:top-[60%]  bg-white bg-opacity-85 p-2 rounded-lg col-span-2 lg:-right-60 xl:-right-72">
                <p class="font-bold text-xs" v-text="'  Crea una Contraseña Segura:'" />

                <ul class="list-disc text-xs ml-4 my-1">
                  <li>
                    Mínimo 8 caracteres.
                  </li>
                  <li>Incluye: Mayúsculas, minúsculas y números.</li>
                  <li>Recomendado: Usa símbolos (e.g., !@#$).</li>
                </ul>
              </div>
            </section>
            <button type="submit" class="w-full mt-6 col-span-2 text-white bg-blue-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center ">
              Crear cuenta
            </button>
            <p class="text-sm font-light text-center text-gray-500 col-span-2">
              ¿Ya tienes cuenta? <nuxt-link to="/login" class="font-medium text-blue-600 hover:underline ">
                Iniciar sesión
              </nuxt-link>
            </p>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>
