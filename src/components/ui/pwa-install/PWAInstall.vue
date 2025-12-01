<template>
  <div v-if="showInstallPrompt" class="pwa-install-prompt">
    <Card class="install-card">
      <CardContent class="p-4">
        <div class="flex items-center gap-3">
          <div class="install-icon">
            <Download class="h-6 w-6" />
          </div>
          <div class="flex-1">
            <h3 class="font-medium text-sm">{{ t('pwa.installTitle') }}</h3>
            <p class="text-xs text-muted-foreground mt-1">
              {{ t('pwa.installDescription') }}
            </p>
          </div>
          <div class="flex gap-2">
            <Button variant="outline" size="sm" @click="dismissPrompt">
              {{ t('common.cancel') }}
            </Button>
            <Button size="sm" @click="installPWA">
              {{ t('pwa.install') }}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Download } from 'lucide-vue-next'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
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
  background-color: hsl(var(--primary) / 0.1);
  color: hsl(var(--primary));
}

@media (min-width: 640px) {
  .pwa-install-prompt {
    left: auto;
    right: 1rem;
    max-width: 400px;
  }
}
</style>
