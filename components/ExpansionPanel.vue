<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ExpansionPanel',
  props: {
    panelName: {
      type: String,
      default: () => '',
    },
    disabled: {
      type: Boolean,
      default: () => false,
    },
  },
  data() {
    return {
      isOpen: false,
    }
  },
  methods: {
    togglePanel() {
      if (this.disabled)
        return
      this.isOpen = !this.isOpen
    },
    enter(element: Element) {
      const el = element as HTMLElement
      el.style.height = 'auto'
      const height = getComputedStyle(element).height
      el.style.height = '0'
      // eslint-disable-next-line no-unused-expressions
      getComputedStyle(element).height
      requestAnimationFrame(() => {
        el.style.height = height
      })
    },
    afterEnter(element: Element) {
      const el = element as HTMLElement
      el.style.height = 'auto'
    },
    leave(element: Element) {
      const el = element as HTMLElement
      const height = getComputedStyle(element).height
      el.style.height = height
      // eslint-disable-next-line no-unused-expressions
      getComputedStyle(element).height
      requestAnimationFrame(() => {
        el.style.height = '0'
      })
    },
  },
})
</script>

<template>
  <div class="expansion-panel ">
    <div

      class="expansion-panel__header"
      @click.prevent="togglePanel"
    >
      <div class="expansion-panel__title">
        <div class="flex gap-2 items-center" :class="disabled ? 'text-gray-500' : ''">
          <slot name="icon" />
          <slot name="title">
            Título
          </slot>
        </div>
        <button
          :id="`expansionPanel${panelName}`"
          type="button"
          :aria-label="`Expansion panel ${panelName}`"
          :aria-expanded="`${isOpen}`"
          :aria-controls="panelName"
          @click.stop="togglePanel"
        >
          <svg

            class="expansion-panel__arrow" :class="[
              { 'expansion-panel__arrow--open': isOpen },
            ]"
          >
            <use href="@/assets/sprite.svg#panel-arrow" />
          </svg>
        </button>
      </div>
      <slot name="action-button" />
    </div>
    <transition
      name="expand"
      @enter="enter"
      @after-enter="afterEnter"
      @leave="leave"
    >
      <slot
        v-if="isOpen"
        :id="panelName"
        class="expansion-panel__panel"
        name="content"
        role="region"
        :aria-labelledby="`expansionPanel${panelName}`"
      >
        Contenido
      </slot>
    </transition>
  </div>
</template>

<style lang="postcss" scoped>
* {
  will-change: height;
  transform: translateZ(0);
  backface-visibility: hidden;
  perspective: 1000px;
}

.expansion-panel {
  overflow: hidden;
  @apply  bg-opacity-100 relative px-6 py-3 border-b border-gray-200;

  & & {
    @apply p-1;
  }

  &__header {
    @apply flex items-center justify-between w-full flex-row-reverse ;
  }

  &__title {
    @apply flex items-center justify-between w-full  bg-opacity-100 z-10 capitalize;

    &:hover {
      cursor: pointer;
    }
  }

  &__panel {
    @apply z-0;
  }

  &__arrow {
    width: 1.25rem;
    height: 1.25rem;
    transform: rotate(0);
    transition: transform 0.25s ease-in-out;

    &--open {
      transform: rotate(180deg);
    }
  }
}

.expand-enter-active,
.expand-leave-active {
  transition:
    height 0.35s ease-in-out,
    opacity 0.35s ease-in-out;
  overflow: hidden;
}

.expand-enter,
.expand-leave-to {
  height: 0;
  opacity: 0;
}
.expansion-panel__header{
  flex-direction: initial!important;
  gap: 10px!important;
}

.form__legend{
  font-size: 14px!important;
}
</style>
