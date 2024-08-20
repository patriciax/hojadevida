<script setup>
import MazPhoneNumberInput from 'maz-ui/components/MazPhoneNumberInput'
import 'maz-ui/css/main.css'

const props = defineProps({
  modelValue: {
    type: String,
  },
  errorMessage: {
    type: String,
  },
  isDisabled: {
    type: Boolean,
    default: false,
  },
  id: {
    type: String,
  },
  code: {
    type: String,
  },
})

const emit = defineEmits(['update:modelValue', 'update:number', 'countryCode', 'code'])

function updateValue(_values) {
  emit('update:modelValue', _values.phoneNumber)
  emit('countryCode', _values.countryCallingCode)
  emit('code', _values.countryCode)
}
</script>

<template>
  <div>
    <MazPhoneNumberInput
      :id="id"
      no-search
      no-example
      placeholder=" "
      :auto-format="false"
      :translations="{
        countrySelector: {
          placeholder: '',
        },
      }"
      :model-value="modelValue"
      show-code-on-list
      :default-country-code="props.code ? props.code : 'CO'"
      :disabled="isDisabled"
      :class="{ 'phone-number-error': errorMessage }"
      @data="updateValue"
    />
    <p
      v-if="props.errorMessage"
      class="absolute mt-1 text-xs font-medium text-red-500"
      v-text="props.errorMessage"
    />
  </div>
</template>

<style scoped>
@import 'maz-ui/css/main.css';
</style>
