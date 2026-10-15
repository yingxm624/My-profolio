# Ying · 作品与观察

本轮按用户提供的《网站风格复刻_AI完整指令》与 34 秒视频重新搭建：奶油纸色、蓝紫色单色界面、小比例个人猫猫 IP、两列正式作品和可交互的方格纸拼贴。没有沿用上一版的粗黑标题和橙色视觉。

## 直接打开

### GitHub Pages

部署工作流位于 `.github/workflows/pages.yml`。启用仓库的 GitHub Pages（Source 选择 GitHub Actions）后，推送到 `main` 会自动安装锁定依赖、运行内容测试、构建并发布 `dist/`。

预期站点地址为 `https://yingxm624.github.io/My-profolio/`；是否可用以 Actions 部署结果和实际访问为准。无需提交 `node_modules`、生成的离线 HTML 或原始 PDF。

### 离线版本

下载交付目录中的 **Ying-Portfolio-v2.html**，在电脑上用 Chrome、Edge 或 Safari 打开。它是自包含网页，脚本、样式、案例图版与猫猫全部内嵌，不需要安装依赖或启动服务。

手机请用浏览器打开，而不是系统文档预览器。压缩包中的 `source/index.html` 是开发入口，`site/index.html` 是部署入口，都不应替代根目录的自包含 HTML。

## 本地开发与验证

需要 Node.js 20.19+ / 22.12+（当前验证为 Node 24）和 npm。

```sh
npm ci
npm run dev -- --port 5173
npm test
npm run test:browser
```

`npm run test:browser` 会构建站点、生成离线版、启动临时本地静态服务器并运行浏览器交互检查。需要 Chromium；云环境已有 `/usr/bin/chromium`。其他机器可以运行 `npx playwright install chromium`，或者设置 `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` 指向本机 Chromium。

```sh
npm run build
npm run preview -- --port 4173
npm run export:offline
```

导出默认写入仓库的同级目录 `portfolio-delivery/`，可通过 `PORTFOLIO_OUTPUT_DIR` 修改。浏览器测试截图写入该目录的 `v2/`。

## 页面与交互

### 字体方向预览

`#/type-preview` 是独立预览，仅展示首屏与两张 Playground 拼贴。当前首页、完整作品和 About 不应用该字体方案。

标题已按新参考改为原生旧铅字候选：中文为特里王的汇文明朝体（使用 bosswnx 全角标点修正版，字体元数据 Public Domain，仓库 CC0）；英文为 Special Elite（Apache 2.0）。不是用滤镜模拟纹理，也未声称识别出参考图的确切字体。标题按真实文案缩小并收紧行距，仅用于首屏。正文与操作为 Noto Sans CJK SC；小赖手写仅保留在猫猫旁注，照片说明和 Playground 标题改回无衬线，减少字体竞争。配色、主站和交互保留。

预览样式在 `src/typography-preview.css`；WOFF2 随站点托管，无外部字体请求。来源、作者、输入文件校验与许可在 `src/fonts/PRINT-PROVENANCE.json` 及对应许可文件。标题子集按 `src/site-copy.js` 的真实中英文首屏文案生成，缺字会中断；修改标题后用完整授权字体运行 `scripts/subset-print-fonts.py --chinese … --latin …`，运行需要 fonttools 和 brotli。正文与旁注子集仍由 `scripts/subset-preview-fonts.py` 维护。普通 npm 构建不需要 Python。

- `#/`：首屏、两列真实作品、研究入口、Playground 与 Contact。
- `#/?section=works` / `playground` / `contact`：页内定位。
- `#/works`：完整作品列表与分类；未完成方向在折叠区保留案例框架。
- `#/works/:slug`：八阶段案例模板。
- `#/about`：个人介绍、手绘 IP、实践线索、教育 / 工作与技能。

所有版本统一采用哈希路由，直接刷新、前进与后退无需托管平台配置 SPA 回退。构建使用相对资源路径，可部署在静态托管目录中。

Playground 支持桌面指针移动预览、键盘 focus 预览、点击 / Enter 固定、关闭或 Esc 恢复总览。介绍区域不会因鼠标从照片移向文字而闪退；静止鼠标下方滚过的照片不会自动展开。手机支持点开和关闭。

中英文会切换文案、项目、案例、说明与缺失内容提示，语言偏好保存在本机；不会修改 PDF 图片里的原文字。提供可跳过的约 1 秒开场、兴趣气泡、猫猫坐卧回应及少量短暂像素尾迹。`prefers-reduced-motion` 下关闭装饰动画，所有功能仍保留。

## 内容如何替换

| 文件 | 维护内容 |
| --- | --- |
| `src/site-copy.js` | 首屏身份标签、主张、简介、About 中英文正文 |
| `src/content.js` | 个人姓名、联系方式、教育 / 工作、项目与中文案例 |
| `src/english.js` | 项目、分类、案例正文的英文版本 |
| `src/playground.js` | 拼贴图片、标题、问题、介绍与来源说明 |
| `src/identity.js` | 猫猫素材路径、画布尺寸与三个姿态视窗 |
| `src/style.css` | 集中的颜色、宽度、间距、响应式与动效 |

### 新增案例

在 `projects` 数组中复制对象，更换唯一 `slug`。数量不限，分类自动生成。提供 `source` 时进入正式作品索引；没有资料来源的对象保留在“还在整理的项目方向”中。研究项目用 `research: true` 单独呈现。新增项目时同步补充 `englishProjects`，语言完整性测试会提示遗漏。

图版放在 `public/assets/`，引用为 `/assets/name.jpg`。案例模块对应 `context`、`challenge`、`role`、`research`、`process`、`solution`、`outcome`、`reflection`，未提供的模块显示占位：

```js
sections: {
  context: {
    text: '真实项目背景。',
    images: [
      { src: '/assets/context.jpg', alt: '具体的图片说明', caption: '图注与来源' }
    ]
  }
}
```

教育与经历对象格式为 `{ period, title, description, en: { period, title, description } }`；`en` 可选，用于对应英文内容。社交链接配置为 `profile.socials: [{ label, labelEn, url }]`。缺少邮箱、简历与社交地址时，显示不可点击的待补充状态，不跳到参考作者账号。

正文自动转义，不接受任意 HTML。图片不拉伸，案例大图保留原比例；拼贴只展示已提供作品的细节，不冒充新增项目。

## 素材与边界

原始 PDF、TXT 和视频不在网站中改写或覆盖。猫猫为根据用户三张 IP 图制作的灰色透明网页衍生图，独立保存为 `public/assets/cat-ip-gray.png`；可以继续用原始透明素材校准细节。

案例只使用已读取的三份 PDF。Loopy 明确为团队概念；假设商业指标不是已实现业绩。研究原型的预期影响不当作验证结果。`service design .pdf` 仍因 32 MiB 传输上限未读取。个人生活照、完整履历、邮箱、简历和社交地址尚待提供。

参考视频的浏览器栏、渐变边框、小红书水印、作者头像与录屏缩放均未加入网页。详细对照与验收记录见 `DESIGN-NOTES.md`。
