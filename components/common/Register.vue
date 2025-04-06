<script lang="ts" setup>
import useLoginStore from '@/stores/auth'
import { ref } from '#imports'
import 'v-calendar/style.css'
import InputPhoneNumber from './InputPhoneNumber.vue'
import { useRouter } from 'vue-router'
import DateBirth from './dateBirth.vue'

const router = useRouter()

const countryCode = ref(null)
const countryCodeName = ref(null)

const loginStore = useLoginStore()
const isInvalidLastName = ref(false)
const message = ref('')
const error = ref({
  dni: '',
  email: '',
  password: '',
  date: '',
  name: '',
  last_name: '',
  phone_number: '',
  confirm_password: '',

})
const hasErrors = computed(() => {
  return Object.values(error.value).some(err => err)
})

const dataForm = ref({
  email: '',
  password: '',
  confirm_password: '',
  name: '',
  last_name: '',
  phone_number: '',
  dni: '',
  date_of_birth: '',
  formSettings: {
    name: '',
    lastName: '',
    email: '',
    countryCode: '',
    countryCodeName: '',
    phoneNumber: '',
    displaySocial:	true,
    displayEducation:	true,
    displayProjects:	true,
    displayWork:	true,
    displayReferences:	true,

  },

})

function validateFields() {
  // Resetear errores
  for (const key in error.value)
    error.value[key] = ''

  // Validaciones
  if (!dataForm.value.name)
    error.value.name = 'Campo requerido'
  if (!dataForm.value.last_name)
    error.value.last_name = 'Campo requerido'

  if (dataForm.value.last_name.length < 4)
    error.value.last_name = 'Campo con al menos 4 caracteres'

  if (!dataForm.value.email)
    error.value.email = 'Campo requerido'

  if (!dataForm.value.dni)
    error.value.dni = 'Campo requerido'

  if (!dataForm.value.phone_number)
    error.value.phone_number = 'Campo requerido'

  if (!dataForm.value.password)
    error.value.password = 'Campo requerido'
  else if (dataForm.value.password.length < 8)
    error.value.password = 'La contraseña debe tener al menos 8 caracteres'

  if (!dataForm.value.confirm_password)
    error.value.confirm_password = 'Campo requerido'
  else if (dataForm.value.password !== dataForm.value.confirm_password)
    error.value.confirm_password = 'Las contraseñas no coinciden'

  if (!dataForm.value.date_of_birth)
    error.value.date = 'Campo requerido'
}

async function validatedni() {
  await loginStore.validationDNI(dataForm.value.dni)
  if (loginStore.isErrorDni)
    error.value.dni = 'DNI ya registrado'
}
async function register() {
  validateFields()

  if (hasErrors.value)
    return

  validatedni()
  await loginStore.register(dataForm.value)

  if (loginStore.isReady) {
    useNuxtApp().$toast.success('¡Registro exitoso!, ya puedes ingresar y crear tu Hoja de vida')
    setTimeout(() => {
    // await nextTick()

      router.push({ path: '/login' })
    }, 1000)
  }

  if (loginStore.isError) {
    useNuxtApp().$toast.error('Error al registrar')
    if (loginStore.error?.dni)
      error.value.dni = 'DNI ya registrado'

    if (loginStore.error?.email)
      error.value.email = 'Email ya esta en uso'

    if (loginStore.error?.password)
      error.value.password = 'Contraseña invalida'

    if (loginStore.error.date_of_birth)
      error.value.date = loginStore.error.date_of_birth
  }
}
function handleInputPhone(value: any) {
  dataForm.value.phone_number = value
  dataForm.value.formSettings.phoneNumber = value
}

const minDate = new Date()
minDate.setFullYear(minDate.getFullYear() - 18)

function handleDate(date: any) {
  dataForm.value.date_of_birth = date
}

watch(() => dataForm.value.name, (newName) => {
  dataForm.value.formSettings.name = newName
})

watch(() => dataForm.value.last_name, (newLastName) => {
  dataForm.value.formSettings.lastName = newLastName
})

watch(() => dataForm.value.email, (newEmail) => {
  dataForm.value.formSettings.email = newEmail
})
</script>

<template>
  <section class="bg-gray-50 ">
    <div class="flex flex-col  items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      <a href="#" class="flex items-center mb-6 text-2xl font-semibold text-gray-900 ">
        <img class="w-52 mr-2" src="/assets/img/logo.png" alt="logo">
      </a>
      <div class="w-full relative bg-white rounded-lg shadow  md:mt-0 sm:max-w-xl xl:p-0 ">
        <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl ">
            {{ $t("regsiterIn") }}
          </h1>
          <span>Completa el formulario de registro con tus datos</span>
          <form class="gap-y-4 flex flex-col lg:grid grid-cols-2 gap-3" @submit.prevent="register">
            <div>
              <label for="name" class="block mb-2 text-sm font-medium text-gray-900 ">Nombre*</label>
              <input id="name" v-model="dataForm.name" :class="{ 'border-red-500': error.name }" type="text" name="name" class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 " placeholder="Jhon">
              <p v-if="error.name" class="text-xs text-red-600">
                {{ error.name }}
              </p>
            </div>
            <div>
              <label for="last_name" class="block mb-2 text-sm font-medium text-gray-900 ">Apellido*</label>
              <input id="last_name" v-model="dataForm.last_name" :class="{ 'border-red-500': isInvalidLastName || error.last_name }" type="text" name="last_name" class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 " placeholder="Doe" @input="message = ''">
              <p v-if="isInvalidLastName" class="text-xs absolute max-w-max text-red-600 dark:text-red-500">
                {{ message }}
              </p>
              <p v-if="error.last_name" class="text-xs text-red-600">
                {{ error.last_name }}
              </p>
            </div>
            <div class="col-span-">
              <div>
                <label for="email" class="block mb-2 text-sm font-medium text-gray-900 ">Email*</label>
                <input id="email" v-model="dataForm.email" :class="{ 'border-red-500': error.email }" type="email" name="email" class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 " placeholder="name@email.com" @input="error.email = ''">
                <p v-if="error.email" class="text-xs absolute max-w-max text-red-600 dark:text-red-500">
                  {{ error.email }}
                </p>
                <p v-if="error.email" class="text-xs text-red-600">
                  {{ error.email }}
                </p>
              </div>
            </div>
            <div>
              <label for="dni" class="block mb-2 text-sm font-medium text-gray-900 ">Identificación*</label>
              <input id="dni" v-model="dataForm.dni" :class="{ 'border-red-500': error.dni }" type="text" name="dni" class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 " placeholder="123345567" @input="error.dni = ''">
              <p v-if="error.dni" class="text-xs absolute max-w-max text-red-600 dark:text-red-500">
                {{ error.dni }}
              </p>
              <p v-if="error.dni" class="text-xs text-red-600">
                {{ error.dni }}
              </p>
            </div>

            <div>
              <label for="phone" class="block mb-2 text-sm font-medium text-gray-900 ">Teléfono*</label>
              <InputPhoneNumber id="phone" v-model="dataForm.phone_number" placeholder="1234569" class="mt-px" @code="dataForm.formSettings.countryCodeName = $event " @country-code="dataForm.formSettings.countryCode = $event " @update:model-value="handleInputPhone" />
              <p v-if="error.phone_number" class="text-xs text-red-600">
                {{ error.phone_number }}
              </p>
              <!-- <input id="phone" v-model="dataForm.phone_number" type="text" name="phone" class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 " placeholder="571234569" > -->
            </div>
            <DateBirth :errores="error.date" @date="handleDate" />

            <section class="group col-span-2 flex flex-col lg:grid grid-cols-2 gap-3">
              <div class="">
                <label for="password" class="block mb-2 text-sm font-medium text-gray-900 ">Contraseña*</label>
                <input id="password" v-model="dataForm.password" :class="{ 'border-red-500': error.password }" type="password" name="password" placeholder="••••••••" class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5   " @input="error.password = ''">
              </div>
              <div>
                <label for="password" class="block mb-2 text-sm font-medium text-gray-900 ">Confirmar contraseña*</label>
                <input id="password" v-model="dataForm.confirm_password" :class="{ 'border-red-500': error.password }" type="password" name="password" placeholder="••••••••" class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5   " @input="error.password = ''">
              </div>
              <p v-if="error.password" class="text-md bg-red-100 w-full  col-span-2 rounded-md text-center py-2 text-red-600 dark:text-red-500">
                {{ error.password }}
              </p>

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
            <section class="col-span-2 text-xs text-gray-500">
              <p>
                Al hacer clic en "Crear cuenta", aceptas nuestras <a href="https://hojadevida.digital/terminos-y-condiciones/" target="_blank" class="text-blue-600 hover:underline ">Condiciones</a> , la Política de privacidad y la Política de cookies.
              </p>
            </section>
            <button

              type="submit" class="w-full mt-0 col-span-2 text-white bg-blue-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center "
            >
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
