<script lang="ts" setup>
import Login from '~/components/common/Login.vue'

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
    <Login />
  </section>
</template>
