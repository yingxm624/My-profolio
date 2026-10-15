// 个人资料只在这里维护；空值会显示待补充状态，不会生成虚构经历。
export const profile = {
  name: 'YING ZHANG',
  positioning: '从理解真实需求，到设计有价值的体验。',
  introduction: '连接用户研究、服务设计与视觉传播，把真实问题转化为清晰、可用的体验。',
  email: '',
  resumeUrl: '',
  socials: [], // { label, labelEn, url } — only real supplied addresses
  education: [],
  experience: [],
  skills: ['用户研究', '体验设计', '服务设计', '产品设计', '内容策略', '跨团队协作'],
};

export const caseSections = [
  { id: 'context', title: '项目背景', hint: '补充项目发生的场景、服务对象，以及需要解决的真实问题。' },
  { id: 'challenge', title: '挑战与目标', hint: '说明核心挑战、设计目标与衡量成功的方式。' },
  { id: 'role', title: '我的角色', hint: '明确你的职责、参与阶段、团队分工与个人贡献。' },
  { id: 'research', title: '用户研究 / 分析', hint: '放入研究方法、关键观察和证据，说明洞察如何影响设计判断。' },
  { id: 'process', title: '设计过程', hint: '呈现从洞察到概念、验证与迭代的关键决策。' },
  { id: 'solution', title: '解决方案', hint: '展示方案如何回应问题，以及核心流程与体验。' },
  { id: 'outcome', title: '最终成果展示', hint: '补充真实产出、用户反馈或业务结果；尚未验证的效果请明确标注。' },
  { id: 'reflection', title: '项目总结', hint: '回顾设计价值、局限、学习与后续机会。' },
];

// 项目数组没有数量上限。复制一个对象、更换唯一 slug 即可新增案例。
// sections 的键对应 caseSections.id；缺少的模块自动呈现占位。
// 模块格式：{ text: '正文', images: [{ src: '/assets/file.webp', alt: '说明', caption: '图注' }] }
export const projects = [
  {
    slug: 'horticulture-experience', title: '让园艺体验更自然', client: '虞舜科技 / 园艺品牌',
    category: '用户体验', tags: ['商业项目', '用户研究', '服务流程'],
    summary: '从企业实际场景出发，梳理用户需求与服务体验的优化机会。',
    theme: 'garden', featured: true, status: '规划中', cover: '', coverAlt: '',
    year: '', duration: '', role: '', sections: {},
  },
  {
    slug: 'loopy', title: '让循环时尚连接起来', client: 'IBM Loopy / 循环时尚服务平台',
    category: '服务设计', tags: ['Service Design', 'UX Research', 'Platform Design'],
    summary: '围绕循环时尚，探索用户旅程、服务协作与平台体验。',
    theme: 'loopy', featured: true, status: '规划中', cover: '', coverAlt: '',
    year: '', duration: '', role: '', sections: {},
  },
  {
    slug: 'product-design', title: '从用户问题到产品体验', client: 'UX / UI 产品设计',
    category: '产品设计', tags: ['Product Design', 'UI Design'],
    summary: '预留用户流程、界面设计与原型验证的展示空间。',
    theme: 'product', featured: false, status: '规划中', cover: '', coverAlt: '',
    year: '', duration: '', role: '', sections: {},
  },
  {
    slug: 'digital-content', title: '建立品牌与用户的对话', client: '新媒体运营 / 数字内容',
    category: '数字内容', tags: ['Content Strategy', 'Brand Communication'],
    summary: '预留内容策划、用户沟通与数字传播的案例框架。',
    theme: 'content', featured: false, status: '规划中', cover: '', coverAlt: '',
    year: '', duration: '', role: '', sections: {},
  },
  {
    slug: 'pg-show', title: '从策划到现场的完整呈现', client: 'PG Show / 展览策划与落地',
    category: '展览策划', tags: ['Exhibition Design', 'Project Management'],
    summary: '呈现空间规划、团队协作、现场安装与展览落地过程。',
    theme: 'exhibition', featured: false, status: '规划中', cover: '', coverAlt: '',
    year: '', duration: '', role: '', sections: {},
  },
  {
    slug: 'graduation-research', title: '以研究拓展设计的边界', client: 'MA Graduation Research Project',
    category: '设计研究', tags: ['Design Research', 'Strategic Design'],
    summary: '独立预留研究问题、研究路径与阶段发现的展示空间。',
    theme: 'research', featured: false, research: true, status: '规划中', cover: '', coverAlt: '',
    year: '', duration: '', role: '', sections: {},
  },
];

// 以下内容提取自用户上传的 PDF。保留简短概要和真实图版，完整叙事仍可继续编辑。
const image = (name, alt, caption) => ({ src: `/assets/${name}.jpg`, alt, caption });
const update = (slug, values) => Object.assign(projects.find(p => p.slug === slug), values);

update('horticulture-experience', {
  title: '从花箱产品，到可搜索的生活场景',
  client: '浙江虞舜园艺科技有限公司 / 见几阳台花园造景设计',
  summary: '把内容研究、视觉表达与客户沟通连接起来，让真实需求回到下一轮内容中。',
  status: '已有案例 · 持续完善', cover: '/assets/garden-visual.jpg',
  coverAlt: '园艺账号已发布内容与植物组合信息图版',
  role: '账号内容运营 · 客户沟通 · 视觉制作',
  source: '内容运营与视觉传播.pdf，第 2–7 页',
  sections: {
    context: { text: '负责「见几阳台花园造景设计」账号从 0 到 1 的内容运营，同时承接客户咨询与私域销售沟通，确认购买意向并对接设计师。' },
    challenge: { text: '让花箱和园艺产品转化为用户可以搜索、理解和参考的生活场景，并把内容关注与后续客户沟通连接起来。' },
    role: { text: '账号研究与关键词筛选；Figma / AI 视觉产出与数据复盘；微信 / 企业微信客户承接；购买意向沟通与设计师对接。' },
    research: { text: '通过账号研究、关键词整理、评论与私信观察，以及客户咨询归纳用户关注点。正式用户研究的范围与方法仍待补充。' },
    process: { text: '内容研究 → 视觉制作与发布 → 反馈观察 → 客户沟通 → 需求归纳 → 下一轮选题。AI 协助信息整理和视觉生成，筛选、判断与沟通由我完成。', images: [image('garden-workflow', '内容、沟通与持续迭代的工作流程', '来源：内容运营与视觉传播，第 3 页')] },
    solution: { text: '用空间效果、植物组合与信息清单组织内容；在效果图之后补充名称和单株标注，降低理解门槛。', images: [image('garden-visual', '空间效果、植物组合和信息清单', '已提供的账号与视觉内容图版')] },
    outcome: { text: '资料记录：30 天新增粉丝 1,172，阶段总粉丝 1,433；另一个 7 天统计窗口记录观看 5.2 万、互动 3,513。以上属于不同统计口径，不合并计算，也不代表已验证的销售转化。', images: [image('garden-results', '园艺账号不同统计窗口的后台数据', '原 PDF 第 4 页；按资料截图的统计口径展示')] },
    reflection: { text: '把收藏、点赞和咨询作为下一轮内容测试的线索，继续补充适用光照、组合差异、养护步骤与阳台条件。商业转化数据与正式体验验证仍待补充。' },
  },
});

update('loopy', {
  title: 'Loopy：让循环材料更容易被连接', client: 'UAL × IBM / 团队服务设计项目',
  summary: '面向时尚中小企业的循环材料服务概念，连接材料采购、信任与可持续信息。',
  cover: '/assets/loopy-home.jpg', coverAlt: 'Loopy 团队方案中的三个移动端界面',
  status: '团队概念方案', source: 'Loopy循环时尚材料服务平台｜UAL × IBM团队项目.pdf',
  sections: {
    context: { text: '时尚中小企业在采购库存与二手材料时，面临成本、时间与供应不稳定的问题，也需要更透明的信息支持可持续表达。' },
    challenge: { text: '如何建立透明的协作网络，让时尚中小企业在不稳定的供应链中找到可靠材料与生产支持？' },
    role: { text: 'UAL × IBM 团队项目。此处呈现团队共同成果；个人职责、贡献范围与团队分工待补充。' },
    research: { text: '资料包含试点品牌分析、竞争环境与利益相关者地图，聚焦材料获取、供应链可靠性与透明度。研究样本与个人研究贡献仍待补充。' },
    process: { text: '用设计思维串联理解、定义、构思、原型与测试阶段，并将发现整理为用户旅程和服务蓝图。图中旅程是方案设计，不等同于真实用户测试结果。', images: [image('loopy-journey','Loopy 材料采购服务的设计用户旅程','原 PDF 第 16 页 · 方案旅程'),image('loopy-blueprint','Loopy 服务前台、后台与支持流程蓝图','原 PDF 第 17 页 · 团队服务蓝图')] },
    solution: { text: '平台概念连接材料库、材料推荐、样品申请、订单追踪和数字可持续信息；AI 推荐保留人工咨询与判断。', images: [image('loopy-home','Loopy 首页与材料发现界面','原 PDF 第 12 页 · 团队界面概念；界面内数据为原型示意')] },
    outcome: { text: '已提供产出包括品牌系统、移动端界面、用户旅程、服务蓝图和阶段路线图。资料中的业务规模、GMV、减废等指标为假设情景或参考品牌数据，不作为 Loopy 已实现的业绩。' },
    reflection: { text: '需要继续验证材料匹配效率、低起订量、信息可信度，以及 AI 偏差、数据隐私与运输带来的环境影响。' },
  },
});

update('digital-content', {
  title: '让活动内容成为可阅读的视觉体验', client: '爱奇艺校园 / 活动视觉与内容传播',
  summary: '从片单海报到公益长图，以信息层级连接活动主题、阅读节奏与多规格传播。',
  featured: true, status: '已有视觉作品', cover: '/assets/iqiyi-visual.jpg',
  coverAlt: '爱奇艺春节活动的海报与多城市宣传视觉',
  role: '视觉设计 · 版式编排 · 多规格适配', source: '内容运营与视觉传播.pdf，第 8–11 页',
  sections: {
    context: { text: '资料包含「桃厂放映厅」春节活动、祥云派对、科学护眼专题与校园食育项目的视觉内容。' },
    challenge: { text: '把活动片单、时间、地点与长图信息组织得更清晰，同时保持主题识别与不同传播规格的一致性。' },
    role: { text: '已提供作品涉及版式编排、信息层级与多规格适配；各活动的具体职责、协作方式与周期待补充。' },
    solution: { text: '春节活动用红金配色与节日纹样统一视觉，延展三片、四片和多城市版本；公益与校园专题则采用连续章节组织长图。', images: [image('iqiyi-visual','春节片单海报与宣传视觉延展','资料中的立牌为应用样机，不作为实际安装照片'),image('iqiyi-event','祥云派对海报、玩法长图与活动现场图版','来源：内容运营与视觉传播，第 9 页')] },
    outcome: { text: '现阶段展示可核实的视觉产出；曝光、活动参与与业务结果未提供，暂不填入。' },
  },
});

projects.push({
  slug: 'doctor-content', title: '让专业科普更容易理解', client: '医生 IP / 抖音内容运营',
  category: '数字内容', tags: ['账号运营','视频制作','信息设计'],
  summary: '用人物口播、关键字幕与图示组织科普信息，保持不同内容的账号识别。',
  featured: false, theme: 'content', status: '已有案例 · 持续完善',
  cover: '/assets/doctor-content.jpg', coverAlt: '医生科普账号内容组织与口播表达图版',
  role: '阶段性独立运营 / 参与拍摄与剪辑', year: '', duration: '',
  source: '内容运营与视觉传播.pdf，第 12–15 页',
  sections: {
    context: { text: '资料展示两个阶段性独立运营的医生账号，并包含其他医生账号中参与拍摄与剪辑的作品。' },
    role: { text: '宁旭医生、情小白医生按阶段性独立运营呈现；其他医生账号按参与拍摄与剪辑呈现，避免将团队工作全部归为个人贡献。' },
    solution: { text: '以图示引出问题、人物口播承接解释、字幕提示重点，并用动画或同屏演示补充场景。', images: [image('doctor-content','宁旭医生账号列表与单条视频表达拆解','来源：内容运营与视觉传播，第 13 页')] },
    outcome: { text: '现阶段先展示内容与视频制作成果。单条互动数据、账号累计数据和个人负责阶段需要保持独立口径，后续再补充完整说明。' },
  },
});

update('graduation-research', {
  title: 'Who Shapes the Post?', client: 'MA Graduation Research / 人、AI 与动物关怀',
  summary: '探索 AI 如何进入小型宠物品牌的内容工作流，让人的判断与动物需求更早被看见。',
  cover: '/assets/research-tools.jpg', coverAlt: 'AI 内容与真实动物拍摄的双路径关怀工具概念',
  status: '研究与原型 · 继续验证', year: '2026',
  source: 'Who Shapes the Post？（工作 .pdf',
  sections: {
    context: { text: '小型宠物品牌在有限人力与高频发布压力下使用 AI 生产内容，但人的判断与动物关怀往往较晚进入流程。' },
    challenge: { text: '让真实产品证据、人的创作判断与动物需要进入内容生成的起点，而非仅在发布前纠错。' },
    research: { text: '资料结合文献、定性研究、工作流映射与 AI 内容实验，观察 AI 的进入时点、责任分配与动物表征。完整方法与研究边界仍可继续补充。', images: [image('research-method','双钻石与行动研究的整体研究框架','来源：研究 PDF 第 7 页')] },
    process: { text: '从工作流 V1 发展到 V2 的动物关怀决策模块，将 AI 生成动物内容与真实动物拍摄分成两条路径。', images: [image('research-workflow','动物关怀决策模块的双路径工作流程','来源：研究 PDF 第 16 页')] },
    solution: { text: 'Welfare Prompt Cat 在 AI 生成前帮助确认条件；Animal Welfare Clapperboard 在真实拍摄前、中、后记录判断。', images: [image('research-tools','提示猫与动物关怀场记板的低保真设计','来源：研究 PDF 第 17 页 · 原型概念')] },
    outcome: { text: '已形成轻量工作流与工具原型。V2 的工作场景试验与长期影响仍待验证，预期价值不作为已实现的结果。' },
    reflection: { text: '研究具有情境性与探索性；动物需要主要通过人的观察、参与者叙述和文献理解，仍需进一步专业意见和真实工作场景验证。' },
  },
});
