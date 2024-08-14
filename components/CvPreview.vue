<script lang="ts" setup>
import { defineComponent } from 'vue'
import { LockClosedIcon, XMarkIcon } from '@heroicons/vue/24/solid'
import CvPreviewThreeColumn from './CvPreviewThreeColumn.vue'
import Modal from './common/Modal.vue'
import Input from './common/Input.vue'
import { useCvState } from '~/data/useCvState'

const props = defineProps<{
  color?: string
}>()

const showPassword = ref(false)
const { formSettings, isLoading } = useCvState()
const passwordInput = ref()
const password = ref('')
function sendPassword() {
  console.log('sendPassword')
  // showPassword.value = false
}
function openModalPassword() {
  showPassword.value = !showPassword.value
  nextTick(() => {
    if (passwordInput.value)
      passwordInput.value.focus()
  })
}
</script>

<template>
  <Modal v-if="showPassword" with-out-close @close="showPassword = false">
    <section class="bg-white relative p-10 max-w-xl m-auto rounded-lg">
      <button class="hiddem absolute right-3 top-3 focus:outline-none " @click="showPassword = false">
        <XMarkIcon class="w-6 text-gray-700" />
      </button>
      <div class="mb-6 text-center">
        <h2 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl ">
          {{ $t('addnewpasssmodal') }}
        </h2>
      </div>
      <div class="flex md:flex-row flex-col lg:gap-2 gap-4 items-center justify-center rtl:space-x-reverse">
        <!-- <input ref="passwordInput" type="password" class="form__control h-10 -mb-1 " @focus="true"> -->
        <Input
          id="password"
          v-model="password"
          name="password"
          type="password"
          class="md:w-1/2 w-full"
        />
        <button class="form__btn text-sm w-full md:w-auto " type="button" @click="sendPassword" v-text="$t('addnewpasss')" />
      </div>
    </section>
  </Modal>

  <div
    class="

    cvWrapper
    font-normal
    text-slate-800 text-sm/normal
    bg-white
    relative
    w-full
    overflow-y-auto
    overflow-x-hidden
    pt-0
    px-0
    p-6
    flex
    flex-col
    items-center
    "
  >
    <nav class="bg-white  z-[1] w-full top-0  border-gray-200 shadow-sm ">
      <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <div class="flex h-9 items-center gap-4 cursor-pointer text-gray-700 hover:text-gray-900">
          <div class="flex items-center gap-1" @click="openModalPassword">
            <LockClosedIcon class="w-3.5 h-3.5" />
            <p class="text-sm  " v-text="$t('addPassword')" />
          </div>
        </div>

        <div id="navbar-default" class="  block w-auto">
          <ul class="font-medium flex  rounded-lg  flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 ">
            <li>
              <a href="#" class="block px-3 text-gray-700 rounded md:bg-transparent  ">Login</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
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
