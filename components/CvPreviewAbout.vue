<script lang="ts" setup>
import { UserIcon } from '@heroicons/vue/24/solid'
import { useCvState } from '~/data/useCvState'

const { formSettings } = useCvState()
</script>

<template>
  <section class="cv__section cv__section--main">
    <h4
      class="cv__section-title cv__section-title--main border-b flex items-center gap-2 pb-1"
      :class="formSettings.layout === 'one-column' && 'sr-only'"
    >
      <div class="bg-change rounded-full  w-6 h-6 flex justify-center items-center">
        <UserIcon class="icon-style" />
      </div>
      {{ $t("about-me") }}
    </h4>
    <p class="font-light">
      <!-- Avoids unnecessary spaces at the begging while still allowing break lines -->
      <span class="whitespace-pre-wrap">{{ formSettings.aboutme }}</span>
    </p>
  </section>
</template>

<style>
.bg-change {
  background: var(--primary);
svg {
  color: #fff;
}
}
</style>
