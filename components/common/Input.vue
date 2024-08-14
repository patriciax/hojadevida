<script setup>
import { computed, ref } from 'vue'
import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/solid'

const props = defineProps({
  modelValue: {
    type: [String, Number],
  },
  placeholder: {
    type: String,
    default: '',
  },
  id: {
    required: true,
    type: String,
  },
  name: {
    required: true,
    type: String,
  },
  type: {
    default: 'text',
  },
  isDisabled: {
    type: Boolean,
  },
  autocomplete: {
    type: String,
    default: 'off',
  },
  errorMessage: {
    type: String,
  },
  haveError: {
    type: Boolean,
  },
  maxlength: {
    type: Number,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue'])

const showPassword = ref(false)

function changeType() {
  if (props.type === 'password')
    showPassword.value = !showPassword.value
}

const typeApply = computed(() => {
  if (props.type === 'password')
    return showPassword.value ? 'text' : 'password'

  return props.type
})

const handleInput = _event => emit('update:modelValue', _event.target.value)
</script>

<template>
  <div class="relative">
    <input
      :id="props.id"
      class="form__control h-10 -mb-1 "
      :class="haveError ? 'border  border-red-500 ' : ''"
      :name="props.name"
      :type="typeApply"
      :placeholder="props.placeholder"
      :value="props.modelValue"
      :disabled="props.isDisabled"
      :autocomplete="props.autocomplete"
      :maxlength="props.maxlength"
      :readonly="props.readonly"
      @input="handleInput"
    >
    <button
      v-if="props.type === 'password'"
      type="button"
      class="absolute right-4 top-2.5"
      :disabled="props.isDisabled"
      aria-label="show password"
      @click="changeType"
    >
      <EyeIcon v-if="!showPassword" class="text-gray-400 w-5" />
      <EyeSlashIcon v-else class="text-gray-400 w-5" />
    </button>
    <p v-if="props.haveError" class="absolute left-2 mt-1 text-xs font-medium text-red-500" v-text="props.errorMessage" />
  </div>
</template>
