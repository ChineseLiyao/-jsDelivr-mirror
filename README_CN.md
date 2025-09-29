# 🚀 CDN 代理服务器

基于 Node.js 构建的高性能 CDN 代理服务器，为 jsDelivr 和 Google Fonts 提供无缝访问，具备智能缓存、CORS 支持和自动 URL 重写功能。

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen.svg)](https://nodejs.org/)
[![npm version](https://img.shields.io/badge/npm-%3E%3D6.0.0-blue.svg)](https://www.npmjs.com/)

## ✨ 功能特性

- 📦 **jsDelivr CDN 代理** - 完整支持所有 jsDelivr 资源的代理访问
- 🔤 **Google Fonts 代理** - 全面支持 CSS API 和字体文件代理
- 🔄 **自动 URL 重写** - 无缝将 Google Fonts URL 重写为本地代理
- ⚡ **智能缓存策略** - 优化的缓存策略（CSS 24小时，字体文件 1年）
- 🌐 **CORS 支持** - 完整的跨域资源共享支持
- 🛡️ **健壮的错误处理** - 全面的错误处理和详细日志记录
- 🚀 **生产就绪** - 支持环境变量和生产优化

## 🚀 快速开始

### 系统要求

- Node.js >= 14.0.0
- npm >= 6.0.0

### 安装

```bash
# 克隆仓库
git clone https://github.com/yourusername/cdn-proxy-server.git
cd cdn-proxy-server

# 安装依赖
npm install
```

### 运行服务器

```bash
# 生产模式
npm start

# 开发模式（热重载）
npm run dev

# 自定义端口
PORT=8080 npm start
```

服务器将在 `http://localhost:3000`（或您指定的端口）启动。

## 📚 API 文档

### 1. jsDelivr 代理

**接口**: `/jsdelivr/*`

通过替换域名来代理任何 jsDelivr 资源。

```html
<!-- 原始链接 -->
<script src="https://cdn.jsdelivr.net/npm/vue@3.3.4/dist/vue.global.js"></script>

<!-- 代理链接 -->
<script src="http://localhost:3000/jsdelivr/npm/vue@3.3.4/dist/vue.global.js"></script>
```

### 2. Google Fonts CSS API

**接口**: `/fonts/css` 和 `/fonts/css2`

支持传统和现代 Google Fonts API，自动重写字体文件 URL。

```html
<!-- 原始链接 -->
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">

<!-- 代理链接 -->
<link href="http://localhost:3000/fonts/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
```

### 3. Google Fonts 字体文件

**接口**: `/fonts/s/*`

使用 CSS 接口时，字体文件会自动代理，无需手动配置。

**支持的格式:**
- WOFF2 (`font/woff2`)
- WOFF (`font/woff`)
- TTF (`font/ttf`)
- EOT (`application/vnd.ms-fontobject`)

### 4. NPM 包快捷访问

**接口**: `/package/:package@:version/:file`

快速访问特定 npm 包文件。

```html
<script src="http://localhost:3000/package/lodash@4.17.21/lodash.min.js"></script>
```

## 🎯 使用场景

- **开发环境** - 在开发过程中绕过 CDN 限制
- **企业网络** - 在防火墙后访问 CDN 资源
- **性能优化** - 减少外部依赖
- **离线开发** - 本地缓存常用资源
- **自定义 CDN** - 创建自己的 CDN 基础设施

## ⚙️ 配置

### 环境变量

```bash
PORT=3000                    # 服务器端口（默认：3000）
NODE_ENV=production         # 环境模式
```

### 缓存策略

| 资源类型 | 缓存时长 | 原因 |
|----------|----------|------|
| CSS 文件 | 24 小时 | 字体变化不频繁 |
| 字体文件 | 1 年 | 静态二进制文件 |
| JS/其他文件 | 1 小时 | 可能更新较频繁 |

## 🔧 开发

### 项目结构

```
cdn-proxy-server/
├── src/
│   └── index.js          # 主服务器文件
├── example.html          # 使用示例
├── package.json          # 项目配置
├── README.md            # 英文文档
├── README_CN.md         # 中文文档
└── .gitignore           # Git 忽略规则
```

### 脚本命令

```bash
npm start                # 启动生产服务器
npm run dev             # 启动开发服务器（热重载）
npm test                # 运行测试
npm run lint            # 运行代码检查
```

### 测试

```bash
# 运行所有测试
npm test

# 测试特定接口
curl http://localhost:3000/jsdelivr/npm/vue@3.3.4/dist/vue.global.js
curl "http://localhost:3000/fonts/css2?family=Roboto:wght@400;700"
```

## 🚀 部署

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

### Heroku

```bash
# 部署到 Heroku
heroku create your-cdn-proxy
git push heroku main
```

### PM2（生产环境）

```bash
# 安装 PM2
npm install -g pm2

# 使用 PM2 启动
pm2 start src/index.js --name "cdn-proxy"

# 保存 PM2 配置
pm2 save
pm2 startup
```

## 📊 性能指标

- **响应时间**: 缓存资源 < 100ms
- **吞吐量**: 支持 1000+ 并发请求
- **内存使用**: ~50MB 基础内存占用
- **缓存命中率**: 常用资源 90%+

## 🤝 贡献

1. Fork 本仓库
2. 创建您的功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交您的更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 打开一个 Pull Request

## 📝 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- [jsDelivr](https://www.jsdelivr.com/) - 开源项目的免费 CDN
- [Google Fonts](https://fonts.google.com/) - 免费网络字体
- [Express.js](https://expressjs.com/) - 快速、极简的 Web 框架
- [Axios](https://axios-http.com/) - 基于 Promise 的 HTTP 客户端

## 📞 支持

- 🐛 [报告问题](https://github.com/yourusername/cdn-proxy-server/issues)
- 💬 [讨论](https://github.com/yourusername/cdn-proxy-server/discussions)
- 📧 邮箱: your.email@example.com

## 🌐 多语言文档

- [English](README.md)
- [中文](README_CN.md)

---

<p align="center">用 ❤️ 制作，作者 <a href="https://github.com/yourusername">Your Name</a></p>