<template>
  <div v-if="showInstallPrompt" class="pwa-install-prompt">
    <n-card>
      <div class="flex items-center gap-3">
        <div class="install-icon">
          <Icon name="Download" size="24" color="#2563eb" />
        </div>
        <div class="flex-1">
          <n-text class="font-medium text-sm">
            {{ t('pwa.installTitle') }}
          </n-text>
          <n-text depth="3" class="text-xs mt-1">
            {{ t('pwa.installDescription') }}
          </n-text>
        </div>
        <div class="flex gap-2">
          <n-button @click="dismissPrompt" size="small" tertiary>
            {{ t('common.cancel') }}
          </n-button>
          <n-button @click="installPWA" size="small" type="primary">
            {{ t('pwa.install') }}
          </n-button>
        </div>
      </div>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Icon } from '@/components/ui'
import { useLocale } from '@/composables/useI18n'

const { t } = useLocale()

const showInstallPrompt = ref(false)
let deferredPrompt: any = null

const installPWA = async () => {
  if (!deferredPrompt) return

  deferredPrompt.prompt()
  const { outcome } = await deferredPrompt.userChoice

  if (outcome === 'accepted') {
    console.log('PWA installation accepted')
  } else {
    console.log('PWA installation dismissed')
  }

  deferredPrompt = null
  showInstallPrompt.value = false
}

const dismissPrompt = () => {
  showInstallPrompt.value = false
  deferredPrompt = null
}

onMounted(() => {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    deferredPrompt = e
    showInstallPrompt.value = true
  })

  // 检查是否已经安装
  if (window.matchMedia('(display-mode: standalone)').matches) {
    showInstallPrompt.value = false
  }
})
</script>

<style scoped>
.pwa-install-prompt {
  position: fixed;
  bottom: 1rem;
  left: 1rem;
  right: 1rem;
  z-index: 50;
  max-width: 400px;
}

.install-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.5rem;
  background-color: rgba(59, 130, 246, 0.1);
}

@media (min-width: 640px) {
  .pwa-install-prompt {
    left: auto;
    right: 1rem;
  }
}
</style>
