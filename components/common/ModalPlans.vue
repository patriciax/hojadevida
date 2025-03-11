<script setup lang="ts">
import { XMarkIcon } from '@heroicons/vue/24/solid'
import Modal from './Modal.vue'
import paypal from './Paypal.vue'
</script>

<template>
  <Modal with-out-close @close="$emit('close')">
    <div class="max-h-[95vh]  overflow-hidden bg-white border border-gray-200 rounded-xl shadow-2xl top-0 left-0 z-50 items-center justify-center w-full px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-lg md:px-24 lg:px-8 lg:py-10">
      <div class="max-w-xl  md:mx-auto sm:text-center lg:max-w-2xl  relative">
        <button class="hiddem absolute -right-32 -top-30 focus:outline-none " @click="$emit('close')">
          <XMarkIcon class="w-6 text-gray-700" />
        </button>
        <!-- <div>
        <p class="inline-block px-3 py-px mb-4 text-xs font-semibold tracking-wider text-teal-900 uppercase rounded-full bg-teal-accent-400">
          Brand new
        </p>
      </div> -->
        <!-- <h2 class="max-w-lg mb-6 font-sans text-3xl font-bold leading-none tracking-tight text-gray-900 sm:text-4xl md:mx-auto">
          <span class="relative inline-block">
            <svg viewBox="0 0 52 24" fill="currentColor" class="absolute top-0 left-0 z-0 hidden w-32 -mt-8 -ml-20 text-blue-gray-100 lg:w-32 lg:-ml-28 lg:-mt-10 sm:block">
              <defs>
                <pattern id="ace59d72-08d5-4850-b9e4-d9d0b86c0525" x="0" y="0" width=".135" height=".30">
                  <circle cx="1" cy="1" r=".7" />
                </pattern>
              </defs>
              <rect fill="url(#ace59d72-08d5-4850-b9e4-d9d0b86c0525)" width="52" height="24" />
            </svg>
            <span class="relative">Planes Hoja de Vida Digital
            </span>
          </span>
        </h2>
        <p class="text-base text-gray-700 md:text-lg">
          {{ $t('plans-description') }}
        </p> -->
      </div>
      <div class="grid max-w-md gap-10 -mt-2 row-gap-5 sm:row-gap-10 lg:max-w-screen-md lg:grid-cols-2 sm:mx-auto">
        <div class="flex flex-col justify-between p-5 bg-white border rounded-lg shadow-sm border-gray-500">
          <div class="mb-6">
            <div class="flex items-center justify-between pb-4 mb-4 border-gray-400 border-b">
              <div>
                <p class="text-sm font-bold tracking-wider uppercase">
                  {{ $t('plans-free') }}
                </p>
                <p class="text-3xl font-extrabold">
                  {{ $t('free') }}
                </p>
              </div>
              <div class="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-blue-gray-50">
                <!-- <svg class="w-10 h-10 text-gray-600" viewBox="0 0 24 24" stroke-linecap="round" stroke-width="2">
                  <path d="M12,7L12,7 c-1.657,0-3-1.343-3-3v0c0-1.657,1.343-3,3-3h0c1.657,0,3,1.343,3,3v0C15,5.657,13.657,7,12,7z" fill="none" stroke="currentColor" />
                  <path d="M15,23H9v-5H7v-6 c0-1.105,0.895-2,2-2h6c1.105,0,2,0.895,2,2v6h-2V23z" fill="none" stroke="currentColor" />
                </svg> -->
              </div>
            </div>
            <div>
              <p class="mb-2 font-bold tracking-wide">
                {{ $t('features') }}
              </p>
              <ul class="space-y-2 text-sm">
                <li class="flex r">
                  <div class="mr-2 mt-1">
                    <svg class="w-4 h-4 text-green-600" viewBox="0 0 24 24" stroke-linecap="round" stroke-width="2">
                      <polyline fill="none" stroke="currentColor" points="6,12 10,16 18,8" />
                      <circle cx="12" cy="12" fill="none" r="11" stroke="currentColor" />
                    </svg>
                  </div>
                  <p class="font-medium text-gray-800">
                    Crea y personaliza tu Hoja de Vida
                  </p>
                </li>
                <li class="flex ">
                  <div class="mr-2 mt-1">
                    <svg class="w-4 h-4 text-green-600" viewBox="0 0 24 24" stroke-linecap="round" stroke-width="2">
                      <polyline fill="none" stroke="currentColor" points="6,12 10,16 18,8" />
                      <circle cx="12" cy="12" fill="none" r="11" stroke="currentColor" />
                    </svg>
                  </div>
                  <p class="font-medium text-gray-800">
                    Comparte sin límites con cualquier empresa
                  </p>
                </li>
                <li class="flex items-center">
                  <div class="mr-2">
                    <svg class="w-5 h-5 text-red-600" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 50 50">
                      <path d="M 25 2 C 12.309534 2 2 12.309534 2 25 C 2 37.690466 12.309534 48 25 48 C 37.690466 48 48 37.690466 48 25 C 48 12.309534 37.690466 2 25 2 z M 25 4 C 36.609534 4 46 13.390466 46 25 C 46 36.609534 36.609534 46 25 46 C 13.390466 46 4 36.609534 4 25 C 4 13.390466 13.390466 4 25 4 z M 32.990234 15.986328 A 1.0001 1.0001 0 0 0 32.292969 16.292969 L 25 23.585938 L 17.707031 16.292969 A 1.0001 1.0001 0 0 0 16.990234 15.990234 A 1.0001 1.0001 0 0 0 16.292969 17.707031 L 23.585938 25 L 16.292969 32.292969 A 1.0001 1.0001 0 1 0 17.707031 33.707031 L 25 26.414062 L 32.292969 33.707031 A 1.0001 1.0001 0 1 0 33.707031 32.292969 L 26.414062 25 L 33.707031 17.707031 A 1.0001 1.0001 0 0 0 32.990234 15.986328 z" fill="currentColor" />
                    </svg>
                  </div>
                  <p class="font-medium text-gray-800">
                    Descarga en formato ATS (PDF)
                  </p>
                </li>
                <li class="flex items-center">
                  <div class="mr-2">
                    <svg class="w-5 h-5 text-red-600" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 50 50">
                      <path d="M 25 2 C 12.309534 2 2 12.309534 2 25 C 2 37.690466 12.309534 48 25 48 C 37.690466 48 48 37.690466 48 25 C 48 12.309534 37.690466 2 25 2 z M 25 4 C 36.609534 4 46 13.390466 46 25 C 46 36.609534 36.609534 46 25 46 C 13.390466 46 4 36.609534 4 25 C 4 13.390466 13.390466 4 25 4 z M 32.990234 15.986328 A 1.0001 1.0001 0 0 0 32.292969 16.292969 L 25 23.585938 L 17.707031 16.292969 A 1.0001 1.0001 0 0 0 16.990234 15.990234 A 1.0001 1.0001 0 0 0 16.292969 17.707031 L 23.585938 25 L 16.292969 32.292969 A 1.0001 1.0001 0 1 0 17.707031 33.707031 L 25 26.414062 L 32.292969 33.707031 A 1.0001 1.0001 0 1 0 33.707031 32.292969 L 26.414062 25 L 33.707031 17.707031 A 1.0001 1.0001 0 0 0 32.990234 15.986328 z" fill="currentColor" />
                    </svg>
                  </div>
                  <p class="font-medium text-gray-800">
                    Descarga tu carta de presentación
                  </p>
                </li>
                <li class="flex items-center">
                  <div class="mr-2">
                    <svg class="w-5 h-5 text-red-600" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 50 50">
                      <path d="M 25 2 C 12.309534 2 2 12.309534 2 25 C 2 37.690466 12.309534 48 25 48 C 37.690466 48 48 37.690466 48 25 C 48 12.309534 37.690466 2 25 2 z M 25 4 C 36.609534 4 46 13.390466 46 25 C 46 36.609534 36.609534 46 25 46 C 13.390466 46 4 36.609534 4 25 C 4 13.390466 13.390466 4 25 4 z M 32.990234 15.986328 A 1.0001 1.0001 0 0 0 32.292969 16.292969 L 25 23.585938 L 17.707031 16.292969 A 1.0001 1.0001 0 0 0 16.990234 15.990234 A 1.0001 1.0001 0 0 0 16.292969 17.707031 L 23.585938 25 L 16.292969 32.292969 A 1.0001 1.0001 0 1 0 17.707031 33.707031 L 25 26.414062 L 32.292969 33.707031 A 1.0001 1.0001 0 1 0 33.707031 32.292969 L 26.414062 25 L 33.707031 17.707031 A 1.0001 1.0001 0 0 0 32.990234 15.986328 z" fill="currentColor" />
                    </svg>
                  </div>
                  <p class="font-medium text-gray-800">
                    Acceso a generación con IA
                  </p>
                </li>
                <li class="flex items-center">
                  <div class="mr-2">
                    <svg class="w-5 h-5 text-red-600" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 50 50">
                      <path d="M 25 2 C 12.309534 2 2 12.309534 2 25 C 2 37.690466 12.309534 48 25 48 C 37.690466 48 48 37.690466 48 25 C 48 12.309534 37.690466 2 25 2 z M 25 4 C 36.609534 4 46 13.390466 46 25 C 46 36.609534 36.609534 46 25 46 C 13.390466 46 4 36.609534 4 25 C 4 13.390466 13.390466 4 25 4 z M 32.990234 15.986328 A 1.0001 1.0001 0 0 0 32.292969 16.292969 L 25 23.585938 L 17.707031 16.292969 A 1.0001 1.0001 0 0 0 16.990234 15.990234 A 1.0001 1.0001 0 0 0 16.292969 17.707031 L 23.585938 25 L 16.292969 32.292969 A 1.0001 1.0001 0 1 0 17.707031 33.707031 L 25 26.414062 L 32.292969 33.707031 A 1.0001 1.0001 0 1 0 33.707031 32.292969 L 26.414062 25 L 33.707031 17.707031 A 1.0001 1.0001 0 0 0 32.990234 15.986328 z" fill="currentColor" />
                    </svg>
                  </div>
                  <p class="font-medium text-gray-800">
                    Opciones avanzadas de seguridad (configurar acceso)
                  </p>
                </li>
                <li class="flex items-center">
                  <div class="mr-2">
                    <svg class="w-5 h-5 text-red-600" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 50 50">
                      <path d="M 25 2 C 12.309534 2 2 12.309534 2 25 C 2 37.690466 12.309534 48 25 48 C 37.690466 48 48 37.690466 48 25 C 48 12.309534 37.690466 2 25 2 z M 25 4 C 36.609534 4 46 13.390466 46 25 C 46 36.609534 36.609534 46 25 46 C 13.390466 46 4 36.609534 4 25 C 4 13.390466 13.390466 4 25 4 z M 32.990234 15.986328 A 1.0001 1.0001 0 0 0 32.292969 16.292969 L 25 23.585938 L 17.707031 16.292969 A 1.0001 1.0001 0 0 0 16.990234 15.990234 A 1.0001 1.0001 0 0 0 16.292969 17.707031 L 23.585938 25 L 16.292969 32.292969 A 1.0001 1.0001 0 1 0 17.707031 33.707031 L 25 26.414062 L 32.292969 33.707031 A 1.0001 1.0001 0 1 0 33.707031 32.292969 L 26.414062 25 L 33.707031 17.707031 A 1.0001 1.0001 0 0 0 32.990234 15.986328 z" fill="currentColor" />
                    </svg>
                  </div>
                  <p class="font-medium text-gray-800">
                    Carga y comparte soportes
                  </p>
                </li>
              </ul>
            </div>
          </div>
          <div>
            <a
              class="inline-flex cursor-pointer items-center justify-center w-full h-12 px-6 mb-4 font-medium tracking-wide text-gray-600 transition border-gray-300 duration-200 border rounded shadow-md hover:bg-gray-400 focus:shadow-outline focus:outline-none"
              @click="$emit('close')"
            >
              {{ $t('getstartedFree') }}
            </a>
            <p class="text-sm text-gray-600">
              Ideal para quienes buscan una presencia digital sin costo.
            </p>
          </div>
        </div>
        <div class="flex flex-col justify-between p-5 bg-white border rounded-lg border-gray-500 shadow-sm">
          <div class="mb-6">
            <div class="flex items-center justify-between pb-4 mb-4 border-b border-gray-400">
              <div>
                <p class="text-sm font-bold tracking-wider uppercase">
                  Plan Profesional -50%
                </p>
                <p class="text-3xl font-extrabold">
                  <span class="text-gray-500 text-sm" v-text="'USD '" /> $20
                </p>
                <span class="text-gray-500 text-sm"> Antes $40/año</span>
              </div>
              <div class="flex items-center justify-center w-14 h-14 rounded-full bg-gray-800">
                <svg class="w-10 h-10 text-yellow-400" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M13.91 4.91a1.91 1.91 0 0 1-1.044 1.701c.942 2.366 1.928 3.53 2.795 3.622.982.104 1.88-.323 2.76-1.377a.977.977 0 0 1 .072-.078 1.91 1.91 0 1 1 1.468.873l-1.423 5.42c-.297 1.13-1.363 1.922-2.586 1.922H8.066c-1.223 0-2.29-.792-2.586-1.922L4.063 9.675a1.91 1.91 0 1 1 1.46-.898c.03.028.059.06.086.093.837 1.048 1.727 1.471 2.748 1.363.908-.096 1.888-1.253 2.793-3.614a1.91 1.91 0 1 1 2.76-1.71ZM6.561 19.008h10.875c.518 0 .938.448.938 1s-.42 1-.938 1H6.563c-.517 0-.937-.448-.937-1s.42-1 .937-1Z" fill="currentColor" /></svg>
              </div>
            </div>
            <div>
              <p class="mb-2 font-bold tracking-wide">
                Características
              </p>
              <ul class="space-y-2 text-sm">
                <li class="flex ">
                  <div class="mr-2 mt-1">
                    <svg class="w-4 h-4 text-green-600" viewBox="0 0 24 24" stroke-linecap="round" stroke-width="2">
                      <polyline fill="none" stroke="currentColor" points="6,12 10,16 18,8" />
                      <circle cx="12" cy="12" fill="none" r="11" stroke="currentColor" />
                    </svg>
                  </div>
                  <p class="font-medium text-gray-800">
                    Crea, actualiza y comparte sin límites
                  </p>
                </li>
                <li class="flex ">
                  <div class="mr-2 mt-1">
                    <svg class="w-4 h-4 text-green-600" viewBox="0 0 24 24" stroke-linecap="round" stroke-width="2">
                      <polyline fill="none" stroke="currentColor" points="6,12 10,16 18,8" />
                      <circle cx="12" cy="12" fill="none" r="11" stroke="currentColor" />
                    </svg>
                  </div>
                  <p class="font-medium text-gray-800">
                    Descarga en formato ATS (PDF), optimizado para sistemas de selección
                  </p>
                </li>
                <li class="flex ">
                  <div class="mr-2 mt-1">
                    <svg class="w-4 h-4 text-green-600" viewBox="0 0 24 24" stroke-linecap="round" stroke-width="2">
                      <polyline fill="none" stroke="currentColor" points="6,12 10,16 18,8" />
                      <circle cx="12" cy="12" fill="none" r="11" stroke="currentColor" />
                    </svg>
                  </div>
                  <p class="font-medium text-gray-800">
                    Genera tu carta de presentación con un solo clic
                  </p>
                </li>
                <li class="flex ">
                  <div class="mr-2 mt-1">
                    <svg class="w-4 h-4 text-green-600" viewBox="0 0 24 24" stroke-linecap="round" stroke-width="2">
                      <polyline fill="none" stroke="currentColor" points="6,12 10,16 18,8" />
                      <circle cx="12" cy="12" fill="none" r="11" stroke="currentColor" />
                    </svg>
                  </div>
                  <p class="font-medium text-gray-800">
                    Accede a herramientas de IA para mejorar tu perfil
                  </p>
                </li>
                <li class="flex ">
                  <div class="mr-2 mt-1">
                    <svg class="w-4 h-4 text-green-600" viewBox="0 0 24 24" stroke-linecap="round" stroke-width="2">
                      <polyline fill="none" stroke="currentColor" points="6,12 10,16 18,8" />
                      <circle cx="12" cy="12" fill="none" r="11" stroke="currentColor" />
                    </svg>
                  </div>
                  <p class="font-medium text-gray-800">
                    Configuración de seguridad para controlar el acceso a tu CV
                  </p>
                </li>
                <li class="flex ">
                  <div class="mr-2 mt-1">
                    <svg class="w-4 h-4 text-green-600" viewBox="0 0 24 24" stroke-linecap="round" stroke-width="2">
                      <polyline fill="none" stroke="currentColor" points="6,12 10,16 18,8" />
                      <circle cx="12" cy="12" fill="none" r="11" stroke="currentColor" />
                    </svg>
                  </div>
                  <p class="font-medium text-gray-800">
                    Carga y comparte tus soportes (certificaciones, diplomas, referencias)
                  </p>
                </li>
              </ul>
            </div>
          </div>
          <div class="relative">
            <paypal @close="$emit('close')" />
            <p class="text-sm text-gray-600">
              Recomendado para profesionales que buscan destacarse en el mercado laboral.
            </p>
          </div>
        </div>
      </div>
    </div>
  </modal>
</template>
