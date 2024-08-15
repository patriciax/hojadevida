<script lang="ts" setup>
import Register from '~/components/common/Register.vue'

const { t, locale } = useI18n()

useHead({
  htmlAttrs: {
    lang: locale,
  },
  title: t('title-tag'),

})
</script>

<template>
  <section>
    <Register />
  </section>
</template>
