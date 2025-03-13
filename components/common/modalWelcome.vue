<script setup>
import { useRouter } from 'vue-router'
import Modal from './Modal.vue'

const router = useRouter()

function back() {
  router.push({ path: '/' })
}
</script>

<template>
  <Modal with-out-close @close="$emit('close')">
    <section class="rounded-3xl shadow-2xl">
      <div class="p-8 text-center sm:p-12">
        <p class="text-sm font-semibold uppercase tracking-widest text-gray-400">
          crea y personaliza tu Hoja de vida
        </p>

        <h2 class="mt-6 text-3xl font-bold">
          Registro exitoso, ya puedes ingresar y crear tu Hoja de vida
        </h2>

        <a
          class="mt-8 inline-block w-full rounded-full bg-blue-600 py-4 text-sm font-bold text-white shadow-xl"
          @click="back"
        >
          Empezar
        </a>
      </div>
    </section>
  </Modal>
</template>
