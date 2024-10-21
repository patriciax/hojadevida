<script setup>
import { ref } from 'vue'

const props = defineProps({
  codeLength: {
    type: Number,
  },
  isDisabled: {
    type: Boolean,
  },
  modelValue: {
    type: String,
  },
})

const emit = defineEmits(['update:modelValue'])

const code = ref(Array(props.codeLength).fill(''))

function handleKeyUp(_event) {
  if (!_event.target.value)
    return
  const next = _event.target.nextElementSibling
  if (next)
    next.focus()

  const emitCode = code.value.join('')

  if (emitCode.length === props.codeLength)
    emit('update:modelValue', emitCode)
}

function handleDelete(_event) {
  const previous = _event.target.previousElementSibling
  if (previous)
    previous.focus()

  const index = Array.from(_event.target.parentNode.children).indexOf(_event.target)
  code.value[index] = ''
}

function handlePaste(event) {
  event.preventDefault()
  const pasteData = event.clipboardData.getData('text').slice(0, props.codeLength).split('')

  pasteData.forEach((char, index) => {
    if (index < props.codeLength) {
      code.value[index] = char
      const nextInput = event.target.parentNode.children[index + 1]
      if (nextInput)
        nextInput.focus()
    }
  })

  emit('update:modelValue', code.value.join(''))
}
</script>

<template>
  <form class="grid grid-cols-6 gap-x-2 lg:gap-x-4">
    <input
      v-for="(item, index) in props.codeLength"
      :key="index"
      v-model="code[index]"
      class="block h-12 w-12 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-center"
      placeholder="0"
      maxlength="1"
      :disabled="props.isDisabled"
      :autofocus="index === 0"
      @keyup="handleKeyUp"
      @keyup.delete="handleDelete"
      @paste="handlePaste"
    >
  </form>
</template>
