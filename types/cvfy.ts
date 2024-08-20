export const LEVELS = [
  'elementary',
  'limited-working',
  'professional-working',
  'full-professional',
  'native-bilingual',
] as const

export type Level = (typeof LEVELS)[number]
export interface Cv {
  layout?: 'one-column' | 'two-column'
  profileImageDataUri?: string | null
  jobTitle: string
  name: string
  lastName: string
  email: string
  location: string
  phoneNumber: string
  aboutme: string
  jobSkills: string[]
  displayJobSkills?: boolean
  softSkills: string[]
  displaySoftSkills?: boolean
  languages: { lang: string, level: Level }[]
  displayLanguages?: boolean
  interests: string[]
  displayInterests?: boolean

  linkedin: string
  twitter: string
  github: string
  instagram: string
  facebook: string
  website: string
  education: CvEvent[]
  work: CvEvent[]
  projects: CvEvent[]
  references: CvEventReference[]
  displaySocial: boolean
  displayEducation: boolean
  displayProjects: boolean
  displayWork: boolean
  displayReferences: boolean
  activeColor: string
  font: string
  country: string
  city: string
}
export interface CvEvent {
  id: string
  title: string
  location: string
  from: Date | any
  to: Date | any
  current: boolean
  summary: string
}
export interface CvEventReference {
  id: string
  nameref: string
  cargo: string
  current: boolean
  tel: string
  email: string
  company: string
}

export type OptionalSection = 'displaySocial' | 'displayEducation' | 'displayProjects' | 'displayWork' | 'displayReferences'

export type SkillType =
  'jobSkills' |
  'softSkills' |
  'languages' |
  'interests'

export interface LanguagesSkill {
  skill: { lang: string, level: Level }
  skillType: 'languages'
}
export interface DefaultSkill {
  skill: string
  skillType: Exclude<SkillType, 'languages'>
}

export type Skill = DefaultSkill['skill'] | LanguagesSkill['skill']

export const SectionNameList = {
  work: 'work',
  education: 'education',
  projects: 'projects',
  references: 'references',
} as const
export type SectionName = keyof typeof SectionNameList
