import { reactive, toRefs } from 'vue'
import {
  cvSettingTemplate,
  cvSettingsEmptyTemplate,
} from './example-cv-settings'
import useResumenStore from '@/stores/resumen'

import {
  type Cv,
  type CvEvent,
  type CvEventReference,
  type CvEventSoportes,
  type DefaultSkill,
  type LanguagesSkill,
  type SectionName,
  SectionNameList,
} from '~/types/cvfy'

const state = reactive({
  formSettings: {} as Cv,
  isLoading: true,
  isProfilePhotoLoading: false,
})

export function useCvState() {
  const resumenStore = useResumenStore()

  const i18n = useI18n()
  async function setUpCvSettings(): Promise<void> {
    const locale = `cvSettings-${i18n.locale.value}`
    state.formSettings = { ...cvSettingTemplate }

    if (resumenStore.formSettings && Object.keys(resumenStore.formSettings).length > 0) {
      for (const key in resumenStore.formSettings) {
        if (resumenStore.formSettings[key] !== undefined)
          state.formSettings[key] = resumenStore.formSettings[key]
      }
    }
    localStorage.setItem(locale, JSON.stringify(state.formSettings))
    state.isLoading = false
  }
  // async function setUpCvSettings(): Promise<void> {
  //   const locale = `cvSettings-${i18n.locale.value}`

  //   // Verifica si hay datos en resumenStore.formSettings
  //   if (resumenStore.formSettings && Object.keys(resumenStore.formSettings).length > 0) {
  //     state.formSettings = {
  //       ...cvSettingsEmptyTemplate,
  //       ...resumenStore.formSettings,
  //     }
  //     localStorage.setItem(locale, JSON.stringify(state.formSettings))
  //   }
  //   else {
  //     const cvSettings = localStorage.getItem(locale)
  //     if (cvSettings == null) {
  //       state.formSettings = {
  //         ...cvSettingTemplate,
  //       }
  //     }
  //     else {
  //       const cvSettingsObj = JSON.parse(cvSettings)
  //       state.formSettings = { ...cvSettingsEmptyTemplate, ...cvSettingsObj }
  //       patchId(state.formSettings)
  //     }
  //   }

  //   state.isLoading = false
  // }
  // function setUpCvSettings(): void {
  //   const locale = `cvSettings-${i18n.locale.value}`
  //   const cvSettings = localStorage.getItem(locale)

  //   if (cvSettings == null) {
  //     state.formSettings = {
  //       ...cvSettingTemplate,
  //     }
  //   }
  //   else {
  //     const cvSettingsObj = JSON.parse(cvSettings)
  //     state.formSettings = { ...cvSettingsEmptyTemplate, ...cvSettingsObj }
  //     patchId(state.formSettings)
  //   }
  //   localStorage.setItem(locale, JSON.stringify(state.formSettings))
  //   state.isLoading = false
  // }

  function addSkill<T extends LanguagesSkill | DefaultSkill>(e: T): void {
    if (e.skillType === 'languages') {
      if (e.skill.lang.trim() === '')
        return
      const newLang = e.skill
      const newLangIdx = state.formSettings.languages.findIndex(
        lang => lang.lang === newLang.lang,
      )
      if (newLangIdx < 0) {
        state.formSettings.languages = [
          ...new Set([
            ...state.formSettings.languages,
            { lang: e.skill.lang, level: e.skill.level },
          ]),
        ]
      }
    }
    else {
      if (e.skill.trim() === '')
        return
      state.formSettings[e.skillType] = [
        ...new Set([...state.formSettings[e.skillType], e.skill]),
      ]
    }
  }

  function removeSkill<T extends LanguagesSkill | DefaultSkill>(e: T): void {
    if (e.skillType === 'languages') {
      state.formSettings[e.skillType] = [
        ...state.formSettings[e.skillType].filter(
          skill => skill.lang !== e.skill.lang,
        ),
      ]
    }
    else {
      state.formSettings[e.skillType] = [
        ...state.formSettings[e.skillType].filter(skill => skill !== e.skill),
      ]
    }
  }

  function addEntry(e: { sectionName: SectionName }) {
    state.formSettings[e.sectionName].unshift({
      id: crypto.randomUUID(),
      title: '',
      location: '',
      from: new Date(),
      to: new Date(),
      current: false,
      summary: '',
    })
  }

  function addEntryReference(e: { sectionName: 'references' }) {
    state.formSettings[e.sectionName].unshift({
      id: crypto.randomUUID(),
      nameref: '',
      cargo: '',
      current: false,
      company: '',
      tel: '',
      email: '',
    } as CvEventReference)
  }
  function addEntrySoportes(e: { sectionName: 'soportes' }) {
    state.formSettings[e.sectionName].unshift({
      id: crypto.randomUUID(),
      nameref: '',
      cargo: '',
      current: false,
      company: '',
      tel: '',
      email: '',

    } as CvEventSoportes)
  }

  function removeEntry(e: { sectionName: SectionName, entry: CvEvent }) {
    state.formSettings[e.sectionName] = state.formSettings[
      e.sectionName
    ].filter(entry => entry.id !== e.entry.id)
  }

  function uploadCV(e: any): void {
    const fr = new FileReader()
    fr.onload = (e: any) => {
      const data = JSON.parse(e.target.result)
      state.formSettings = {
        ...cvSettingsEmptyTemplate,
        ...data.formSettings,
      }
      patchId(state.formSettings)
    }
    fr.readAsText(e.target.files[0])
  }

  function resetForm(): void {
    state.formSettings = {
      ...cvSettingTemplate,
    }
    localStorage.setItem(
      `cvSettings-${i18n.locale.value}`,
      JSON.stringify(state.formSettings),
    )
  }

  function clearForm(): void {
    state.formSettings = cvSettingsEmptyTemplate
    // localStorage.removeItem(`cvSettings-${i18n.locale.value}`)
  }
  function myForm() {
    const locale = `cvSettingsMyData-${i18n.locale.value}`
    const storedSettings = localStorage.getItem(locale)

    if (storedSettings) {
      const cvSettingsObj = JSON.parse(storedSettings)
      state.formSettings = { ...cvSettingsEmptyTemplate, ...cvSettingsObj }
      patchId(state.formSettings)
    }
    else {
      state.formSettings = { ...cvSettingTemplate }
    }
  }
  function changeDisplaySection(e: {
    sectionName: string
    status: boolean
  }): void {
    const propName = `display${e.sectionName
      .slice(0, 1)
      .toUpperCase()}${e.sectionName.slice(1)}` as
      | 'displayEducation'
      | 'displayProjects'
      | 'displayJobSkills'
      | 'displaySoftSkills'
      | 'displayLanguages'
      | 'displayWork'
      | 'displayReferences'
      | 'displaySoportes'
    state.formSettings[propName] = e.status
  }

  function patchId(formSettings: Cv) {
    // Make sure that older cvs have id in each entry of a section
    for (const key in SectionNameList) {
      const section = key as SectionName
      for (const e of formSettings[section]) {
        if (!e.id)
          e.id = crypto.randomUUID()
      }
    }
  }

  return {
    ...toRefs(state),
    setUpCvSettings,
    addSkill,
    removeSkill,
    addEntry,
    removeEntry,
    uploadCV,
    resetForm,
    myForm,
    clearForm,
    changeDisplaySection,
    addEntryReference,
    addEntrySoportes,
  }
}
