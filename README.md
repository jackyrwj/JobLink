# 🚀 JobLink - 智能求职助手

JobLink 是一个现代化的求职平台，帮助用户找到理想的工作机会。通过智能匹配和个性化推荐，让求职过程更加高效和愉快。

## ✨ 在线体验

🌐 访问地址：[job.raowenjie.xyz](https://job.raowenjie.xyz)

## 📸 项目预览

![JobLink 首页预览](public/images/screenshots/preview.png)

## 🎯 功能特点

- 🤖 **智能职位匹配** - 基于用户偏好和技能进行精准推荐
- ⚡ **实时职位更新** - 第一时间获取最新职位信息
- 🎨 **个性化体验** - 定制化的求职服务
- 🏢 **公司详情展示** - 深入了解目标公司
- 📊 **职位分类浏览** - 多维度职位筛选
- 🎉 **互动式界面** - 有趣的求职体验

## 🛠️ 技术栈

- ⚛️ **Next.js** - React 框架，提供 SSR 和静态生成
- 📘 **TypeScript** - 类型安全的 JavaScript 超集
- 🎨 **Tailwind CSS** - 实用优先的 CSS 框架
- 🎭 **Framer Motion** - 流畅的动画效果
- 🔍 **ESLint** - 代码质量检查
- 💅 **Prettier** - 代码格式化

## 🚀 本地开发

1. 克隆仓库
```bash
git clone https://github.com/jackyrwj/JobLink.git
```

2. 安装依赖
```bash
cd JobLink
npm install
```

3. 运行开发服务器
```bash
npm run dev
```

4. 打开 [http://localhost:3000](http://localhost:3000) 查看效果

## 📦 项目结构

```
JobLink/
├── public/          # 静态资源
├── src/
│   ├── components/  # React 组件
│   ├── pages/       # 页面文件
│   ├── styles/      # 样式文件
│   └── types/       # TypeScript 类型定义
├── package.json     # 项目配置
└── README.md        # 项目说明
```

## 🌐 部署

本项目使用 Vercel 进行部署。每次推送到 main 分支时，Vercel 会自动部署最新版本。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📝 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件 

## 项目进展更新

### 最新完成工作 (YYYY-MM-DD)

-   **实现职位详情页**: 成功实现了职位详情页 (`/jobs/position/detail/[jobUrlId]`)，能够根据唯一的职位 ID (从 URL 中提取的数字部分 `jobUrlId`) 从数据库中查询并展示完整的职位信息。
-   **优化职位 ID 处理**:
    -   在数据库中为 `Job` 模型添加了 `jobUrlId` 字段，用于存储从职位 URL 中提取的数字 ID。
    -   创建了一次性脚本 (`src/scripts/populateJobUrlId.ts`) 从现有数据的 URL 中提取 `jobUrlId` 并填充到数据库中。
    -   修改了 `/api/jobs/[id].ts` 接口，使其现在根据 `jobUrlId` 字段查询职位详情。
    -   修改了职位描述选择页 (`/jobs/position/[departmentName]`) 的跳转逻辑，使用 `jobUrlId` 作为参数跳转到详情页。
-   **完善职位列表页**: 修改了职位描述选择页的逻辑，使其根据部门名称 (`departmentName`) 调用 API 获取职位列表，并展示职位描述作为选项。
-   **更新 API 接口**: `/api/jobs` 接口现在支持根据 `department` 字段筛选职位。
-   **更新爬虫**: 爬虫现在能够爬取更多职位类别，并为新爬取的数据填充 `jobUrlId`。

### 下一步计划 (YYYY-MM-DD)

-   **完善职位列表页 (UI/UX)**: 进一步优化 `/jobs/position/[departmentName]` 页面的UI和用户体验，使其更好地展示职位描述列表。
-   **数据库线上部署**: 将 PostgreSQL 数据库部署到线上服务，确保项目可以在生产环境中使用真实数据。
-   **持续优化爬虫**: 根据需要调整爬虫，以适应招聘网站的变化或抓取更多信息。