<script setup>
const props = defineProps({
  sectionTemplate: {
    type: String,
  },
})
</script>

<template>
  <section
    :class="props.sectionTemplate !== 'ia' ? 'mt-2 left-1/2 -translate-x-1/2 top-full  ' : 'right-0 '"
    class="bg-gray-700 hidden group-hover:block z-50 px-2 text-white text-xs absolute transform  font-normal rounded-lg w-56 text-center py-1 "
  >
    Actualiza tu plan para obtener todas las funcionalidades.
    <!-- <a class="underline" href="#">Contactar</a> -->
  </section>
</template>
