import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 创建简单的 SVG 图标
const svgIcon = `<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="512" height="512" rx="64" fill="#3B82F6"/>
<path d="M256 128C185.3 128 128 185.3 128 256C128 326.7 185.3 384 256 384C326.7 384 384 326.7 384 256C384 185.3 326.7 128 256 128ZM256 352C205.5 352 164.8 311.5 164.8 261.2C164.8 210.9 205.5 170.4 256 170.4C306.5 170.4 347.2 210.9 347.2 261.2C347.2 311.5 306.5 352 256 352Z" fill="white"/>
<path d="M256 64C150 64 64 150 64 256C64 362 150 448 256 448C362 448 448 362 448 256C448 150 362 64 256 64ZM256 416C173.2 416 105.6 348.8 105.6 266.4C105.6 184 173.2 116.8 256 116.8C338.8 116.8 406.4 184 406.4 266.4C406.4 348.8 338.8 416 256 416Z" fill="white"/>
</svg>`

// 确保目录存在
const publicDir = path.join(__dirname, '../public')
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true })
}

// 写入 SVG 文件
fs.writeFileSync(path.join(publicDir, 'pwa-icon.svg'), svgIcon)

console.log('PWA icons generated successfully!')
console.log('Note: For production, you should replace these with proper icons.')
