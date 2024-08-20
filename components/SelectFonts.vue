<script setup>
import { ref } from 'vue'
import useFontsStore from '@/stores/font'

const props = defineProps({
  currentFont: {
    type: String,
    default: 'ralewayNOS',
  },
})
const emit = defineEmits(['changeFont'])
const fontsStore = useFontsStore()
const selectedFont = ref('')

function changeFont() {
  const fontName = selectedFont.value.replace(/ /g, '+')
  const link = document.createElement('link')
  link.href = `https://fonts.googleapis.com/css2?family=${fontName}&display=swap`
  link.rel = 'stylesheet'

  const existingLink = document.getElementById('font-link')
  if (existingLink)
    existingLink.parentNode.removeChild(existingLink)

  link.id = 'font-link'
  document.head.appendChild(link)

  const textContainer = document.querySelector('.font-selected')
  textContainer.style.fontFamily = selectedFont.value

  emit('changeFont', selectedFont.value)

//   localStorage.setItem(`cvSettings-${i18n.locale.value}`, JSON.stringify({
//     ...formSettings.value,
//     font: selectedFont.value,
//   }))
}
// watch(
//   () => formSettings.value,
//   (newValue, oldValue) => {
//     localStorage.setItem(`cvSettings-${i18n.locale.value}`, JSON.stringify(newValue))
//     if (newValue.font !== oldValue.font)
//       changeFont(resumenStore.formSettings?.font)
//   },
//   { deep: true },
// )
</script>

<template>
  <div>
    <select v-model="selectedFont" class="mb-4 form__control h-10 " @change="changeFont">
      <option disabled value="" v-text="props.currentFont ? props.currentFont : $t('selectFont')" />
      <option v-for="font in fontsStore.fonts" :key="font" :value="font">
        {{ font }}
      </option>
    </select>
    <!-- <div class="font-selected" :style="{ fontFamily: selectedFont }"> -->
  </div>
</template>
