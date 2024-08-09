<script lang="ts" setup>
import { UserGroupIcon } from '@heroicons/vue/24/solid'
import { useCvState } from '~/data/useCvState'

const { formSettings } = useCvState()
</script>

<template>
  <section
    v-if="formSettings.displaySocial"
    class="cv__section"
  >
    <h4
      class="cv__section-title"
      :class="[formSettings.layout === 'one-column' && 'sr-only', { 'flex gap-2': formSettings.layout === 'two-column' }]"
    >
      <div v-if="formSettings.layout === 'two-column'" class="bg-change rounded-full  w-6 h-6 flex justify-center items-center">
        <UserGroupIcon class="icon-style" />
      </div>
      {{ $t("social") }}
    </h4>
    <div
      class="flex "
      :class="formSettings.layout === 'one-column' ? 'flex-row flex-wrap gap-2' : 'flex-col gap-2'"
    >
      <div
        v-if="formSettings.linkedin"
        class="cv__icon-wrapper"
      >
        <svg class="cv__icon">
          <use href="@/assets/sprite.svg#linkedin-color" />
        </svg>
        <a
          target="_blank"
          rel="noopener"
          :href="`https://linkedin.com/in/${formSettings.linkedin}`"
        >{{ formSettings.linkedin }}</a>
      </div>

      <div
        v-if="formSettings.twitter"
        class="cv__icon-wrapper"
      >
        <svg class="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="48" height="48" viewBox="0 0 48 48">
          <path fill="#212121" fill-rule="evenodd" d="M38,42H10c-2.209,0-4-1.791-4-4V10c0-2.209,1.791-4,4-4h28	c2.209,0,4,1.791,4,4v28C42,40.209,40.209,42,38,42z" clip-rule="evenodd" /><path fill="#fff" d="M34.257,34h-6.437L13.829,14h6.437L34.257,34z M28.587,32.304h2.563L19.499,15.696h-2.563 L28.587,32.304z" /><polygon fill="#fff" points="15.866,34 23.069,25.656 22.127,24.407 13.823,34" /><polygon fill="#fff" points="24.45,21.721 25.355,23.01 33.136,14 31.136,14" />
        </svg>
        <a
          target="_blank"
          rel="noopener"
          :href="`https://twitter.com/${formSettings.twitter}`"
        >{{ formSettings.twitter }}</a>
      </div>
      <div
        v-if="formSettings.facebook"
        class="cv__icon-wrapper"
      >
        <svg class="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="16" height="16" viewBox="0 0 16 16">
          <path d="M8,0C3.582,0,0,3.582,0,8c0,4.01,2.954,7.321,6.803,7.901V10.12H4.824V8.016h1.979V6.618c0-2.317,1.13-3.334,3.054-3.334	c0.923,0,1.411,0.069,1.641,0.099v1.836h-1.312c-0.817,0-1.104,0.775-1.104,1.65v1.148h2.396l-0.326,2.104H9.082v5.798l0,0.001	C12.987,15.389,16,12.05,16,8C16,3.582,12.418,0,8,0z" />
        </svg>
        <a
          target="_blank"
          rel="noopener"
          :href="`https://www.facebook.com/${formSettings.facebook}`"
        >{{ formSettings.facebook }}</a>
      </div>
      <div
        v-if="formSettings.github"
        class="cv__icon-wrapper"
      >
        <svg class="cv__icon">
          <use href="@/assets/sprite.svg#github-color" />
        </svg>
        <a
          target="_blank"
          rel="noopener"
          :href="`https://github.com/${formSettings.github}`"
        >{{ formSettings.github }}</a>
      </div>
      <div
        v-if="formSettings.instagram"
        class="cv__icon-wrapper"
      >
        <svg class="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="48" height="48" viewBox="0 0 48 48">
          <path d="M 16.5 5 C 10.159 5 5 10.159 5 16.5 L 5 31.5 C 5 37.841 10.159 43 16.5 43 L 31.5 43 C 37.841 43 43 37.841 43 31.5 L 43 16.5 C 43 10.159 37.841 5 31.5 5 L 16.5 5 z M 34 12 C 35.105 12 36 12.895 36 14 C 36 15.104 35.105 16 34 16 C 32.895 16 32 15.104 32 14 C 32 12.895 32.895 12 34 12 z M 24 14 C 29.514 14 34 18.486 34 24 C 34 29.514 29.514 34 24 34 C 18.486 34 14 29.514 14 24 C 14 18.486 18.486 14 24 14 z M 24 17 A 7 7 0 1 0 24 31 A 7 7 0 1 0 24 17 z" />
        </svg>
        <a
          target="_blank"
          rel="noopener"
          :href="`https://www.instagram.com/${formSettings.instagram}`"
        >{{ formSettings.instagram }}</a>
      </div>
      <div
        v-if="formSettings.website"
        class="cv__icon-wrapper"
      >
        <svg class="cv__icon">
          <use href="@/assets/sprite.svg#website" />
        </svg>
        <a
          target="_blank"
          rel="noopener"
          :href="formSettings.website.includes('https') ? formSettings.website : `https://${formSettings.website}`"
        >{{
          formSettings.website
        }}</a>
      </div>
    </div>
  </section>
</template>
