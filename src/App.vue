<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { RouterView } from 'vue-router'

const authStore = useAuthStore()

// 在应用启动时初始化认证状态
onMounted(async () => {
  await authStore.initialize()
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <RouterView />
  </div>
</template>
