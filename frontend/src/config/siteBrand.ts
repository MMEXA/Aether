export const DEFAULT_SITE_INFO = {
  siteName: '虹之彼方',
  siteSubtitle: '即便踽然一人 面对无法跨越的长夜',
} as const

export const IRIDESCENT_LOGO_ASSETS = {
  staticSrc: '/assets/branding/iridescent/iridescent-static-cyan-adaptive.svg',
  animatedSrc: '/assets/branding/iridescent/iridescent-flow-cyan-adaptive.svg',
} as const

type SiteInfoField = keyof typeof DEFAULT_SITE_INFO

export function normalizeSiteInfoValue(field: SiteInfoField, value: string): string {
  const trimmedValue = value.trim()
  if (!trimmedValue) {
    return DEFAULT_SITE_INFO[field]
  }

  return trimmedValue
}
