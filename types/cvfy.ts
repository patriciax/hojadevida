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
  firma?: string
  jobTitle: string
  company: string
  profile: string
  carta: string
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
  tiktok: string
  youtube: string
  website: string
  education: CvEvent[]
  work: CvEvent[]
  projects: CvEvent[]
  references: CvEventReference[]
  soportes: CvEventSoportes[]
  displaySocial: boolean
  displayEducation: boolean
  displayProjects: boolean
  displayWork: boolean
  displayReferences: boolean
  displaySoportes: boolean
  activeColor: string
  font: string
  country: object
  city: object
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

export interface CvEventSoportes {
  id: string
  nameref: string
  cargo: string
  current: boolean
  tel: string
  email: string
  company: string
}

export type OptionalSection = 'displaySocial' | 'displayEducation' | 'displayProjects' | 'displayWork' | 'displayReferences' | 'displaySoportes'

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
  soportes: 'soportes',
} as const
export type SectionName = keyof typeof SectionNameList
