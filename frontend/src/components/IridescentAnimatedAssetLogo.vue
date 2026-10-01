<template>
  <div
    class="iridescent-asset-shell"
    :class="containerClass"
    role="img"
    :aria-label="label"
    @click="toggleMottled"
  >
    <object
      ref="objectEl"
      :key="objectKey"
      class="iridescent-asset-object"
      :class="objectClass"
      type="image/svg+xml"
      :data="objectData"
      tabindex="-1"
      aria-hidden="true"
      @load="syncObjectState"
    >
      <img
        class="iridescent-asset-fallback"
        :src="src"
        alt=""
        aria-hidden="true"
        draggable="false"
      >
    </object>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { useDarkMode } from '@/composables/useDarkMode'
import { DEFAULT_SITE_INFO, IRIDESCENT_LOGO_ASSETS } from '@/config/siteBrand'

interface Props {
  src?: string
  containerClass?: string
  objectClass?: string
  label?: string
}

const props = withDefaults(defineProps<Props>(), {
  src: IRIDESCENT_LOGO_ASSETS.animatedSrc,
  containerClass: '',
  objectClass: '',
  label: `${DEFAULT_SITE_INFO.siteName} logo`
})

const { isDark } = useDarkMode()
const renderNonce = ref(0)
const isMottled = ref(false)
const objectEl = ref<HTMLObjectElement | null>(null)

const replay = () => {
  renderNonce.value += 1
}

const themeToken = computed(() => (isDark.value ? 'dark' : 'light'))
const src = computed(() => props.src)
const objectKey = computed(() => `${src.value}-${themeToken.value}-${renderNonce.value}`)
const objectData = computed(() => `${src.value}?theme=${themeToken.value}&v=${renderNonce.value}`)

function syncObjectState() {
  const svgRoot = objectEl.value?.contentDocument?.documentElement
  if (!svgRoot) {
    return
  }

  svgRoot.dataset.theme = themeToken.value
  svgRoot.dataset.mottled = isMottled.value ? 'on' : 'off'
}

function toggleMottled() {
  isMottled.value = !isMottled.value
  syncObjectState()
}

watch(isDark, () => {
  replay()
  void nextTick(syncObjectState)
})

watch(isMottled, () => {
  syncObjectState()
})

defineExpose({
  replay
})
</script>

<style scoped>
.iridescent-asset-shell {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: auto;
  cursor: pointer;
}

.iridescent-asset-fallback {
  display: block;
  width: 100%;
  height: 100%;
  border: 0;
  object-fit: contain;
  pointer-events: none;
}

.iridescent-asset-object {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: 0;
  pointer-events: none;
}
</style>
