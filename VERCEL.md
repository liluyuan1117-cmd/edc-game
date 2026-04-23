# 🚀 Vercel 部署指南

## 方法 1：一键导入（推荐）

### 步骤：

1. **打开 Vercel**
   ```
   https://vercel.com/new
   ```

2. **登录 GitHub 账号**

3. **Import Git Repository**
   - 搜索 `edc-game`
   - 点击 `Import`

4. **配置项目**
   - Framework Preset: `Other`
   - Root Directory: `./`
   - Build Command: `echo 'Static site - no build needed'`
   - Output Directory: `./`

5. **点击 Deploy**

6. **完成！**
   - 获得网址：`https://edc-game-xxx.vercel.app`
   - 自动 HTTPS
   - 自动更新（每次 git push 自动部署）

---

## 方法 2：命令行部署

### 安装 Vercel CLI
```bash
npm i -g vercel
```

### 部署
```bash
cd edc-game
vercel --prod
```

### 首次部署后
```bash
vercel --prod
```

---

## 🎯 Vercel vs GitHub Pages

| 特性 | Vercel | GitHub Pages |
|------|--------|--------------|
| 更新速度 | **即时** | 5-10 分钟延迟 |
| HTTPS | ✅ 自动 | ✅ 自动 |
| 自定义域名 | ✅ | ✅ |
| 自动部署 | ✅ | ✅ |
| 缓存控制 | ✅ 优秀 | ⚠️ 一般 |
| 全球 CDN | ✅ 快 | ⚠️ 较慢 |

---

## 📊 部署状态

- **GitHub Pages:** `https://liluyuan1117-cmd.github.io/edc-game/`
- **Vercel:** `https://edc-game-xxx.vercel.app` (部署后获得)

---

## 🔄 更新流程

```bash
# 1. 修改代码
git add .
git commit -m "更新内容"
git push

# 2. 自动部署
# GitHub: 自动更新（5-10 分钟）
# Vercel: 自动更新（即时）
```

---

## 💡 提示

- Vercel 部署后会自动生成预览网址
- 可以绑定自定义域名
- 支持环境变量配置
- 有免费的 Analytics
