<template>
  <div class="upload-example container mx-auto p-6">
    <Card>
      <CardHeader>
        <CardTitle>Vue Query 和文件上传示例</CardTitle>
        <CardDescription> 使用 Vue Query 和文件上传 composables 的示例页面 </CardDescription>
      </CardHeader>
      <CardContent class="space-y-6">
        <!-- 基础文件上传 -->
        <div>
          <h3 class="text-lg font-medium mb-4">基础文件上传</h3>
          <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              ref="fileInput"
              type="file"
              multiple
              accept="image/*,.pdf,.doc,.docx"
              @change="handleFileSelect"
              class="hidden"
            />
            <div v-if="isUploading" class="space-y-4">
              <LoadingSpinner />
              <p class="text-sm text-gray-600">上传中... {{ uploadProgress }}%</p>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div
                  class="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  :style="{ width: `${uploadProgress}%` }"
                ></div>
              </div>
            </div>
            <div v-else class="space-y-4">
              <UploadCloud class="mx-auto h-12 w-12 text-gray-400" />
              <p class="text-lg font-medium text-gray-900">点击或拖拽文件到此处上传</p>
              <p class="text-sm text-gray-500">支持图片、PDF、Word 文档 (最大 10MB)</p>
              <Button @click="triggerFileSelect" variant="outline"> 选择文件 </Button>
            </div>
          </div>
        </div>

        <!-- Vue Query 数据展示 -->
        <div>
          <h3 class="text-lg font-medium mb-4">上传的文件列表</h3>
          <div v-if="isLoading" class="flex items-center justify-center py-8">
            <LoadingSpinner />
            <span class="ml-2">加载中...</span>
          </div>

          <div v-else-if="error" class="text-red-600 py-4">加载失败: {{ error }}</div>

          <div v-else-if="uploadedFiles && uploadedFiles.length > 0" class="space-y-2">
            <div
              v-for="file in uploadedFiles"
              :key="file.id"
              class="flex items-center justify-between p-3 border rounded-lg"
            >
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                  <File class="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p class="font-medium">{{ file.name }}</p>
                  <p class="text-sm text-gray-500">{{ formatFileSize(file.size) }}</p>
                </div>
              </div>

              <div class="flex items-center space-x-2">
                <Button variant="outline" size="sm" @click="downloadFile(file)"> 下载 </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  @click="deleteFile(file.id)"
                  :disabled="deleteMutation.isPending.value"
                >
                  删除
                </Button>
              </div>
            </div>
          </div>

          <div v-else class="text-gray-500 py-4 text-center">暂无上传的文件</div>
        </div>

        <!-- 分页示例 -->
        <div v-if="uploadedFiles && uploadedFiles.length > 0">
          <div class="flex items-center justify-between">
            <div class="text-sm text-gray-600">
              显示 {{ (currentPage - 1) * pageSize + 1 }} -
              {{ Math.min(currentPage * pageSize, totalCount) }}
              共 {{ totalCount }} 个文件
            </div>

            <div class="flex items-center space-x-2">
              <Button variant="outline" size="sm" @click="prevPage" :disabled="currentPage <= 1">
                上一页
              </Button>

              <span class="text-sm"> 第 {{ currentPage }} 页，共 {{ totalPages }} 页 </span>

              <Button
                variant="outline"
                size="sm"
                @click="nextPage"
                :disabled="currentPage >= totalPages"
              >
                下一页
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/ui/loading'
import { File, UploadCloud } from 'lucide-vue-next'
import {
  useSupabaseList,
  useSupabaseCreate,
  useSupabaseDelete,
  useSupabasePaginatedQuery,
} from '@/lib/vue-query'
import { useFileUpload } from '@/composables/useFileUpload'
import { useNotification } from '@/composables/useNotification'

// 文件上传相关
const fileInput = ref<HTMLInputElement>()
const selectedFiles = ref<File[]>([])

// 使用现有的文件上传 composable
const {
  uploadFile,
  uploadMultipleFiles,
  deleteFile: deleteFileFromStorage,
  isUploading,
  uploadProgress,
  uploadError,
} = useFileUpload()

// 使用 Vue Query 获取文件列表
const { data: uploadedFiles, isLoading, error } = useSupabaseList('files')

// 使用分页查询
const {
  data: paginatedData,
  page: currentPage,
  nextPage,
  prevPage,
} = useSupabasePaginatedQuery('files', {
  pageSize: 10,
})

// 计算属性
const totalCount = computed(() => paginatedData.value?.pagination.total || 0)
const totalPages = computed(() => paginatedData.value?.pagination.totalPages || 0)
const pageSize = 10

// 使用 Vue Query 创建文件记录
const createMutation = useSupabaseCreate('files', {
  onSuccess: (data) => {
    console.log('文件记录创建成功:', data)
  },
})

// 使用 Vue Query 删除文件
const deleteMutation = useSupabaseDelete('files', {
  onSuccess: () => {
    showSuccess('删除成功', '文件已成功删除')
  },
})

const { success: showSuccess, error: showError } = useNotification()

// 方法
const triggerFileSelect = () => {
  fileInput.value?.click()
}

const handleFileSelect = async (event: Event) => {
  const files = (event.target as HTMLInputElement).files
  if (!files || files.length === 0) return

  selectedFiles.value = Array.from(files)

  // 使用现有的文件上传 composable 上传文件
  try {
    for (const file of selectedFiles.value) {
      const result = await uploadFile(file, {
        category: 'image', // 自动检测或指定类型
      })

      if (result.error) {
        throw new Error(result.error)
      }

      // 创建文件记录
      createMutation.mutate({
        name: file.name,
        size: file.size,
        type: file.type,
        url: result.data?.fullPath || '',
        uploaded_at: new Date().toISOString(),
      })
    }

    showSuccess('上传成功', `成功上传 ${selectedFiles.value.length} 个文件`)
  } catch (error) {
    console.error('文件上传失败:', error)
    showError('上传失败', error instanceof Error ? error.message : '文件上传失败')
  }

  // 清空文件输入
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const downloadFile = (file: any) => {
  // 创建下载链接
  const link = document.createElement('a')
  link.href = file.url
  link.download = file.name
  link.click()
}

const deleteFile = (fileId: string) => {
  if (confirm('确定要删除这个文件吗？')) {
    deleteMutation.mutate(fileId)
  }
}
</script>

<style scoped>
.upload-example {
  max-width: 800px;
}
</style>
