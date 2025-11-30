import { ref, computed } from 'vue'
import { supabase } from '@/lib/supabase'

// 文件上传状态
export interface UploadStatus {
  uploading: boolean
  progress: number
  error: string | null
  file: File | null
  url: string | null
}

// 文件类型限制
export const FILE_TYPE_LIMITS = {
  // 图片类型
  image: {
    extensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'],
    mimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
    maxSize: 10 * 1024 * 1024, // 10MB
  },
  // 文档类型
  document: {
    extensions: ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.txt'],
    mimeTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'text/plain',
    ],
    maxSize: 50 * 1024 * 1024, // 50MB
  },
  // 视频类型
  video: {
    extensions: ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm'],
    mimeTypes: [
      'video/mp4',
      'video/avi',
      'video/quicktime',
      'video/x-ms-wmv',
      'video/x-flv',
      'video/webm',
    ],
    maxSize: 100 * 1024 * 1024, // 100MB
  },
  // 音频类型
  audio: {
    extensions: ['.mp3', '.wav', '.ogg', '.aac', '.flac'],
    mimeTypes: ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/aac', 'audio/flac'],
    maxSize: 20 * 1024 * 1024, // 20MB
  },
  // 压缩文件类型
  archive: {
    extensions: ['.zip', '.rar', '.7z', '.tar', '.gz'],
    mimeTypes: [
      'application/zip',
      'application/x-rar-compressed',
      'application/x-7z-compressed',
      'application/x-tar',
      'application/gzip',
    ],
    maxSize: 100 * 1024 * 1024, // 100MB
  },
} as const

export type FileTypeCategory = keyof typeof FILE_TYPE_LIMITS

export function useFileUpload() {
  const uploadStatus = ref<UploadStatus>({
    uploading: false,
    progress: 0,
    error: null,
    file: null,
    url: null,
  })

  // 计算属性
  const isUploading = computed(() => uploadStatus.value.uploading)
  const uploadProgress = computed(() => uploadStatus.value.progress)
  const uploadError = computed(() => uploadStatus.value.error)
  const uploadedFile = computed(() => uploadStatus.value.file)
  const uploadedUrl = computed(() => uploadStatus.value.url)

  // 验证文件类型
  const validateFileType = (file: File, category: FileTypeCategory): boolean => {
    const limits = FILE_TYPE_LIMITS[category]
    const extensions = limits.extensions as string[]
    const mimeTypes = limits.mimeTypes as string[]

    // 检查扩展名
    const extension = '.' + file.name.split('.').pop()?.toLowerCase()
    if (!extensions.includes(extension)) {
      throw new Error(`不支持的文件类型。支持的类型：${extensions.join(', ')}`)
    }

    // 检查 MIME 类型
    if (!mimeTypes.includes(file.type)) {
      throw new Error(`不支持的文件格式。支持的格式：${mimeTypes.join(', ')}`)
    }

    return true
  }

  // 验证文件大小
  const validateFileSize = (file: File, category: FileTypeCategory): boolean => {
    const limits = FILE_TYPE_LIMITS[category]

    if (file.size > limits.maxSize) {
      const maxSizeMB = Math.round(limits.maxSize / (1024 * 1024))
      throw new Error(`文件大小超过限制。最大允许大小：${maxSizeMB}MB`)
    }

    return true
  }

  // 自动检测文件类型
  const detectFileType = (file: File): FileTypeCategory => {
    const extension = '.' + file.name.split('.').pop()?.toLowerCase()

    for (const [category, limits] of Object.entries(FILE_TYPE_LIMITS)) {
      const extensions = limits.extensions as string[]
      if (extensions.includes(extension)) {
        return category as FileTypeCategory
      }
    }

    throw new Error('无法识别的文件类型')
  }

  // 生成唯一文件名
  const generateUniqueFileName = (file: File): string => {
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 8)
    const extension = file.name.split('.').pop()
    return `${timestamp}_${randomString}.${extension}`
  }

  // 上传单个文件
  const uploadFile = async (
    file: File,
    options: {
      bucket?: string
      category?: FileTypeCategory
      cacheControl?: string
      contentType?: string
      upsert?: boolean
      metadata?: Record<string, string>
    } = {}
  ) => {
    try {
      // 重置状态
      uploadStatus.value = {
        uploading: true,
        progress: 0,
        error: null,
        file,
        url: null,
      }

      // 检测文件类型
      const category = options.category || detectFileType(file)

      // 验证文件
      validateFileType(file, category)
      validateFileSize(file, category)

      // 生成文件路径
      const fileName = generateUniqueFileName(file)
      const filePath = options.bucket ? `${options.bucket}/${fileName}` : `uploads/${fileName}`

      // 上传文件
      const { data, error } = await supabase.storage
        .from(options.bucket || 'uploads')
        .upload(filePath, file, {
          cacheControl: options.cacheControl || '3600',
          contentType: options.contentType || file.type,
          upsert: options.upsert || false,
          metadata: options.metadata || {
            originalName: file.name,
            size: file.size.toString(),
            type: file.type,
            category,
            uploadedAt: new Date().toISOString(),
          },
        })

      if (error) {
        throw error
      }

      // 获取公共 URL
      const { data: urlData } = supabase.storage
        .from(options.bucket || 'uploads')
        .getPublicUrl(data.path)

      // 更新状态
      uploadStatus.value = {
        uploading: false,
        progress: 100,
        error: null,
        file,
        url: urlData.publicUrl,
      }

      return {
        data: {
          path: data.path,
          id: data.id,
          fullPath: urlData.publicUrl,
        },
        error: null,
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '文件上传失败'

      uploadStatus.value = {
        uploading: false,
        progress: 0,
        error: errorMessage,
        file,
        url: null,
      }

      return {
        data: null,
        error: errorMessage,
      }
    }
  }

  // 上传多个文件
  const uploadMultipleFiles = async (
    files: File[],
    options: {
      bucket?: string
      category?: FileTypeCategory
      cacheControl?: string
      contentType?: string
      upsert?: boolean
      metadata?: Record<string, string>
    } = {}
  ) => {
    const results = []

    for (const file of files) {
      const result = await uploadFile(file, options)
      results.push(result)
    }

    return results
  }

  // 删除文件
  const deleteFile = async (path: string, bucket = 'uploads') => {
    try {
      const { error } = await supabase.storage.from(bucket).remove([path])

      if (error) {
        throw error
      }

      return { success: true }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '文件删除失败'
      return { success: false, error: errorMessage }
    }
  }

  // 获取文件信息
  const getFileInfo = async (path: string, bucket = 'uploads') => {
    try {
      const { data, error } = await supabase.storage.from(bucket).list('', { search: path })

      if (error) {
        throw error
      }

      return data?.[0] || null
    } catch (error) {
      console.error('获取文件信息失败:', error)
      return null
    }
  }

  // 下载文件
  const downloadFile = async (path: string, bucket = 'uploads') => {
    try {
      const { data, error } = await supabase.storage.from(bucket).download(path)

      if (error) {
        throw error
      }

      return data
    } catch (error) {
      console.error('文件下载失败:', error)
      return null
    }
  }

  // 重置上传状态
  const resetUploadStatus = () => {
    uploadStatus.value = {
      uploading: false,
      progress: 0,
      error: null,
      file: null,
      url: null,
    }
  }

  return {
    // 状态
    uploadStatus,
    isUploading,
    uploadProgress,
    uploadError,
    uploadedFile,
    uploadedUrl,

    // 常量
    FILE_TYPE_LIMITS,

    // 方法
    uploadFile,
    uploadMultipleFiles,
    deleteFile,
    getFileInfo,
    downloadFile,
    resetUploadStatus,
    validateFileType,
    validateFileSize,
    detectFileType,
    generateUniqueFileName,
  }
}

// 文件预览功能
export function useFilePreview() {
  const previewUrl = ref<string | null>(null)
  const previewType = ref<'image' | 'video' | 'audio' | 'document' | 'unknown'>('unknown')
  const loading = ref(false)
  const error = ref<string | null>(null)

  // 生成预览 URL
  const generatePreview = async (file: File | string, bucket = 'uploads') => {
    try {
      loading.value = true
      error.value = null

      let url: string
      let type: string

      if (typeof file === 'string') {
        // 如果是文件路径，获取文件信息
        const fileInfo = await supabase.storage.from(bucket).getPublicUrl(file)

        url = fileInfo.data.publicUrl

        // 从路径推断文件类型
        const extension = file.split('.').pop()?.toLowerCase()
        if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension || '')) {
          type = 'image'
        } else if (['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm'].includes(extension || '')) {
          type = 'video'
        } else if (['mp3', 'wav', 'ogg', 'aac', 'flac'].includes(extension || '')) {
          type = 'audio'
        } else {
          type = 'document'
        }
      } else {
        // 如果是 File 对象
        url = URL.createObjectURL(file)
        type = file.type.startsWith('image/')
          ? 'image'
          : file.type.startsWith('video/')
            ? 'video'
            : file.type.startsWith('audio/')
              ? 'audio'
              : 'document'
      }

      previewUrl.value = url
      previewType.value = type as any
    } catch (err) {
      error.value = err instanceof Error ? err.message : '生成预览失败'
      console.error('生成预览失败:', err)
    } finally {
      loading.value = false
    }
  }

  // 清除预览
  const clearPreview = () => {
    if (previewUrl.value && previewUrl.value.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl.value)
    }
    previewUrl.value = null
    previewType.value = 'unknown'
    error.value = null
  }

  return {
    previewUrl,
    previewType,
    loading,
    error,
    generatePreview,
    clearPreview,
  }
}
