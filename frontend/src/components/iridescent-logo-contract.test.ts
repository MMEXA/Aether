import { describe, expect, test } from 'vitest'
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { ref } from 'vue'
import { useLogoPosition } from '@/views/public/useSectionAnimations'
import { SECTIONS } from '@/views/public/home-config'

const frontendRoot = process.cwd()
const componentsRoot = resolve(frontendRoot, 'src/components')
const authRoot = resolve(frontendRoot, 'src/features/auth/components')
const publicRoot = resolve(frontendRoot, 'public')
const composablesRoot = resolve(frontendRoot, 'src/composables')
const publicViewsRoot = resolve(frontendRoot, 'src/views/public')
const readIfExists = (file: string) => (existsSync(file) ? readFileSync(file, 'utf-8') : '')

const indexHtml = readFileSync(resolve(frontendRoot, 'index.html'), 'utf-8')
const styleCss = readFileSync(resolve(frontendRoot, 'src/style.css'), 'utf-8')

const appConstants = readFileSync(resolve(frontendRoot, 'src/config/constants.ts'), 'utf-8')
const siteBrand = readIfExists(resolve(frontendRoot, 'src/config/siteBrand.ts'))
const rippleLogo = readFileSync(resolve(componentsRoot, 'RippleLogo.vue'), 'utf-8')
const iridescentLogo = readFileSync(resolve(componentsRoot, 'IridescentLogo.vue'), 'utf-8')
const headerLogo = readFileSync(resolve(componentsRoot, 'HeaderLogo.vue'), 'utf-8')
const useSiteInfo = readFileSync(resolve(composablesRoot, 'useSiteInfo.ts'), 'utf-8')
const homeView = readFileSync(resolve(frontendRoot, 'src/views/public/Home.vue'), 'utf-8')
const guideLayout = readFileSync(resolve(frontendRoot, 'src/views/public/guide/GuideLayout.vue'), 'utf-8')
const guideOverview = readFileSync(resolve(frontendRoot, 'src/views/public/guide/Overview.vue'), 'utf-8')
const guideOverviewMarkdown = readFileSync(resolve(frontendRoot, 'src/views/public/guide/content/overview.md'), 'utf-8')
const mainLayout = readFileSync(resolve(frontendRoot, 'src/layouts/MainLayout.vue'), 'utf-8')
const siteInfoSection = readFileSync(resolve(frontendRoot, 'src/views/admin/system-settings/SiteInfoSection.vue'), 'utf-8')
const systemConfig = readFileSync(resolve(frontendRoot, 'src/views/admin/system-settings/composables/useSystemConfig.ts'), 'utf-8')
const emailSettings = readFileSync(resolve(frontendRoot, 'src/views/admin/EmailSettings.vue'), 'utf-8')
const cliSectionView = readFileSync(resolve(publicViewsRoot, 'CliSection.vue'), 'utf-8')
const homeConfig = readFileSync(resolve(frontendRoot, 'src/views/public/home-config.ts'), 'utf-8')
const loginDialog = readFileSync(resolve(authRoot, 'LoginDialog.vue'), 'utf-8')
const registerDialog = readFileSync(resolve(authRoot, 'RegisterDialog.vue'), 'utf-8')
const useDarkModeSource = readFileSync(resolve(composablesRoot, 'useDarkMode.ts'), 'utf-8')
const deviceIdSource = readFileSync(resolve(frontendRoot, 'src/utils/deviceId.ts'), 'utf-8')

const staticAsset = resolve(publicRoot, 'assets/branding/iridescent/iridescent-static-cyan-adaptive.svg')
const animatedAsset = resolve(publicRoot, 'assets/branding/iridescent/iridescent-flow-cyan-adaptive.svg')
const staticSourceComponent = resolve(componentsRoot, 'IridescentStaticAssetLogo.vue')
const animatedSourceComponent = resolve(componentsRoot, 'IridescentAnimatedAssetLogo.vue')
const animatedAssetSource = readFileSync(animatedAsset, 'utf-8')

describe('upstream frontend sync contract', () => {
  test('latest upstream routing, referral, payment, and usage frontend modules are present', () => {
    const upstreamModules = [
      'src/api/referrals.ts',
      'src/api/routing-profiles.ts',
      'src/components/common/StripePaymentDialog.vue',
      'src/features/routing/index.ts',
      'src/features/routing/components/RoutingGroupEditor.vue',
      'src/features/routing/utils/routingPolicy.ts',
      'src/features/usage/utils/providerStats.ts',
      'src/views/admin/ReferralManagement.vue',
      'src/views/admin/RoutingProfiles.vue',
      'src/views/user/ReferralCenter.vue',
    ]

    const missingModules = upstreamModules.filter((modulePath) => !existsSync(resolve(frontendRoot, modulePath)))
    expect(missingModules).toEqual([])
  })

  test('latest upstream package surface includes Stripe checkout support', () => {
    const packageJson = readFileSync(resolve(frontendRoot, 'package.json'), 'utf-8')
    expect(packageJson).toContain('"@stripe/stripe-js": "^9.6.0"')
  })

  test('latest upstream admin health and S3 backup modules are present', () => {
    const upstreamModules = [
      'src/api/__tests__/users.spec.ts',
      'src/features/providers/components/ModelHealthMonitorCard.vue',
      'src/features/providers/components/ProviderHealthMonitorCard.vue',
      'src/views/admin/modules/S3BackupSettings.vue',
      'src/views/admin/modules/__tests__/useS3BackupConfig.spec.ts',
      'src/views/admin/modules/composables/useS3BackupConfig.ts',
    ]

    const missingModules = upstreamModules.filter((modulePath) => !existsSync(resolve(frontendRoot, modulePath)))
    expect(missingModules).toEqual([])
  })
})

describe('iridescent logo contract', () => {
  test('MMEXAB brand defaults stay local while runtime site text waits for public config', () => {
    expect(siteBrand).toContain("siteName: '虹之彼方'")
    expect(siteBrand).toContain("siteSubtitle: '即便踽然一人 面对无法跨越的长夜'")
    expect(indexHtml).toContain('<title>虹之彼方</title>')
    expect(appConstants).toContain('DEFAULT_SITE_INFO.siteName')
    expect(appConstants).toContain('DEFAULT_SITE_INFO.siteSubtitle')
    expect(useSiteInfo).toContain("const siteName = ref('')")
    expect(useSiteInfo).toContain("const siteSubtitle = ref('')")
    expect(useSiteInfo).toContain('siteInfoLoaded')
    expect(systemConfig).toContain('DEFAULT_SITE_INFO.siteName')
    expect(systemConfig).toContain('DEFAULT_SITE_INFO.siteSubtitle')
    expect(siteInfoSection).toContain(':placeholder="DEFAULT_SITE_INFO.siteName"')
    expect(siteInfoSection).toContain(':placeholder="DEFAULT_SITE_INFO.siteSubtitle"')
    expect(emailSettings).toContain('DEFAULT_SITE_INFO.siteName')
  })

  test('ripple logo must not degrade iridescent branch to 10 percent opaque static header logo', () => {
    expect(rippleLogo).not.toContain('opacity: 0.1;')
    expect(rippleLogo).not.toContain('<HeaderLogo size="w-full h-full" />')
  })

  test('ripple logo transition branches must form one v-if chain so the home page can compile', () => {
    expect(rippleLogo).toContain('v-if="type === \'iridescent\'"')
    expect(rippleLogo).toContain('v-else-if="type === \'aether\' && useAdaptive"')
    expect(rippleLogo).not.toContain('v-if="type === \'aether\' && useAdaptive"')
  })

  test('static and animated iridescent svg truth files must exist in the formal asset folder', () => {
    expect(existsSync(staticAsset)).toBe(true)
    expect(existsSync(animatedAsset)).toBe(true)
  })

  test('formal iridescent source components must consume the asset-folder svg truth files', () => {
    const joined = [readIfExists(staticSourceComponent), readIfExists(animatedSourceComponent)].join('\n')
    expect(siteBrand).toContain('/assets/branding/iridescent/iridescent-static-cyan-adaptive.svg')
    expect(siteBrand).toContain('/assets/branding/iridescent/iridescent-flow-cyan-adaptive.svg')
    expect(joined).toContain('IRIDESCENT_LOGO_ASSETS.staticSrc')
    expect(joined).toContain('IRIDESCENT_LOGO_ASSETS.animatedSrc')
  })

  test('svg object logos keep a same-asset fallback and parent-controlled animation state', () => {
    const joined = [readIfExists(staticSourceComponent), readIfExists(animatedSourceComponent)].join('\n')
    const animatedSource = readIfExists(animatedSourceComponent)

    expect(joined).toContain('iridescent-asset-fallback')
    expect(joined).toContain(':src="src"')
    expect(joined).not.toContain('/aether_adaptive.svg')
    expect(animatedSource).toContain('@click="toggleMottled"')
    expect(animatedSource).toContain('contentDocument')
    expect(animatedSource).toContain('dataset.mottled')
    expect(animatedSource).toMatch(/\.iridescent-asset-object\s*\{[\s\S]*pointer-events:\s*none;/m)
    expect(animatedAssetSource).toContain(':root[data-theme="light"]')
    expect(animatedAssetSource).toContain(':root[data-theme="dark"]')
    expect(animatedAssetSource).toContain(':root[data-mottled="on"] .erosion-anim')
  })

  test('legacy root svg file references must be removed from runtime logo entry points', () => {
    const joined = [rippleLogo, iridescentLogo, headerLogo, loginDialog, registerDialog].join('\n')
    expect(joined).not.toContain('/iridescent_adaptive.svg')
  })

  test('page favicon must point to the formal iridescent asset instead of the legacy root svg entry', () => {
    expect(indexHtml).toContain('/assets/branding/iridescent/iridescent-static-cyan-adaptive.svg')
    expect(indexHtml).not.toContain('/aether_adaptive.svg')
  })

  test('serif runtime truth keeps LXGW WenKai scoped to the landing page', () => {
    expect(styleCss).toContain("font-family: 'LXGWWenKai';")
    expect(styleCss).toContain("font-family: 'TiemposText';")
    expect(styleCss).toContain("--serif: 'TiemposText'")
    expect(styleCss).not.toContain("--serif: 'LXGWWenKai'")
    expect(indexHtml).not.toContain('/fonts/LXGWWenKai/')
    expect(indexHtml).toContain('/fonts/TiemposText/TiemposText-Regular.woff2')
    expect(indexHtml).toContain('/fonts/TiemposText/TiemposText-Medium.woff2')
    expect(homeView).toContain('class="landing-page relative h-screen')
    expect(homeView).toContain("--serif: 'LXGWWenKai'")
  })

  test('cli section titles must stay on the original sans family instead of inheriting the global serif runtime', () => {
    expect(cliSectionView).toContain('class="cli-section-title text-4xl md:text-5xl font-bold text-[#191919] dark:text-white mb-6 transition-all duration-700"')
    expect(cliSectionView).toContain('.cli-section-title {')
    expect(cliSectionView).toContain('font-family: var(--sans-serif) !important;')
    expect(homeView).toContain('title="Claude Code"')
    expect(homeView).toContain('title="Codex CLI"')
    expect(homeView).toContain('title="Gemini CLI"')
  })

  test('static asset logo shell must not override caller sizing classes with forced 100 percent width and height', () => {
    const staticSource = readIfExists(staticSourceComponent)
    const shellStyleMatch = staticSource.match(/\.iridescent-asset-shell\s*\{([\s\S]*?)\}/m)
    expect(shellStyleMatch?.[1] || '').not.toContain('width: 100%')
    expect(shellStyleMatch?.[1] || '').not.toContain('height: 100%')
  })

  test('home page features section must keep a dedicated exception hook for enlarged translucent static logo only there', () => {
    expect(homeView).toMatch(/currentSection === SECTIONS\.FEATURES/)
    expect(homeView).toMatch(/\.landing-feature-static-logo\s*\{[\s\S]*opacity:\s*0\.28;[\s\S]*transform:\s*scale\(2\);/m)
    expect(homeView).toContain('fixed-logo-layer-under-content')
  })

  test('home hero title must stay a single branded line and must not introduce an artificial divider rod rig', () => {
    expect(homeView).not.toContain('style="margin-right: -0.12em;"')
    expect(homeView).not.toContain('home-hero-title-shell')
    expect(homeView).not.toContain('home-hero-title-lockup')
    expect(homeView).not.toContain('home-hero-title-center-anchor')
    expect(homeView).not.toContain('home-hero-title-divider-line')
    expect(homeView).not.toContain('title-part-divider')
    expect(homeView).toMatch(/<span[\s\S]*class="scifi-brand-v4 scifi-title-lockup whitespace-nowrap"[\s\S]*>\s*天網機房 霧霜基建\s*<\/span>/m)
  })

  test('home and features copy must stay on the new narrative wording and icon set', () => {
    expect(homeView).toContain('来自旧世界的虹云集群')
    expect(homeView).toContain('闪烁着未熄的流光 将勇气与智慧 赋予新世界的孩子们')
    expect(homeView).toContain('Claude Code 是一个由 AI 驱动的编码助手，可帮助你构建功能、修复错误和自动化开发任务。它理解你的整个代码库，可以跨多个文件和工具工作以完成任务。')
    expect(homeView).not.toContain('直接在您的终端中释放Claude的原始力量。瞬间搜索百万行代码库。将数小时的流程转化为单一命令。您的工具。您的流程。您的代码库，以思维速度进化。')
    expect(homeView).not.toContain('您的代码库，以思维速度进化。')
    expect(homeView).not.toContain('您的代码库,以思维速度进化。')
    expect(homeView).toContain('RectangleGoggles')
    expect(homeView).toContain('出击就绪')
    expect(homeView).toContain('接入完成')
    expect(homeView).toContain('核心 API 已就绪 可执行接续')
    expect(homeView).toContain('Radiation')
    expect(homeConfig).toContain("title: '各家标准接口'")
    expect(homeConfig).not.toContain("title: 'Claude / OpenAI / Gemini'")
    expect(homeConfig).toContain("desc: '已完整接入标准 API'")
    expect(homeConfig).toContain("icon: Satellite")
    expect(homeConfig).toContain("title: '虹云接管'")
    expect(homeConfig).toContain("desc: '危机时刻 召唤那旧世界的末日'")
  })

  test('home iridescent stage and features exception stage must not be faded by the shared fixed logo container opacity', () => {
    const desktopWidth = ref(1440)

    const homePosition = useLogoPosition(ref(SECTIONS.HOME), desktopWidth)
    expect(homePosition.fixedLogoStyle.value.opacity).toBe(1)
    expect(homePosition.fixedLogoStyle.value.transform).toContain('translateX(-9px)')

    const featuresPosition = useLogoPosition(ref(SECTIONS.FEATURES), desktopWidth)
    expect(featuresPosition.fixedLogoStyle.value.opacity).toBe(1)
    expect(featuresPosition.fixedLogoStyle.value.transform).toContain('translateX(-9px)')
  })

  test('public top navigation must keep iridescent removal of upstream docs and GitHub shortcuts', () => {
    const homeHeader = homeView.match(/<!-- Header -->[\s\S]*?<\/header>/m)?.[0] ?? ''

    expect(homeHeader).not.toContain('to="/guide"')
    expect(homeHeader).not.toContain('文档')
    expect(homeHeader).not.toContain('href="https://github.com/fawney19/Aether"')
    expect(homeHeader).not.toContain('GithubIcon')
    expect(guideLayout).not.toContain('href="https://github.com/fawney19/Aether"')
    expect(guideLayout).not.toContain('GithubIcon')
    expect(guideOverview).not.toContain('GitHub 仓库')
    expect(guideOverview).not.toContain('https://github.com/fawney19/Aether/tree/main/aether-tunnel')
    expect(guideOverviewMarkdown).not.toContain('https://github.com/fawney19/Aether/tree/main/aether-tunnel')
    expect(mainLayout).not.toContain('href="https://github.com/fawney19/Aether"')
    expect(mainLayout).not.toContain('title="GitHub 仓库"')
    expect(mainLayout).not.toContain('<GithubIcon')
  })

  test('theme runtime must explicitly sync document colorScheme for embedded iridescent svg objects', () => {
    expect(useDarkModeSource).toMatch(/document\.documentElement\.style\.colorScheme\s*=/)
  })

  test('client device id storage must use iridescent key while migrating the legacy aether key', () => {
    expect(deviceIdSource).toContain("IRIDESCENT_DEVICE_ID_KEY = 'iridescent_client_device_id'")
    expect(deviceIdSource).toContain("LEGACY_DEVICE_ID_KEY = 'aether_client_device_id'")
    expect(deviceIdSource).toContain('localStorage.removeItem(LEGACY_DEVICE_ID_KEY)')
    expect(deviceIdSource).not.toContain("const DEVICE_ID_KEY = 'aether_client_device_id'")
  })

  test('features cards must use a unified centered vertical stack so icon title copy and status no longer scatter', () => {
    expect(homeView).toContain('grid md:grid-cols-3 gap-3 md:gap-6 items-stretch')
    expect(homeView).toContain('group h-full bg-white/90 dark:bg-[#262624]/80 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-6 border transition-all duration-700 flex flex-col items-center text-center')
    expect(homeView).toContain('mt-auto inline-flex items-center justify-center')
    expect(homeView).toContain('feature-copy-divider')
    expect(homeView).toContain('feature-copy-divider-line')
    expect(homeView).toMatch(/<div class="feature-copy-divider" aria-hidden="true">\s*<span class="feature-copy-divider-line"\s*\/>\s*<\/div>\s*<p class="w-full flex-1 min-h-\[3\.5rem\] md:min-h-\[4\.5rem\] text-center text-xs md:text-sm leading-relaxed text-\[#666663\] dark:text-\[#c9c3b4\]">/m)
    expect(homeView).toMatch(/\.feature-copy-divider-line\s*\{[\s\S]*width:\s*25%;/m)
    expect(homeView).toContain('w-full flex-1 min-h-[3.5rem] md:min-h-[4.5rem] text-center text-xs md:text-sm leading-relaxed text-[#666663] dark:text-[#c9c3b4]')
    expect(homeView).not.toContain('w-full flex-1 min-h-[3.5rem] md:min-h-[4.5rem] flex items-center justify-center text-center text-xs md:text-sm leading-relaxed text-[#666663] dark:text-[#c9c3b4]')
  })
})
