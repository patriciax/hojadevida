<script lang="ts" setup>
const CVFY_IMAGE = 'http://imgfz.com/i/rTZ5AEK.png'

const { locale, t } = useI18n()
const route = useRoute()
const localePath = useLocalePath()
const HREF = `https://hojadevida.digital${route.path}`

// const navLinks = [
//   { name: 'Home', to: '/' },
//   { name: 'About', to: 'about' },
// ]

useHead({
  htmlAttrs: {
    lang: locale,
  },
  title: t(String(route.meta.titleI18n)),
  meta: [
    {
      hid: 'description',
      name: 'description',
      content: t('description'),
    },
    {
      hid: 'author',
      name: 'author',
      content: 'claudiabdm',
    },
    {
      hid: 'og:image',
      property: 'og:image',
      content: CVFY_IMAGE,
    },
    {
      hid: 'og:author',
      property: 'og:author',
      content: 'Claudia Benito',
    },
    {
      hid: 'og:title',
      property: 'og:title',
      content: t('title-tag'),
    },
    {
      hid: 'og:description',
      property: 'og:description',
      content: t('description'),
    },
    {
      hid: 'twitter:creator',
      name: 'twitter:creator',
      content: '@claudiabdm',
    },
    {
      hid: 'twitter:title',
      name: 'twitter:title',
      content: t('title-tag'),
    },
    {
      hid: 'twitter:url',
      name: 'twitter:url',
      content: HREF,
    },
    {
      hid: 'twitter:description',
      name: 'twitter:description',
      content: t('description'),
    },
    {
      hid: 'twitter:card',
      name: 'twitter:card',
      content: 'summary_large_image',
    },
    {
      hid: 'twitter:image',
      name: 'twitter:image',
      content: CVFY_IMAGE,
    },
    {
      hid: 'twitter:image:alt',
      name: 'twitter:image:alt',
      content: t('description'),
    },
  ],
})
</script>

<template>
  <div class="font-landing max-w-screen-xl mx-auto text-fl-xs text-slate-800">
    <header class="p-fl-sm mb-fl-md">
      <nav
        class="font-light flex justify-between items-center"
      >
        <LandingLogo />
        <!-- Disable until more pages available -->
        <!-- <section
          class="[grid-area:links] justify-self-center flex gap-fl-lg underline sm:decoration-transparent"
        >
          <LandingLink
            v-for="link in navLinks"
            :key="link.name"
            :to="link.to"
          >
            {{ link.name }}
          </LandingLink>
        </section> -->
        <section class="flex gap-fl-xs">
          <LandingLangSwitch />
          <LandingLink
            :to="localePath('create')"
            cta
          >
            {{ $t('create-cv') }}
          </LandingLink>
        </section>
      </nav>
    </header>
    <main class="flex">
      <slot />
    </main>
  </div>
</template>
