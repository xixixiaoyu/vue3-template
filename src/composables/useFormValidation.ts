import { ref, reactive, computed } from 'vue'
import { useForm, useField } from 'vee-validate'
import { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod'
import { useNotification } from './useNotification'

interface UseFormValidationOptions<T extends z.ZodObject<any>> {
  schema: T
  initialValues?: z.infer<T>
  onSubmit: (values: z.infer<T>) => Promise<void> | void
}

export function useFormValidation<T extends z.ZodObject<any>>(
  options: UseFormValidationOptions<T>
) {
  const { error } = useNotification()

  const form = useForm({
    validationSchema: toTypedSchema(options.schema),
    initialValues: options.initialValues || ({} as z.infer<T>),
  })

  const isSubmitting = ref(false)
  const serverError = ref<string>('')

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
      }
    >
  >({})

  // 获取 schema 中的所有字段名
  const fieldNames = Object.keys(options.schema.shape)

  fieldNames.forEach((fieldName) => {
    const { value, errorMessage, meta, validate } = useField(fieldName)
    fields[fieldName] = reactive({
      value,
      errorMessage,
      meta,
      validate,
      name: fieldName,
    })
  })

  const handleSubmit = form.handleSubmit(async (values: z.infer<T>) => {
    try {
      isSubmitting.value = true
      serverError.value = ''

      await options.onSubmit(values)

      // 成功后可以选择重置表单
      // form.resetForm()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '提交失败，请重试'
      serverError.value = errorMessage
      error('表单提交失败', errorMessage)
    } finally {
      isSubmitting.value = false
    }
  })

  const resetForm = () => {
    form.resetForm()
    serverError.value = ''
  }

  const setFieldValue = (fieldName: string, value: any) => {
    form.setFieldValue(fieldName, value)
  }

  const setErrors = (errors: Record<string, string>) => {
    Object.entries(errors).forEach(([field, message]) => {
      form.setFieldError(field, message)
    })
  }

  const isValid = computed(() => form.meta.value.valid)

  const isDirty = computed(() => form.meta.value.dirty)

  return {
    // 表单状态
    values: form.values as z.infer<T>,
    errors: form.errors,
    meta: form.meta,

    // 字段
    fields,

    // 状态
    isSubmitting,
    serverError,
    isValid,
    isDirty,

    // 方法
    handleSubmit,
    resetForm,
    setFieldValue,
    setErrors,
  }
}

// 常用验证规则
export const validationRules = {
  required: (message = '此字段为必填项') => z.string().min(1, message),
  email: z.string().email('请输入有效的邮箱地址'),
  password: z.string().min(6, '密码至少需要 6 个字符'),
  confirmPassword: (passwordField = 'password', getValues?: () => any) =>
    z
      .string()
      .min(1, '请确认密码')
      .refine(
        (data) => {
          if (getValues) {
            const password = getValues()[passwordField]
            return data === password
          }
          return false // 如果没有提供 getValues 函数，默认返回 false
        },
        { message: '两次输入的密码不一致' }
      ),
  phone: z.string().regex(/^1[3-9]\d{9}$/, '请输入有效的手机号码'),
  url: z.string().url('请输入有效的 URL'),
  number: (min?: number, max?: number) => {
    let rule = z.string().regex(/^\d+$/, '请输入有效的数字')
    if (min !== undefined) rule = rule.refine((val) => Number(val) >= min, `数值不能小于 ${min}`)
    if (max !== undefined) rule = rule.refine((val) => Number(val) <= max, `数值不能大于 ${max}`)
    return rule
  },
  minLength: (length: number, message?: string) =>
    z.string().min(length, message || `至少需要 ${length} 个字符`),
  maxLength: (length: number, message?: string) =>
    z.string().max(length, message || `不能超过 ${length} 个字符`),
  range: (min: number, max: number, message?: string) =>
    z
      .number()
      .min(min, message || `数值不能小于 ${min}`)
      .max(max, message || `数值不能大于 ${max}`),
}
