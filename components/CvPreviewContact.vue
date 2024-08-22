<script lang="ts" setup>
import { EnvelopeIcon } from '@heroicons/vue/24/solid'
import { useCvState } from '~/data/useCvState'

const { formSettings } = useCvState()

const emailHref = computed(() => {
  return `mailto:${formSettings.value.email}`
})
const phoneNumberHref = computed(() => {
  return `tel:${formSettings.value.countryCode}${formSettings.value.phoneNumber}`
})
</script>

<template>
  <section
    class="cv__section"
    :class="formSettings.layout === 'one-column' && 'mt-0'"
  >
    <h4
      class="cv__section-title flex gap-2"
      :class="[{ 'sr-only': formSettings.layout === 'one-column' }]"
    >
      <a :href="`https://api.whatsapp.com/send?phone=${formSettings.countryCode}${formSettings.phoneNumber}&text=Hola,%20he%20revisado%20tu%20hoja%20de%20vida%20digital%20y%20me%20ha%20interesado%20mucho%20tu%20perfil.%20Me%20gustaría%20ponerme%20en%20contacto%20contigo.`" target="_blank">
        <div v-if="formSettings.layout === 'two-column' || formSettings.layout === 'three-column' || formSettings.layout === 'four-column'" class="bg-change rounded-full  w-6 h-6 flex justify-center items-center">
          <svg class="w-4 h-4 fill-white text-white" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 24 24">
            <path d="M19.077,4.928c-2.082-2.083-4.922-3.134-7.904-2.894C7.164,2.356,3.65,5.144,2.474,8.99 c-0.84,2.748-0.487,5.617,0.881,7.987L2.059,21.28c-0.124,0.413,0.253,0.802,0.67,0.691l4.504-1.207 c1.459,0.796,3.101,1.215,4.773,1.216h0.004c4.195,0,8.071-2.566,9.412-6.541C22.728,11.563,21.762,7.616,19.077,4.928z M16.898,15.554c-0.208,0.583-1.227,1.145-1.685,1.186c-0.458,0.042-0.887,0.207-2.995-0.624c-2.537-1-4.139-3.601-4.263-3.767 c-0.125-0.167-1.019-1.353-1.019-2.581S7.581,7.936,7.81,7.687c0.229-0.25,0.499-0.312,0.666-0.312c0.166,0,0.333,0,0.478,0.006 c0.178,0.007,0.375,0.016,0.562,0.431c0.222,0.494,0.707,1.728,0.769,1.853s0.104,0.271,0.021,0.437s-0.125,0.27-0.249,0.416 c-0.125,0.146-0.262,0.325-0.374,0.437c-0.125,0.124-0.255,0.26-0.11,0.509c0.146,0.25,0.646,1.067,1.388,1.728 c0.954,0.85,1.757,1.113,2.007,1.239c0.25,0.125,0.395,0.104,0.541-0.063c0.146-0.166,0.624-0.728,0.79-0.978 s0.333-0.208,0.562-0.125s1.456,0.687,1.705,0.812c0.25,0.125,0.416,0.187,0.478,0.291 C17.106,14.471,17.106,14.971,16.898,15.554z" />
          </svg>
        <!-- <EnvelopeIcon class="icon-style" /> -->
        </div>
      </a>
      {{ $t("contact") }}
    </h4>
    <div
      class="flex"
      :class="formSettings.layout === 'one-column' ? 'flex-wrap gap-2' : 'flex-col gap-3'"
    >
      <div
        v-if="formSettings.email"
        class="cv__icon-wrapper"
      >
        <svg class="cv__icon">
          <use href="@/assets/sprite.svg#email" />
        </svg>
        <a
          :href="emailHref"
          rel="noopener"
        >{{ formSettings.email }}</a>
      </div>
      <div
        v-if="formSettings.phoneNumber"
        class="cv__icon-wrapper"
      >
        <svg class="cv__icon">
          <use href="@/assets/sprite.svg#phone" />
        </svg>
        <a
          :href="phoneNumberHref"
          rel="noopener"
        >
          <span v-if="formSettings.countryCode">+{{ formSettings.countryCode }}</span>
          {{
            formSettings.phoneNumber
          }}</a>
      </div>

      <div
        v-if="formSettings.location"
        class="cv__icon-wrapper"
      >
        <svg class="cv__icon">
          <use href="@/assets/sprite.svg#location" />
        </svg>
        <span tabindex="0">{{ formSettings.location }}</span>
        <span v-if="formSettings.city || formSettings.country" tabindex="0">, {{ formSettings.country.name }} <span v-if="formSettings.city" v-text="','" />  {{ formSettings.city.name }}
        </span>
      </div>
    </div>
  </section>
</template>
