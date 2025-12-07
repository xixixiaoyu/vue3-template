#!/usr/bin/env node
/* eslint-env node */

/**
 * 数据库初始化脚本
 * 用于初始化 Supabase 数据库结构和基础数据
 */

import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import readline from 'readline'
import { fileURLToPath } from 'url'

// 获取当前文件的目录路径（ES 模块中等价于 __dirname）
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 加载环境变量
function loadEnvFile() {
  const envPath = path.join(__dirname, '../.env')
  const envExamplePath = path.join(__dirname, '../.env.example')

  // 如果 .env 文件不存在，尝试从 .env.example 复制
  if (!fs.existsSync(envPath) && fs.existsSync(envExamplePath)) {
    colorLog('未找到 .env 文件，正在从 .env.example 创建...', 'yellow')
    fs.copyFileSync(envExamplePath, envPath)
    colorLog('已创建 .env 文件，请编辑其中的 Supabase 配置', 'yellow')
    colorLog('请编辑 .env 文件后重新运行此脚本', 'cyan')
    process.exit(0)
  }

  // 读取并解析 .env 文件
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8')
    const envLines = envContent.split('\n')

    for (const line of envLines) {
      const trimmedLine = line.trim()
      if (trimmedLine && !trimmedLine.startsWith('#')) {
        const [key, ...values] = trimmedLine.split('=')
        if (key && values.length > 0) {
          process.env[key.trim()] = values.join('=').trim()
        }
      }
    }
  }
}

// 创建命令行接口
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

// 颜色输出函数
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
}

function colorLog(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

// 询问用户输入
function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(`${colors.cyan}${question}${colors.reset} `, (answer) => {
      resolve(answer.trim())
    })
  })
}

// 检查环境变量
function checkEnvironmentVariables() {
  const requiredVars = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY']
  const missingVars = requiredVars.filter((varName) => !process.env[varName])

  if (missingVars.length > 0) {
    colorLog('错误：缺少必需的环境变量：', 'red')
    missingVars.forEach((varName) => {
      console.log(`  - ${varName}`)
    })
    colorLog('\n请设置以下环境变量：', 'yellow')
    console.log('export VITE_SUPABASE_URL=your_supabase_project_url')
    console.log('export VITE_SUPABASE_ANON_KEY=your_supabase_anon_key')
    process.exit(1)
  }
}

// 初始化 Supabase 客户端
function createSupabaseClient() {
  return createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY)
}

// 执行 SQL 文件
async function executeSqlFile(supabase, filePath) {
  try {
    colorLog(`正在执行 SQL 文件：${filePath}`, 'blue')
    colorLog(
      '注意：由于 Supabase 客户端限制，请手动在 Supabase Dashboard 中执行此 SQL 文件',
      'yellow'
    )

    const sqlContent = fs.readFileSync(filePath, 'utf8')

    // 显示 SQL 文件内容的前几行
    const lines = sqlContent.split('\n').slice(0, 10)
    colorLog('SQL 文件内容预览：', 'cyan')
    lines.forEach((line, index) => {
      console.log(`${(index + 1).toString().padStart(3, ' ')} | ${line}`)
    })

    if (sqlContent.split('\n').length > 10) {
      console.log('    ... (更多内容)')
    }

    colorLog(`\n请访问 Supabase Dashboard -> SQL Editor 来执行此文件：${filePath}`, 'yellow')

    return true
  } catch (error) {
    colorLog(`读取 SQL 文件失败：${error.message}`, 'red')
    return false
  }
}

// 创建基础数据
async function createSeedData(supabase) {
  try {
    colorLog('正在创建基础数据...', 'blue')

    // 创建示例分类
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .insert([
        { name: '工作', description: '工作相关项目', color: '#3B82F6', icon: 'briefcase' },
        { name: '个人', description: '个人项目', color: '#10B981', icon: 'user' },
        { name: '学习', description: '学习相关项目', color: '#F59E0B', icon: 'book' },
        { name: '娱乐', description: '娱乐项目', color: '#EF4444', icon: 'gamepad-2' },
      ])
      .select()

    if (categoriesError) {
      colorLog('创建示例分类失败：', 'red')
      console.error(categoriesError)
      return false
    }

    colorLog(`创建了 ${categories.length} 个示例分类`, 'green')

    // 创建示例项目
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .insert([
        {
          name: 'Vue 3 模板',
          description: '基于 Vue 3 和 Supabase 的现代化模板',
          status: 'active',
          priority: 'high',
          category_id: categories[0]?.id,
        },
        {
          name: '个人博客',
          description: '个人技术博客项目',
          status: 'active',
          priority: 'medium',
          category_id: categories[1]?.id,
        },
      ])
      .select()

    if (projectsError) {
      colorLog('创建示例项目失败：', 'red')
      console.error(projectsError)
      return false
    }

    colorLog(`创建了 ${projects.length} 个示例项目`, 'green')

    // 创建示例任务
    const { data: tasks, error: tasksError } = await supabase
      .from('tasks')
      .insert([
        {
          title: '设计数据库架构',
          description: '设计应用所需的数据库表结构',
          status: 'completed',
          priority: 'high',
          project_id: projects[0]?.id,
        },
        {
          title: '实现认证系统',
          description: '集成 Supabase 认证功能',
          status: 'in_progress',
          priority: 'high',
          project_id: projects[0]?.id,
        },
        {
          title: '编写文档',
          description: '编写项目使用文档',
          status: 'todo',
          priority: 'medium',
          project_id: projects[1]?.id,
        },
      ])
      .select()

    if (tasksError) {
      colorLog('创建示例任务失败：', 'red')
      console.error(tasksError)
      return false
    }

    colorLog(`创建了 ${tasks.length} 个示例任务`, 'green')

    return true
  } catch (error) {
    colorLog(`创建基础数据失败：${error.message}`, 'red')
    return false
  }
}

// 验证数据库结构
async function validateDatabase(supabase) {
  try {
    colorLog('正在验证数据库结构...', 'blue')

    const tables = [
      'profiles',
      'categories',
      'projects',
      'tasks',
      'files',
      'notifications',
      'user_settings',
      'audit_logs',
    ]
    let allValid = true

    for (const table of tables) {
      try {
        // eslint-disable-next-line no-unused-vars
        const { data: _, error } = await supabase.from(table).select('*').limit(1)

        if (error) {
          colorLog(`表 ${table} 验证失败：`, 'red')
          console.error(error)
          allValid = false
        } else {
          colorLog(`表 ${table} 验证成功`, 'green')
        }
      } catch (err) {
        colorLog(`表 ${table} 验证异常：`, 'red')
        console.error(err)
        allValid = false
      }
    }

    return allValid
  } catch (error) {
    colorLog(`数据库验证失败：${error.message}`, 'red')
    return false
  }
}

// 主函数
async function main() {
  colorLog('=== Supabase 数据库初始化脚本 ===', 'cyan')
  colorLog('此脚本将初始化数据库结构和基础数据\n', 'yellow')

  try {
    // 加载环境变量
    loadEnvFile()

    // 检查环境变量
    checkEnvironmentVariables()

    // 创建 Supabase 客户端
    const supabase = createSupabaseClient()

    // 测试连接
    colorLog('正在测试 Supabase 连接...', 'blue')

    // 尝试获取会话信息来测试连接
    const { error: sessionError } = await supabase.auth.getSession()

    // 即使没有会话，只要没有网络错误就说明连接正常
    if (sessionError && !sessionError.message.includes('Invalid')) {
      colorLog('Supabase 连接失败：', 'red')
      console.error(sessionError)
      process.exit(1)
    }

    colorLog('Supabase 连接成功！', 'green')

    // 询问是否继续
    const continueInit = await askQuestion('是否继续初始化数据库？(y/N)')

    if (continueInit.toLowerCase() !== 'y' && continueInit.toLowerCase() !== 'yes') {
      colorLog('初始化已取消', 'yellow')
      process.exit(0)
    }

    // 执行迁移文件
    const migrationsPath = path.join(__dirname, '../supabase/migrations')
    const migrationFiles = fs
      .readdirSync(migrationsPath)
      .filter((file) => file.endsWith('.sql'))
      .sort()

    if (migrationFiles.length === 0) {
      colorLog('未找到迁移文件', 'yellow')
      process.exit(1)
    }

    colorLog(`找到 ${migrationFiles.length} 个迁移文件`, 'green')

    for (const file of migrationFiles) {
      const filePath = path.join(migrationsPath, file)
      const success = await executeSqlFile(supabase, filePath)

      if (!success) {
        colorLog(`迁移文件 ${file} 执行失败，停止初始化`, 'red')
        process.exit(1)
      }
    }

    // 询问是否创建基础数据
    const createSeed = await askQuestion('是否创建示例数据？(y/N)')

    if (createSeed.toLowerCase() === 'y' || createSeed.toLowerCase() === 'yes') {
      const seedSuccess = await createSeedData(supabase)

      if (!seedSuccess) {
        colorLog('创建基础数据失败', 'red')
        process.exit(1)
      }
    }

    // 验证数据库
    const isValid = await validateDatabase(supabase)

    if (!isValid) {
      colorLog('数据库验证失败', 'red')
      process.exit(1)
    }

    colorLog('\n=== 数据库初始化完成！ ===', 'green')
    colorLog('数据库已成功初始化并验证', 'green')
  } catch (error) {
    colorLog(`初始化过程中发生错误：${error.message}`, 'red')
    console.error(error)
    process.exit(1)
  } finally {
    rl.close()
  }
}

// 处理未捕获的异常
process.on('uncaughtException', (error) => {
  colorLog(`未捕获的异常：${error.message}`, 'red')
  console.error(error)
  process.exit(1)
})

process.on('unhandledRejection', (reason, promise) => {
  colorLog(`未处理的 Promise 拒绝：${reason}`, 'red')
  console.error('Promise:', promise)
  process.exit(1)
})

// 运行主函数
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}
