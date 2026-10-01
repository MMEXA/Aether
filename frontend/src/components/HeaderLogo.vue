<template>
  <div
    class="relative shrink-0"
    :class="containerClass"
  >
    <IridescentStaticAssetLogo
      container-class="w-full h-full"
      object-class="w-full h-full"
      :label="`${DEFAULT_SITE_INFO.siteName} logo`"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { DEFAULT_SITE_INFO } from '@/config/siteBrand'
import IridescentStaticAssetLogo from './IridescentStaticAssetLogo.vue'

interface Props {
  size?: string
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 'h-8 w-8',
  className: ''
})

const containerClass = computed(() => [props.size, props.className].filter(Boolean).join(' '))
</script>
