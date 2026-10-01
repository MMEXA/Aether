import { readonly, ref, watch } from 'vue'
import apiClient from '@/api/client'
import { DEFAULT_SITE_INFO, normalizeSiteInfoValue } from '@/config/siteBrand'

interface SiteInfo {
  site_name: string
  site_subtitle: string
}

// 模块级缓存，所有组件共享同一份数据
const siteName = ref('')
const siteSubtitle = ref('')
const loaded = ref(false)
let fetchPromise: Promise<void> | null = null

function applySiteInfo(data: Partial<SiteInfo> | null | undefined): void {
  siteName.value = normalizeSiteInfoValue('siteName', data?.site_name ?? '')
  siteSubtitle.value = normalizeSiteInfoValue('siteSubtitle', data?.site_subtitle ?? '')
}

async function fetchSiteInfo() {
  try {
    const response = await apiClient.get<SiteInfo>('/api/public/site-info')
    applySiteInfo(response.data)
  } catch {
    // 请求失败后才使用 MMEXAB 默认站点信息，避免配置加载前暴露默认品牌文案。
    if (!siteName.value || !siteSubtitle.value) {
      applySiteInfo({
        site_name: DEFAULT_SITE_INFO.siteName,
        site_subtitle: DEFAULT_SITE_INFO.siteSubtitle,
      })
    }
    fetchPromise = null
  } finally {
    loaded.value = true
  }
}

async function refreshSiteInfo() {
  fetchPromise = null
  loaded.value = false
  fetchPromise = fetchSiteInfo()
  await fetchPromise
}

export function useSiteInfo() {
  if (!loaded.value && !fetchPromise) {
    fetchPromise = fetchSiteInfo()
  }
  return { siteName, siteSubtitle, siteInfoLoaded: readonly(loaded), refreshSiteInfo }
}

// 站点名称变化时同步更新 document.title
watch(siteName, (name) => {
  if (name) {
    document.title = name
  }
}, { immediate: true })
