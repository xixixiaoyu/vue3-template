import { ref, reactive, computed, nextTick } from 'vue'
import { useForm, useField } from 'vee-validate'
import { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod'
import { useNotification } from './useNotification'
import { useAutoAnimate } from './useAutoAnimate'

interface UseEnhancedFormValidationOptions<T extends z.ZodObject<any>> {
  schema: T
  initialValues?: z.infer<T>
  onSubmit: (values: z.infer<T>) => Promise<void> | void
  onSuccess?: () => void
  onError?: (error: Error) => void
  validateOnChange?: boolean
  validateOnBlur?: boolean
  showSuccessMessage?: boolean
  showErrorMessage?: boolean
}

export function useEnhancedFormValidation<T extends z.ZodObject<any>>(
  options: UseEnhancedFormValidationOptions<T>
) {
  const { success, error } = useNotification()
  const [parentRef, setParentRef] = useAutoAnimate()

  const form = useForm({
    validationSchema: toTypedSchema(options.schema),
    initialValues: (options.initialValues as any) || {},
    validateOnMount: false,
  })

  const isSubmitting = ref(false)
  const serverError = ref<string>('')
  const isSubmitted = ref(false)

  // 为每个字段创建 useField
  const fields = reactive<
    Record<
      string,
      {
        value: any
        errorMessage: string | undefined
        meta: any
        validate: () => Promise<any>
        name: string
        touched: boolean
        dirty: boolean
        valid: boolean
        invalid: boolean
      }
    >
  >({})

  // 获取 schema 中的所有字段名
  const fieldNames = Object.keys(options.schema?.shape || {})

  fieldNames.forEach((fieldName) => {
    try {
      const { value, errorMessage, meta, validate } = useField(fieldName)
      fields[fieldName] = reactive({
        value,
        errorMessage,
        meta,
        validate,
        name: fieldName,
        touched: computed(() => meta.touched),
        dirty: computed(() => meta.dirty),
        valid: computed(() => meta.valid),
        invalid: computed(() => !meta.valid),
      })
    } catch (error) {
      console.error(`Error creating field ${fieldName}:`, error)
      // 创建一个安全的默认字段对象
      fields[fieldName] = reactive({
        value: ref(''),
        errorMessage: ref(''),
        meta: reactive({ touched: false, dirty: false, valid: false }),
        validate: async () => ({ valid: false }),
        name: fieldName,
        touched: computed(() => false),
        dirty: computed(() => false),
        valid: computed(() => false),
        invalid: computed(() => true),
      })
    }
  })

  // 自定义提交处理函数，先手动验证再执行回调
  const handleSubmit = async () => {
    try {
      isSubmitting.value = true
      serverError.value = ''
      isSubmitted.value = true

      // 先验证所有字段
      const validationResult = await form.validate()

      if (!validationResult.valid) {
        // 验证失败，滚动到第一个错误
        await nextTick()
        scrollToError()
        return
      }

      // 获取表单值并执行提交
      const values = form.values as z.infer<T>
      await options.onSubmit(values)

      // 成功回调
      if (options.onSuccess) {
        options.onSuccess()
      }

      // 只有在选项中明确指定时才显示成功消息
      if (options.showSuccessMessage !== false) {
        success('操作成功', '表单提交成功')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '提交失败，请重试'
      serverError.value = errorMessage

      // 错误回调
      if (options.onError) {
        options.onError(err instanceof Error ? err : new Error(errorMessage))
      }

      // 只有在选项中明确指定时才显示错误消息
      if (options.showErrorMessage !== false) {
        error('表单提交失败', errorMessage)
      }

      // 滚动到错误位置
      await nextTick()
      scrollToError()
    } finally {
      isSubmitting.value = false
    }
  }

  // 滚动到第一个错误字段
  const scrollToError = async () => {
    const firstErrorField = document.querySelector('.n-form-item--error')
    if (firstErrorField) {
      firstErrorField.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    }
  }

  // 重置表单
  const resetForm = () => {
    form.resetForm()
    serverError.value = ''
    isSubmitted.value = false
  }

  // 设置字段值
  const setFieldValue = (fieldName: string, value: any) => {
    form.setFieldValue(fieldName as any, value)
  }

  // 设置多个字段值
  const setFieldValues = (values: Partial<z.infer<T>>) => {
    Object.entries(values).forEach(([field, value]) => {
      form.setFieldValue(field as any, value)
    })
  }

  // 设置错误
  const setErrors = (errors: Record<string, string>) => {
    Object.entries(errors).forEach(([field, message]) => {
      form.setFieldError(field as any, message)
    })
  }

  // 验证所有字段
  const validateAll = async () => {
    const result = await form.validate()
    return result.valid
  }

  // 验证单个字段
  const validateField = async (fieldName: string) => {
    if (fields[fieldName]) {
      return await fields[fieldName].validate()
    }
    return { valid: false }
  }

  // 获取字段错误信息
  const getFieldError = (fieldName: string) => {
    return fields[fieldName]?.errorMessage
  }

  // 检查字段是否有错误
  const hasFieldError = (fieldName: string) => {
    return !!getFieldError(fieldName)
  }

  // 检查表单是否有任何验证错误消息
  const hasErrors = computed(() => {
    return Object.values(fields).some((field) => !!field.errorMessage) || !!serverError.value
  })

  // 检查所有字段是否都已填写
  const allFieldsFilled = computed(() => {
    return fieldNames.every((fieldName) => {
      const value = fields[fieldName]?.value
      if (value === undefined || value === null) return false
      if (typeof value === 'string') return value.trim().length > 0
      if (typeof value === 'boolean') return true
      return !!value
    })
  })

  // 表单有效性：所有字段已填写 + 无错误消息
  const isValid = computed(() => allFieldsFilled.value && !hasErrors.value)

  // 表单是否被修改过
  const isDirty = computed(() => form.meta.value.dirty)

  // 获取所有表单值
  const getValues = () => {
    return form.values as z.infer<T>
  }

  // 获取特定字段值
  const getFieldValue = (fieldName: string) => {
    return fields[fieldName]?.value
  }

  // 聚焦到指定字段
  const focusField = (fieldName: string) => {
    const input = document.querySelector(`[name="${fieldName}"]`) as HTMLInputElement
    if (input) {
      input.focus()
      input.select()
    }
  }

  // 清除特定字段错误
  const clearFieldError = (fieldName: string) => {
    form.setFieldError(fieldName as any, undefined)
  }

  // 清除所有错误
  const clearAllErrors = () => {
    Object.keys(fields).forEach((fieldName) => {
      form.setFieldError(fieldName as any, undefined)
    })
    serverError.value = ''
  }

  return {
    // 动画引用
    parentRef,
    setParentRef,

    // 表单状态
    values: form.values as z.infer<T>,
    errors: form.errors,
    meta: form.meta,

    // 字段
    fields,

    // 状态
    isSubmitting,
    serverError,
    isSubmitted,
    isValid,
    isDirty,
    hasErrors,

    // 方法
    handleSubmit,
    resetForm,
    setFieldValue,
    setFieldValues,
    setErrors,
    validateAll,
    validateField,
    getFieldError,
    hasFieldError,
    getValues,
    getFieldValue,
    focusField,
    clearFieldError,
    clearAllErrors,
    scrollToError,
  }
}
