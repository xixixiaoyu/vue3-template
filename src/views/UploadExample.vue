<template>
  <div class="upload-example container mx-auto p-6">
    <n-card>
      <template #header>
        <div>
          <n-h2 class="mb-1">Vue Query 和文件上传示例</n-h2>
          <n-p depth="3"> 使用 Vue Query 和文件上传 composables 的示例页面 </n-p>
        </div>
      </template>

      <n-space vertical size="large">
        <!-- 基础文件上传 -->
        <n-card>
          <template #header>
            <n-h3>基础文件上传</n-h3>
          </template>

          <n-upload
            ref="uploadRef"
            multiple
            directory-dnd
            :max="5"
            :file-list="fileList"
            :custom-request="handleUpload"
            @change="handleFileChange"
            @remove="handleFileRemove"
            accept="image/*,.pdf,.doc,.docx"
          >
            <n-upload-dragger>
              <div style="margin-bottom: 12px">
                <n-icon size="48" depth="3">
                  <UploadCloud />
                </n-icon>
              </div>
              <n-text style="font-size: 16px"> 点击或者拖动文件到该区域来上传 </n-text>
              <n-p depth="3" style="margin: 8px 0 0 0"> 支持图片、PDF、Word 文档 (最大 10MB) </n-p>
            </n-upload-dragger>
          </n-upload>

          <!-- 上传进度 -->
          <n-progress
            v-if="isUploading"
            type="line"
            :percentage="uploadProgress"
            :show-indicator="true"
            class="mt-4"
          />
        </n-card>

        <!-- Vue Query 数据展示 -->
        <n-card>
          <template #header>
            <n-h3>上传的文件列表</n-h3>
          </template>

          <n-spin :show="isLoading">
            <div v-if="error" class="py-4">
              <n-alert type="error" title="加载失败">
                {{ error }}
              </n-alert>
            </div>

            <div v-else-if="uploadedFiles && uploadedFiles.length > 0">
              <n-list>
                <n-list-item v-for="file in uploadedFiles" :key="file.id">
                  <n-thing>
                    <template #header>
                      <div class="flex items-center gap-2">
                        <n-icon size="20">
                          <File />
                        </n-icon>
                        {{ file.name }}
                      </div>
                    </template>
                    <template #description>
                      <n-text depth="3">{{ formatFileSize(file.size) }}</n-text>
                    </template>
                    <template #footer>
                      <n-space>
                        <n-button size="small" @click="downloadFile(file)"> 下载 </n-button>
                        <n-button
                          size="small"
                          type="error"
                          :loading="deleteMutation.isPending.value"
                          @click="deleteFile(file.id)"
                        >
                          删除
                        </n-button>
                      </n-space>
                    </template>
                  </n-thing>
                </n-list-item>
              </n-list>
            </div>

            <n-empty v-else description="暂无上传的文件" />
          </n-spin>
        </n-card>

        <!-- 分页示例 -->
        <n-card v-if="uploadedFiles && uploadedFiles.length > 0">
          <n-space justify="space-between" align="center">
            <n-text depth="3">
              显示 {{ (currentPage - 1) * pageSize + 1 }} -
              {{ Math.min(currentPage * pageSize, totalCount) }}
              共 {{ totalCount }} 个文件
            </n-text>

            <n-pagination
              v-model:page="currentPage"
              :page-count="totalPages"
              :page-size="pageSize"
              show-size-picker
              :page-sizes="[10, 20, 50]"
              @update:page-size="handlePageSizeChange"
            />
          </n-space>
        </n-card>
      </n-space>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { File, UploadCloud } from 'lucide-vue-next'
import {
  useSupabaseList,
  useSupabaseCreate,
  useSupabaseDelete,
  useSupabasePaginatedQuery,
} from '@/lib/vue-query'
import { useFileUpload } from '@/composables/useFileUpload'
import { useMessage, useDialog } from 'naive-ui'
import type { UploadFileInfo, UploadCustomRequestOptions } from 'naive-ui'

// 文件上传相关
const uploadRef = ref()
const fileList = ref<UploadFileInfo[]>([])

const message = useMessage()
const dialog = useDialog()

// 使用现有的文件上传 composable
const {
  uploadFile,
  deleteFile: deleteFileFromStorage,
  isUploading,
  uploadProgress,
  uploadError,
} = useFileUpload()

// 使用 Vue Query 获取文件列表
const { data: uploadedFiles, isLoading, error, refetch } = useSupabaseList('files')

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
const pageSize = ref(10)

// 使用 Vue Query 创建文件记录
const createMutation = useSupabaseCreate('files', {
  onSuccess: (data) => {
    console.log('文件记录创建成功:', data)
    refetch()
  },
})

// 使用 Vue Query 删除文件
const deleteMutation = useSupabaseDelete('files', {
  onSuccess: () => {
    message.success('文件已成功删除')
    refetch()
  },
})

// 方法
const handleUpload = async ({
  file,
  onFinish,
  onError,
  onProgress,
}: UploadCustomRequestOptions) => {
  try {
    const fileObj = file.file as File
    const result = await uploadFile(fileObj, {
      category: 'image',
    })

    if (result.error) {
      throw new Error(result.error)
    }

    // 创建文件记录
    createMutation.mutate({
      name: fileObj.name,
      size: fileObj.size,
      type: fileObj.type,
      url: result.data?.fullPath || '',
      uploaded_at: new Date().toISOString(),
    })

    onFinish()
    message.success(`${fileObj.name} 上传成功`)
  } catch (error) {
    console.error('文件上传失败:', error)
    onError()
    message.error(error instanceof Error ? error.message : '文件上传失败')
  }
}

const handleFileChange = (options: { file: UploadFileInfo; fileList: UploadFileInfo[] }) => {
  fileList.value = options.fileList
}

const handleFileRemove = (options: { file: UploadFileInfo; fileList: UploadFileInfo[] }) => {
  fileList.value = options.fileList
}

const handlePageSizeChange = (size: number) => {
  pageSize.value = size
  // 重新获取数据以应用新的页面大小
  refetch()
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
  dialog.warning({
    title: '确认删除',
    content: '确定要删除这个文件吗？',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: () => {
      deleteMutation.mutate(fileId)
    },
  })
}
</script>

<style scoped>
.upload-example {
  max-width: 1200px;
}
</style>
