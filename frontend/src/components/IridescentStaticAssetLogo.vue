<template>
  <div
    class="iridescent-asset-shell"
    :class="containerClass"
    role="img"
    :aria-label="label"
  >
    <img
      class="iridescent-asset-fallback"
      :class="objectClass"
      :src="src"
      alt=""
      aria-hidden="true"
      draggable="false"
    >
    <object
      :key="objectKey"
      class="iridescent-asset-object"
      :class="objectClass"
      type="image/svg+xml"
      :data="objectData"
      tabindex="-1"
      aria-hidden="true"
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
import { computed, ref, watch } from 'vue'
import { useDarkMode } from '@/composables/useDarkMode'
import { DEFAULT_SITE_INFO, IRIDESCENT_LOGO_ASSETS } from '@/config/siteBrand'

interface Props {
  src?: string
  containerClass?: string
  objectClass?: string
  label?: string
}

const props = withDefaults(defineProps<Props>(), {
  src: IRIDESCENT_LOGO_ASSETS.staticSrc,
  containerClass: '',
  objectClass: '',
  label: `${DEFAULT_SITE_INFO.siteName} logo`
})

const { isDark } = useDarkMode()
const renderNonce = ref(0)

watch(isDark, () => {
  renderNonce.value += 1
})

const themeToken = computed(() => (isDark.value ? 'dark' : 'light'))
const src = computed(() => props.src)
const objectKey = computed(() => `${src.value}-${themeToken.value}-${renderNonce.value}`)
const objectData = computed(() => `${src.value}?theme=${themeToken.value}&v=${renderNonce.value}`)
</script>

<style scoped>
.iridescent-asset-shell {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
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
