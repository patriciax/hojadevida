<script lang="ts" setup>
import useLoginStore from '@/stores/auth'

const loginStore = useLoginStore()
const dataForm = ref({
  email: '',
  password: '',
})
async function login() {
  await loginStore.login(dataForm.value)

  if (loginStore.isReady)
    navigateTo('/')

  if (loginStore.isError)
    useNuxtApp().$toast.error('Email o contraseña no válidos.')
}

onMounted(() => {
  // loginStore.hydrate()

  if (loginStore.token)
    navigateTo('/')
})
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
            {{ $t("singIn") }}
          </h1>
          <form class="space-y-4 md:space-y-6" @submit.prevent="login">
            <div>
              <label for="email" class="block mb-2 text-sm font-medium text-gray-900 ">Email</label>
              <input id="email" v-model="dataForm.email" type="email" name="email" class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 " placeholder="name@email.com" required="">
            </div>
            <div>
              <label for="password" class="block mb-2 text-sm font-medium text-gray-900 ">Contraseña</label>
              <input id="password" v-model="dataForm.password" type="password" name="password" placeholder="••••••••" class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5   " required="">
            </div>
            <!-- <div class="flex items-center justify-between">
              <div class="flex items-start">
                <div class="flex items-center h-5" />
              </div>
              <a href="#" class="text-sm font-medium text-blue-600 hover:underline ">Olvidaste la contraseña?</a>
            </div> -->
            <button type="submit" class="w-full text-white bg-blue-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center ">
              Iniciar sesión
            </button>
            <p class="text-sm text-center font-light text-gray-500 ">
              ¿Aún no tienes cuenta? <nuxt-link to="/register" class="font-medium text-blue-600 hover:underline ">
                Regístrate
              </nuxt-link>
            </p>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>
