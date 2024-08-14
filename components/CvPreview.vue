<script lang="ts" setup>
import { defineComponent } from 'vue'
import { LockClosedIcon } from '@heroicons/vue/24/solid'
import CvPreviewThreeColumn from './CvPreviewThreeColumn.vue'
import { useCvState } from '~/data/useCvState'

const props = defineProps<{
  color?: string
}>()

const showPassword = ref(false)
const { formSettings, isLoading } = useCvState()

function sendPassword() {
  console.log('sendPassword')
  showPassword.value = false
}
</script>

<template>
  <nav class="bg-white fixed left-52 right-0  z-[1] w-full top-0  border-gray-200 shadow-sm ">
    <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
      <div class="flex h-9 items-center gap-4 cursor-pointer text-gray-700 hover:text-gray-900">
        <div class="flex items-center gap-1" @click="showPassword = !showPassword">
          <LockClosedIcon class="w-3.5 h-3.5" />
          <p class="text-sm  " v-text="$t('addPassword')" />
        </div>

        <div v-if="showPassword" class="flex items-center space-x-3 rtl:space-x-reverse">
          <input type="password" class="form__control" @focus="showPassword = true">
          <button class="form__btn text-xs" type="button" @click="sendPassword" v-text="$t('addnewpasss')" />
        </div>
      </div>

      <button data-collapse-toggle="navbar-default" type="button" class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-default" aria-expanded="false">
        <span class="sr-only">Open main menu</span>
        <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15" />
        </svg>
      </button>
      <div id="navbar-default" class="hidden w-full md:block md:w-auto">
        <ul class="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white">
          <li>
            <a href="#" class="block py-2 px-3 text-gray-700 bg-blue-700 rounded md:bg-transparent md:p-0 " aria-current="page">Login</a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
  <div
    class="
    mt-10
    cvWrapper
    font-normal
    text-slate-800 text-sm/normal
    bg-white
    relative
    w-full
    overflow-y-auto
    overflow-x-hidden
    p-6
    flex
    flex-col
    items-center
    "
  >
    <div style="min-height: var(--height);">
      <div
        tabindex="0"
        aria-label="CV preview"
        class="cv shadow-lg mt-6 bg-white relative"
        :class="[
          { blur: isLoading },
          formSettings.layout === 'one-column' && 'p-10 flex flex-col gap-4',
          formSettings.layout === 'two-column' && 'grid grid-cols-3 ',
          formSettings.layout === 'three-column' && 'grid grid-cols-2',
          formSettings.layout === 'four-column' && 'grid grid-cols-3 ',
        ]"
      >
        <template v-if="formSettings.layout === 'one-column'">
          <CvPreviewOneColumn />
        </template>

        <template v-if="formSettings.layout === 'two-column' ">
          <CvPreviewTwoColumn :color="props.color" />
        </template>
        <template v-if="formSettings.layout === 'three-column'">
          <CvPreviewThreeColumn :color="props.color" />
        </template>
        <template v-if="formSettings.layout === 'four-column'">
          <CvPreviewFourColumn :color="props.color" />
        </template>
      </div>
    </div>

    <!-- <div class="credit">
      Made with ♥️ by
      <a
        class="underline"
        :style="{ color: 'var(--primary)' }"
        href="https://github.com/claudiabdm"
        rel="noopener"
        target="_blank"
      >claudiabdm</a>
      using <b>Nuxt.js</b> + <b>TailwindCSS</b>
    </div> -->
  </div>
</template>

<style lang="postcss" scoped>
p {
  @apply leading-normal;
}

.credit {
  @apply p-3 text-slate-700 text-center w-full text-xs/normal;
}

.cvWrapper {
  @media print {
    position: unset;
    margin: 0;
    padding: 0;

    & .cv {
      width: auto;
      height: auto;
      min-width: auto;
      min-height: var(--height);
      margin: 0;
      border: none;
      padding: 0;
      transform: none;
      box-shadow: none;
    }

    & .credit {
      display: none;
    }
  }
}

.cv {
  --height: 29.69cm;
  width: 21cm;
  min-width: 21cm;
  max-width: 21cm;
  min-height: var(--height);
  word-break: break-word;
  transform: scale(0.4);
  transform-origin: center top;

  @media screen and (min-width: 425px) {
    transform: scale(0.45);
  }

  @media screen and (min-width: 768px) {
    transform: scale(0.8);
  }

  @media screen and (min-width: 1024px) {
    transform: scale(0.7);
    transform-origin: top;
    min-width: 25cm;

  }

  &__pages {
    position: absolute;
    right: -5%;
    left: -5%;
    background-image: linear-gradient(to right,
        grey 50%,
        rgba(255, 255, 255, 0) 0%);
    background-size: 20px 1px;
    background-repeat: repeat-x;

    @media print {
      display: none;
    }
  }

  :deep(&__section-title) {
    @apply text-base uppercase mb-5 font-bold tracking-wide;

    &--sm {
      @apply text-sm/normal mb-0;
      text-transform: none;

    }

    &--main {
      color: #000;
      border-color: var(--primary);
    }
    &--icon-content{
      svg{
        @apply w-1 h-1;
      }
    }

  }

  :deep(&__icon-wrapper) {
    @apply flex font-light gap-1 items-center;

    a,
    span {
      margin-top: 2px;
    }
  }

  :deep(&__icon) {
    @apply fill-current rounded;
    width: 16px;
    height: 16px;
    min-width: 16px;
  }

  :deep(&__list) {
    font-weight: 300;
    list-style: inside;

    ::marker {
      color: var(--primary);
    }
  }

  :deep(&__event) {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
}

.blur {
  filter: blur(5px);
  min-height: var(--height);
}

@media print {
  nav {
    display: none;
  }
}
</style>
