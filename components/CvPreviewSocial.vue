<script lang="ts" setup>
import { UserGroupIcon } from '@heroicons/vue/24/solid'
import { useCvState } from '~/data/useCvState'

const props = defineProps<{
  color?: string
}>()

const { formSettings } = useCvState()
</script>

<template>
  <section
    v-if="formSettings.displaySocial"
    class="cv__section"
  >
    <h4
      class="cv__section-title"
      :class="[formSettings.layout === 'one-column' && 'sr-only', { 'flex gap-2': formSettings.layout === 'two-column' || formSettings.layout === 'three-column' || formSettings.layout === 'four-column' }]"
    >
      <div v-if="formSettings.layout === 'two-column' || formSettings.layout === 'three-column' || formSettings.layout === 'four-column'" class="bg-change rounded-full  w-8 h-8 flex justify-center items-center">
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
        <a
          target="_blank"
          rel="noopener"
          :href="`https://linkedin.com/in/${formSettings.linkedin}`"
        >
          <svg class="cv__icon">
            <use href="@/assets/sprite.svg#linkedin-color" />
          </svg>
        </a>
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
        <a
          target="_blank"
          rel="noopener"
          :href="`https://twitter.com/${formSettings.twitter}`"
        >
          <svg class="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="48" height="48" viewBox="0 0 48 48">
            <path fill="currentColor" fill-rule="evenodd" d="M38,42H10c-2.209,0-4-1.791-4-4V10c0-2.209,1.791-4,4-4h28	c2.209,0,4,1.791,4,4v28C42,40.209,40.209,42,38,42z" clip-rule="evenodd" /><path :fill="props.color === 'black' ? '#000' : '#fff' " d="M34.257,34h-6.437L13.829,14h6.437L34.257,34z M28.587,32.304h2.563L19.499,15.696h-2.563 L28.587,32.304z" /><polygon :fill="props.color === 'black' ? '#000' : '#fff' " points="15.866,34 23.069,25.656 22.127,24.407 13.823,34" /><polygon :fill="props.color === 'black' ? '#000' : '#fff' " points="24.45,21.721 25.355,23.01 33.136,14 31.136,14" />
          </svg>
        </a>
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
        <a
          target="_blank"
          rel="noopener"
          :href="`https://www.facebook.com/${formSettings.facebook}`"
        >
          <svg class="w-4 h-4 mr-1" fill="currentColor" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="16" height="16" viewBox="0 0 16 16">
            <path d="M8,0C3.582,0,0,3.582,0,8c0,4.01,2.954,7.321,6.803,7.901V10.12H4.824V8.016h1.979V6.618c0-2.317,1.13-3.334,3.054-3.334	c0.923,0,1.411,0.069,1.641,0.099v1.836h-1.312c-0.817,0-1.104,0.775-1.104,1.65v1.148h2.396l-0.326,2.104H9.082v5.798l0,0.001	C12.987,15.389,16,12.05,16,8C16,3.582,12.418,0,8,0z" />
          </svg>
        </a>
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
        <a
          target="_blank"
          rel="noopener"
          :href="`https://github.com/${formSettings.github}`"
        >
          <svg class="cv__icon">
            <use href="@/assets/sprite.svg#github-color" />
          </svg>
        </a>
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
        <a
          target="_blank"
          rel="noopener"
          :href="`https://www.instagram.com/${formSettings.instagram}`"
        >
          <svg class="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="48" height="48" viewBox="0 0 48 48 " fill="currentColor">
            <path d="M 16.5 5 C 10.159 5 5 10.159 5 16.5 L 5 31.5 C 5 37.841 10.159 43 16.5 43 L 31.5 43 C 37.841 43 43 37.841 43 31.5 L 43 16.5 C 43 10.159 37.841 5 31.5 5 L 16.5 5 z M 34 12 C 35.105 12 36 12.895 36 14 C 36 15.104 35.105 16 34 16 C 32.895 16 32 15.104 32 14 C 32 12.895 32.895 12 34 12 z M 24 14 C 29.514 14 34 18.486 34 24 C 34 29.514 29.514 34 24 34 C 18.486 34 14 29.514 14 24 C 14 18.486 18.486 14 24 14 z M 24 17 A 7 7 0 1 0 24 31 A 7 7 0 1 0 24 17 z" />
          </svg>
        </a>
        <a
          target="_blank"
          rel="noopener"
          :href="`https://www.instagram.com/${formSettings.instagram}`"
        >{{ formSettings.instagram }}</a>
      </div>
      <div
        v-if="formSettings.tiktok"
        class="cv__icon-wrapper"
      >
        <a
          target="_blank"
          rel="noopener"
          :href="`https://www.tiktok.com/@${formSettings.tiktok}`"
        >

          <svg fill="currentColor" class="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="50" height="50" viewBox="0 0 50 50">
            <path d="M41,4H9C6.243,4,4,6.243,4,9v32c0,2.757,2.243,5,5,5h32c2.757,0,5-2.243,5-5V9C46,6.243,43.757,4,41,4z M37.006,22.323 c-0.227,0.021-0.457,0.035-0.69,0.035c-2.623,0-4.928-1.349-6.269-3.388c0,5.349,0,11.435,0,11.537c0,4.709-3.818,8.527-8.527,8.527 s-8.527-3.818-8.527-8.527s3.818-8.527,8.527-8.527c0.178,0,0.352,0.016,0.527,0.027v4.202c-0.175-0.021-0.347-0.053-0.527-0.053 c-2.404,0-4.352,1.948-4.352,4.352s1.948,4.352,4.352,4.352s4.527-1.894,4.527-4.298c0-0.095,0.042-19.594,0.042-19.594h4.016 c0.378,3.591,3.277,6.425,6.901,6.685V22.323z" />
          </svg>
        </a>
        <a
          target="_blank"
          rel="noopener"
          :href="`https://www.tiktok.com/@${formSettings.tiktok}`"
        >{{ formSettings.tiktok }}</a>
      </div>
      <div
        v-if="formSettings.youtube"
        class="cv__icon-wrapper"
      >
        <a
          target="_blank"
          rel="noopener"
          :href="`https://www.youtube.com/${formSettings.youtube}`"
        >

          <svg fill="currentColor" class="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="48" height="48" viewBox="0 0 48 48">
            <path fill="currentColor" d="M43.2,33.9c-0.4,2.1-2.1,3.7-4.2,4c-3.3,0.5-8.8,1.1-15,1.1c-6.1,0-11.6-0.6-15-1.1c-2.1-0.3-3.8-1.9-4.2-4C4.4,31.6,4,28.2,4,24c0-4.2,0.4-7.6,0.8-9.9c0.4-2.1,2.1-3.7,4.2-4C12.3,9.6,17.8,9,24,9c6.2,0,11.6,0.6,15,1.1c2.1,0.3,3.8,1.9,4.2,4c0.4,2.3,0.9,5.7,0.9,9.9C44,28.2,43.6,31.6,43.2,33.9z" /><path :fill="props.color === 'black' ? '#000' : '#fff'" d="M20 31L20 17 32 24z" />
          </svg>
        </a>
        <a
          target="_blank"
          rel="noopener"
          :href="`https://www.youtube.com/${formSettings.youtube}`"
        >{{ formSettings.youtube }}</a>
      </div>
      <div
        v-if="formSettings.website"
        class="cv__icon-wrapper"
      >
        <a
          target="_blank"
          rel="noopener"
          :href="formSettings.website.includes('https') ? formSettings.website : `https://${formSettings.website}`"
        >
          <svg class="cv__icon">
            <use href="@/assets/sprite.svg#website" />
          </svg>
        </a>
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
