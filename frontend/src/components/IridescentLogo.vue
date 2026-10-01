<template>
  <div
    class="iridescent-logo-shell"
    :style="sizeStyle"
  >
    <IridescentAnimatedAssetLogo
      ref="animatedLogoRef"
      container-class="w-full h-full"
      object-class="w-full h-full"
      label="Iridescent animated logo"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import IridescentAnimatedAssetLogo from './IridescentAnimatedAssetLogo.vue'

interface Props {
  size?: number | string
  lineDelay?: number
  strokeDuration?: number
  colorDuration?: number
  autoStart?: boolean
  loop?: boolean
  loopPause?: number
  strokeWidth?: number
  outlineColor?: string
}

const props = defineProps<Props>()
const animatedLogoRef = ref<InstanceType<typeof IridescentAnimatedAssetLogo> | null>(null)

const sizeStyle = computed(() => {
  if (typeof props.size === 'number') {
    return {
      width: `${props.size}px`,
      height: `${props.size}px`
    }
  }

  if (typeof props.size === 'string' && props.size.trim()) {
    return {
      width: props.size,
      height: props.size
    }
  }

  return undefined
})

defineExpose({
  replay: () => animatedLogoRef.value?.replay()
})
</script>

<style scoped>
.iridescent-logo-shell {
  width: 100%;
  height: 100%;
}
</style>
