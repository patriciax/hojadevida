<script lang="ts" setup>
import { ChartBarIcon, LanguageIcon, LightBulbIcon, StarIcon, UserIcon } from '@heroicons/vue/24/solid'
import { useCvState } from '~/data/useCvState'

const { formSettings } = useCvState()
</script>

<template>
  <section class="cv__section">
    <h4
      class="cv__section-title"
      :class="formSettings.layout === 'one-column' ? 'cv__section-title--main ' : 'sr-only'"
    >
      <span :class="{ 'flex gap-2': formSettings.layout === 'one-column' }">
        <div v-if="formSettings.layout === 'one-column'" class="bg-change rounded-full  w-6 h-6 flex justify-center items-center">
          <ChartBarIcon class="icon-style" />
        </div>
        {{ $t("skills") }}
      </span>
      <span
        v-if="formSettings.displayInterests && formSettings.layout !== 'one-column'"
        class="slash"
      >/</span>
      <span v-if="formSettings.displayInterests && formSettings.layout !== 'one-column'">
        {{ $t("interests") }}
      </span>
    </h4>
    <CvPreviewSkill
      :skill-name="$t('technical-skills')"
      :display="formSettings.displayJobSkills"
      :skills="formSettings.jobSkills"
      :with-tags="true"
    >
      <template #icon>
        <div class="bg-change rounded-full  w-6 h-6 flex justify-center items-center">
          <ChartBarIcon class="icon-style" />
        </div>
      </template>
    </CvPreviewSkill>
    <div v-if="formSettings.layout === 'two-column' || formSettings.layout === 'three-column' || formSettings.layout === 'four-column'" class="border-dashed border-b border-var-color mt-3 mb-2" />

    <CvPreviewSkill
      :skill-name="$t('soft-skills')"
      :display="formSettings.displaySoftSkills"
      :skills="formSettings.softSkills"
    >
      <template #icon>
        <div class="bg-change rounded-full  w-6 h-6 flex justify-center items-center">
          <UserIcon class="icon-style" />
        </div>
      </template>
    </CvPreviewSkill>
    <section
      v-if="formSettings.displayLanguages"
      class="cv__section"
      :class="formSettings.layout === 'one-column' && 'flex gap-1 mb-1'"
    >
      <h3
        class="capitalize"
        :class="formSettings.layout === 'one-column' ? 'two-dots inline flex-shrink-0' : 'cv__section-title flex gap-2'"
      >
        <div v-if="formSettings.layout === 'two-column' || formSettings.layout === 'three-column' || formSettings.layout === 'four-column'" class="bg-change rounded-full  w-6 h-6 flex justify-center items-center">
          <LanguageIcon class="icon-style" />
        </div>
        {{ $t("languages") }}
      </h3>

      <ul :class="formSettings.layout === 'one-column' && 'flex flex-wrap break-words'">
        <li
          v-for="lang in formSettings.languages"
          :key="`preview${lang.lang}`"
          :class="formSettings.layout === 'one-column' ? 'comma' : 'flex justify-between pr-4'"
        >
          <span :class="formSettings.layout === 'one-column' && 'font-light'">
            {{ lang.lang }}
          </span>
          <span class="font-light">
            <template v-if="formSettings.layout === 'one-column'"> (</template>{{
              $t(lang.level)
            }}<template v-if="formSettings.layout === 'one-column'">)</template>
          </span>
        </li>
      </ul>
    </section>
    <CvPreviewSkill
      :skill-name="$t('interests')"
      :display="formSettings.displayInterests"
      :skills="formSettings.interests"
    >
      <template #icon>
        <div class="bg-change rounded-full  w-6 h-6 flex justify-center items-center">
          <StarIcon class="icon-style" />
        </div>
      </template>
    </CvPreviewSkill>
  </section>
</template>

<style class="postcss" scoped>
:deep(.comma) {
  white-space: preserve;
}

:deep(ul) :not(li:last-child).comma::after {
  content: ', ';
}

:deep(.two-dots) {

  &::after {
    content: ': ';
  }
}

.slash {
  flex-shrink: 0;
  white-space: preserve;

  &::before {
    content: ' ';
  }

  &::after {
    content: ' ';
  }
}
.border-var-color{
  border-color: var(--primary);
}
</style>
