<template>
  <div v-if="showInstallPrompt" class="pwa-install-prompt">
    <div
      class="install-card bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4"
    >
      <div class="flex items-center gap-3">
        <div class="install-icon">
          <Download class="h-6 w-6" />
        </div>
        <div class="flex-1">
          <h3 class="font-medium text-sm">{{ t('pwa.installTitle') }}</h3>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {{ t('pwa.installDescription') }}
          </p>
        </div>
        <div class="flex gap-2">
          <button
            @click="dismissPrompt"
            class="px-3 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            {{ t('common.cancel') }}
          </button>
          <button
            @click="installPWA"
            class="px-3 py-1.5 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            {{ t('pwa.install') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Download } from 'lucide-vue-next'
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
}

.install-card {
  max-width: 400px;
  margin: 0 auto;
}

.install-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.5rem;
  background-color: rgba(59, 130, 246, 0.1);
  color: rgb(59, 130, 246);
}

@media (min-width: 640px) {
  .pwa-install-prompt {
    left: auto;
    right: 1rem;
    max-width: 400px;
  }
}
</style>
