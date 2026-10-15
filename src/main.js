import './style.css';
import './typography-preview.css';
import { profile as originalProfile, projects as originalProjects, caseSections as originalSections } from './content.js';
import { englishProfile, categories, sectionTitles, sectionHints, localiseProjects } from './english.js';
import { playground } from './playground.js';
import { catIdentity } from './identity.js';
import { siteCopy } from './site-copy.js';

const app = document.querySelector('#app');
const esc = (value = '') => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const asset = value => {
  const embedded = globalThis.__portfolioAssets?.[value];
  if (embedded) return embedded;
  return value?.startsWith('/assets/') ? import.meta.env.BASE_URL + value.slice(1) : value;
};
const safeUrl = value => {
  const url = asset(value || '');
  return /^(https?:\/\/|\/(?!\/)|\.\/assets\/|data:image\/(?:jpeg|png|webp);base64,)/.test(url) ? esc(url) : '';
};
let language = 'zh';
try { language = localStorage.getItem('portfolio-language') === 'en' ? 'en' : 'zh'; } catch {}
const t = (zh, en) => language === 'en' ? en : zh;
const copy = key => siteCopy[key][language];
const lines = key => copy(key).map(esc).join('<br>');
let filter = 'all';
let lastPath = '';
let activeNote = null;
let lockedNote = false;
let suppressNotePreview = false;
let noteResetUntil = 0;
let catTimer;
let catImageId = 0;
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
const route = () => {
  try {
    const url = new URL(location.hash.startsWith('#/') ? location.hash.slice(1) : '/', 'https://portfolio.local');
    return {path: url.pathname.replace(/\/$/, '') || '/', section: url.searchParams.get('section') || ''};
  } catch { return {path: '/404', section: ''}; }
};
const href = (path = '/', section = '') => `#${path}${section ? '?section=' + encodeURIComponent(section) : ''}`;
const getProjects = () => localiseProjects(originalProjects, language);
const getSections = () => originalSections.map((s, i) => language === 'en' ? {...s, title: sectionTitles[i], hint: sectionHints[i]} : s);

function cat(pose = 'sit', className = '', decorative = true) {
  const [x, y, width, height] = catIdentity.poses[pose].split(' ');
  const clip = `cat-crop-${++catImageId}`;
  return `<svg class="cat-art ${className}" viewBox="${catIdentity.poses[pose]}" ${decorative ? 'aria-hidden="true"' : `role="img" aria-label="${t('个人手绘猫猫 IP 的灰色网页版本', 'A muted web adaptation of my hand-drawn cat IP')}"`}><defs><clipPath id="${clip}"><rect x="${x}" y="${y}" width="${width}" height="${height}"/></clipPath></defs><image clip-path="url(#${clip})" href="${safeUrl(catIdentity.sprite)}" width="${catIdentity.width}" height="${catIdentity.height}"/></svg>`;
}
function doodle(kind = 'arrow') {
  const paths = {
    arrow: '<path d="M5 7q18 30 42 5M37 10l12 1-4 13"/>',
    clip: '<path d="M8 9 30 7l2 29-24 1zM12 9 9 1M27 8l3-7M9 36 5 49M30 35l7 12M12 15q12 4 16-2"/>',
    star: '<path d="m23 2 3 15 15-7-10 13 12 7-16-1-3 15-5-15-15 4 11-11-9-10 14 5z"/>',
  };
  return `<svg class="doodle ${kind}" viewBox="0 0 52 52" aria-hidden="true">${paths[kind]}</svg>`;
}
function icon(kind) {
  const paths = {
    email: '<rect x="3" y="5" width="26" height="20" rx="1"/><path d="m4 6 12 10L28 6"/>',
    resume: '<path d="M8 2h13l5 5v23H8zM20 2v6h6M12 14h10M12 19h10M12 24h7"/>',
    social: '<rect x="4" y="4" width="24" height="24" rx="6"/><circle cx="16" cy="16" r="6"/><circle cx="24" cy="8" r="1"/>',
  };
  return `<svg viewBox="0 0 32 32" aria-hidden="true">${paths[kind]}</svg>`;
}
function header(path) {
  return `<a class="skip-link" href="${href(path, 'main')}">${t('跳至主要内容','Skip to content')}</a><header class="site-header"><div class="header-inner"><a href="${href()}" class="wordmark" aria-label="${t('作品集首页','Portfolio home')}">${cat('logo')}<span>${esc(originalProfile.name || 'YING ZHANG')}</span></a><button class="mobile-menu" aria-expanded="false" aria-controls="main-navigation">${t('菜单','Menu')} <span aria-hidden="true">＋</span></button><nav id="main-navigation" class="main-nav" aria-label="${t('主导航','Main navigation')}"><div class="language-switch" role="group" aria-label="${t('切换语言','Change language')}"><button data-language="en" aria-pressed="${language === 'en'}" lang="en">EN</button><button data-language="zh" aria-pressed="${language === 'zh'}" lang="zh">中文</button></div><a href="${href('/', 'works')}" ${path.startsWith('/works') ? 'aria-current="page"' : ''}>WORKS</a><a href="${href(path === '/type-preview' ? '/type-preview' : '/', 'playground')}">PLAYGROUND</a><a href="${href('/about')}" ${path === '/about' ? 'aria-current="page"' : ''}>ABOUT</a><a href="${href('/', 'contact')}">CONTACT</a></nav></div></header>`;
}
function footer() {
  return `<footer class="site-footer page-width"><span>${t('设计与创作','Design & personal work')} · ${esc(originalProfile.name)}</span><span>© ${new Date().getFullYear()} · ${t('慢慢观察，持续生长。','Stay curious. Keep making.')}</span></footer>`;
}
function contact() {
  const email = originalProfile.email;
  const resume = safeUrl(originalProfile.resumeUrl);
  const socials = (originalProfile.socials || []).filter(item => safeUrl(item.url));
  return `<section id="contact" class="contact-section"><h2 class="outline-label">↗ Contact</h2><p>${t('欢迎聊聊设计、创作与新的可能。','Open to conversations about design, making and new possibilities.')}</p><div class="contact-links">${email ? `<a href="mailto:${esc(email)}">${icon('email')}<span>EMAIL</span></a>` : `<span class="contact-pending" aria-disabled="true">${icon('email')}<span>EMAIL</span><small>${t('待补充','To be added')}</small></span>`}${resume ? `<a href="${resume}" target="_blank" rel="noopener">${icon('resume')}<span>${t('简历','RESUME')}</span></a>` : `<span class="contact-pending" aria-disabled="true">${icon('resume')}<span>${t('简历','RESUME')}</span><small>${t('待补充','To be added')}</small></span>`}${socials.length ? socials.map(item => `<a href="${safeUrl(item.url)}" target="_blank" rel="noopener">${icon('social')}<span>${esc(language === 'en' ? item.labelEn || item.label : item.label)}</span></a>`).join('') : `<span class="contact-pending" aria-disabled="true">${icon('social')}<span>${t('社交平台','SOCIAL')}</span><small>${t('待补充','To be added')}</small></span>`}</div><a class="small-button back-top" href="${href(route().path, 'main')}">↗ ${t('返回顶部','Back to top')}</a></section>`;
}
function hero() {
  return `<section class="hero" aria-labelledby="hero-title"><div class="hero-copy"><div class="identity-tags"><span class="outline-label">${esc(copy('role'))}</span><div class="interest-wrap"><button class="outline-label interest-tag" aria-expanded="false" aria-controls="cat-preview"><span>${esc(copy('interest'))}</span></button><div id="cat-preview" class="interest-bubble" hidden><span class="bubble-label">${t('一些猫猫时刻','SOME CAT MOMENTS')}</span>${cat('sleep')}<svg viewBox="0 0 230 130" class="bubble-outline" aria-hidden="true"><path d="M10 65Q-8 18 35 22 25-1 63 11 88-4 110 11 150-4 153 23 200 2 211 40 244 64 213 86 218 122 166 113 136 140 108 117 61 135 47 111 9 122 10 87Z"/></svg></div></div></div><h1 id="hero-title">${lines('heroTitle')}</h1><p class="hero-bio">${lines('heroBio')}</p></div><div class="companion-wrap"><button class="cat-companion" aria-label="${t('摸摸猫猫','Say hello to the cat')}"><span class="cat-sitting">${cat('sit')}</span><span class="cat-sleeping">${cat('sleep')}</span></button><span class="hand-note">${t('陪你慢慢看。','take your time.')}</span><span class="cat-response" role="status" aria-live="polite"></span></div><a class="quiet-scroll" href="${href(route().path === '/type-preview' ? '/type-preview' : '/', route().path === '/type-preview' ? 'playground' : 'works')}">${t('往下看看','a little further down')} <span aria-hidden="true">↓</span></a></section>`;
}
function card(project) {
  const cover = safeUrl(project.cover);
  return `<article class="work-card"><a class="work-cover" href="${href('/works/' + project.slug)}" aria-label="${esc(t('查看案例：','View case: ') + project.title)}">${cover ? `<img src="${cover}" alt="${esc(language === 'en' ? project.title + ' — project artwork' : project.coverAlt || project.title)}" loading="lazy" width="1500" height="900">` : `<span class="cover-placeholder">${t('作品图版待补充','Artwork to be added')}</span>`}</a><h3><a href="${href('/works/' + project.slug)}">${esc(project.title)}</a></h3><p class="work-category">${esc(project.category)} / ${esc(project.status)}</p></article>`;
}
function worksSection() {
  const projects = getProjects();
  const actual = projects.filter(p => p.source && !p.research);
  const research = projects.filter(p => p.research && p.source);
  return `<section id="works" class="works-section"><div class="section-kicker"><h2 class="outline-label">Selected works</h2><a class="quiet-link" href="${href('/works')}">${t('全部项目','All projects')} ↗</a></div><div class="work-grid">${actual.map(card).join('')}</div>${research.length ? `<div class="research-index"><span class="outline-label">Research notes</span>${research.map(p => `<a href="${href('/works/' + p.slug)}"><span>${esc(p.title)}</span><small>${t('设计研究 / AI 与动物关怀','Design research / AI & animal welfare')}</small><span aria-hidden="true">↗</span></a>`).join('')}</div>` : ''}</section>`;
}
function noteImage(item, second = false) {
  const src = second ? item.image2 : item.image;
  if (!src) return '';
  if (src === 'cat' || src === 'cat-sleep') return cat(src === 'cat' ? 'sit' : 'sleep', '', false);
  return `<img src="${safeUrl(src)}" alt="${esc(item.title[language === 'en' ? 1 : 0])}" loading="lazy" width="1500" height="1000">`;
}
function board(items = playground) {
  return `<section id="playground" class="playground-section"><h2 class="outline-label">${t('一些兴趣，和没停止的思考','Things I make & keep thinking about')}</h2><p class="section-caption">${t('个人手绘与作品细节摘录。点开一张，慢慢看。','Personal drawings and details from my work. Open a little story.')}</p><div class="scrapbook" data-state="overview" aria-label="${t('交互作品拼贴','Interactive creative notebook')}"><div class="board-guide" aria-hidden="true"><span>01 / ${t('小小的观察','little observations')}</span>${doodle('arrow')}</div>${items.map((item, index) => `<button class="paper-note note-${index}" data-note="${item.id}" aria-pressed="false" aria-controls="note-story"><span class="paper-photo">${noteImage(item)}<span class="second-photo">${noteImage(item, true)}</span></span><span class="note-caption">${esc(item.title[language === 'en' ? 1 : 0])}</span>${index === 0 || index === 2 ? doodle('clip') : ''}</button>`).join('')}<aside id="note-story" class="note-story" aria-live="polite" aria-atomic="true" hidden></aside><button class="close-note small-button" aria-label="${t('关闭，返回拼贴总览','Close and return to collage')}" hidden>× ${t('返回总览','Overview')}</button><div class="board-cat" aria-hidden="true">${cat('sleep')}</div><span class="board-footnote" aria-hidden="true">${t('片段、草图，以及一些小事。','Fragments, sketches & small things.')}</span></div><p class="interaction-hint">${t('悬停或聚焦预览 · 点击固定展开 · Esc 返回','Hover or focus to preview · Click to keep open · Esc to return')}</p></section>`;
}
function home() {
  return `<main id="main" class="page-width" tabindex="-1">${hero()}${worksSection()}${board()}${contact()}</main>`;
}
function typographyPreview() {
  return `<main id="main" class="page-width type-preview" tabindex="-1"><aside class="type-preview-notice"><span>${t('旧铅字方向 · 局部候选预览','Letterpress direction · a local type study')}</span><a class="quiet-link" href="${href()}">${t('对照当前版本','Compare with the current site')} ↗</a></aside>${hero()}${board(playground.slice(0,2))}<p class="type-preview-end">${t('中文标题：汇文明朝体（原生磨损字形，Public Domain / CC0）；英文：Special Elite（Apache 2.0）。正文：Noto Sans；猫猫旁注：小赖字体。未加阴影、模糊或纹理滤镜，此候选尚未应用到全站。','Chinese: Huiwen Mincho (native worn outlines, Public Domain / CC0). English: Special Elite (Apache 2.0). Body: Noto Sans. Cat note: Xiaolai. No shadow, blur or texture filters; this candidate is not applied across the site.')}</p></main>`;
}
function worksPage() {
  const projects = getProjects();
  const cats = [...new Set(originalProjects.map(p => p.category))];
  const matches = project => filter === 'all' || originalProjects.find(p => p.slug === project.slug)?.category === filter;
  const available = projects.filter(p => p.source && matches(p));
  const planned = projects.filter(p => !p.source && matches(p));
  return `<main id="main" class="page-width" tabindex="-1"><section class="page-intro"><a class="quiet-link" href="${href('/', 'works')}">← ${t('返回首页','Back home')}</a><h1>${t('项目与探索','Work & exploration')}</h1><p>${t('从问题、过程到产出。持续整理，也持续生长。','Problems, processes and outcomes. An evolving collection.')}</p></section><div class="filters" role="group" aria-label="${t('项目分类','Project categories')}"><button data-filter="all" aria-pressed="${filter === 'all'}">${t('全部','All')}</button>${cats.map(c => `<button data-filter="${esc(c)}" aria-pressed="${filter === c}">${esc(language === 'en' ? categories[c] : c)}</button>`).join('')}</div><p class="filter-result" role="status">${t('当前展示','Showing')} ${available.length} ${t('个已有案例','documented projects')}</p><div class="work-grid">${available.map(card).join('')}</div>${planned.length ? `<details class="planned-projects"><summary>${t('还在整理的项目方向','Directions still taking shape')} <span>(${planned.length})</span></summary><p>${t('以下为可扩展框架，不作为已完成案例。','These are extensible frameworks, not completed case studies.')}</p>${planned.map(p => `<a href="${href('/works/' + p.slug)}">${esc(p.title)} <span>↗</span></a>`).join('')}</details>` : ''}${!available.length && !planned.length ? `<p>${t('这个分类还没有项目。','No projects in this category yet.')}</p>` : ''}${contact()}</main>`;
}
function detail(slug) {
  const projects = getProjects();
  const project = projects.find(p => p.slug === slug);
  if (!project) return notFound();
  const sections = getSections();
  const related = projects.filter(p => p.source);
  const next = related[(related.findIndex(p => p.slug === slug) + 1) % related.length];
  return `<main id="main" class="page-width case-page" tabindex="-1"><section class="case-intro"><a class="quiet-link" href="${href('/works')}">← ${t('全部项目','All projects')}</a><p class="case-category">${esc(project.category)} / ${esc(project.status)}</p><h1>${esc(project.title)}</h1><p class="case-client">${esc(project.client)}</p><p class="case-summary">${esc(project.summary)}</p><dl class="case-facts">${[[t('我的角色','My role'),project.role],[t('时间','Year'),project.year],[t('项目周期','Duration'),project.duration]].map(([key,value]) => `<div><dt>${key}</dt><dd>${esc(value || t('待补充','To be added'))}</dd></div>`).join('')}</dl></section><div class="case-cover">${project.cover ? `<img src="${safeUrl(project.cover)}" alt="${esc(language === 'en' ? project.title : project.coverAlt)}" width="1500" height="900">` : `<span class="cover-placeholder">${t('图版待补充','Artwork to be added')}</span>`}</div><div class="case-layout"><aside class="case-toc"><nav aria-label="${t('案例目录','Case contents')}">${sections.map((s,i) => `<a href="${href('/works/' + slug, s.id)}"><span>${String(i + 1).padStart(2,'0')}</span>${esc(s.title)}</a>`).join('')}</nav></aside><div class="case-body"><p class="evidence-note">${project.source ? t('依据已提供资料整理。团队方案、假设指标与已实现结果分别标注；缺失信息保留待补充。','Based on supplied documents. Team concepts, hypothetical metrics and achieved outcomes are distinguished; missing information stays open.') : t('这是待完善的案例框架，不代表项目已经完成。','This is a framework to develop, not a claim of completed work.')}</p>${sections.map((section, i) => {
    const value = project.sections[section.id];
    const filled = value?.text || value?.images?.length;
    return `<section class="case-section" id="${section.id}"><p class="section-number">${String(i+1).padStart(2,'0')} / ${section.id.toUpperCase()}</p><h2>${esc(section.title)}</h2>${filled ? `${value.text ? `<p class="case-text">${esc(value.text)}</p>` : ''}${(value.images || []).map(img => `<figure><div class="figure-art"><img src="${safeUrl(img.src)}" alt="${esc(img.alt)}" loading="lazy" width="1500" height="900"></div><figcaption>${esc(img.caption)}</figcaption></figure>`).join('')}` : `<div class="placeholder"><span>＋ ${t('待补充','To be added')}</span><p>${esc(section.hint)}</p></div>`}</section>`;
  }).join('')}</div></div>${next && next.slug !== slug ? `<a class="next-project" href="${href('/works/' + next.slug)}"><small>${t('下一个项目','Next project')}</small><span>${esc(next.title)} ↗</span></a>` : ''}${contact()}</main>`;
}
function historyRows(items, label, fallback) {
  const text = items.map(item => {
    const row = language === 'en' && item.en ? {...item, ...item.en} : item;
    return [row.period, row.title, row.description].filter(Boolean).map(esc).join(' · ');
  }).join('<br>');
  return `<p><span>${label}</span>${text || fallback}</p>`;
}
function about() {
  const profile = language === 'en' ? {...originalProfile, ...englishProfile} : originalProfile;
  return `<main id="main" class="page-width about-page" tabindex="-1"><section class="about-layout"><figure class="about-picture">${cat('sit','',false)}<figcaption>${t('个人手绘 IP / 生活照片待补充','Personal cat drawing / life photo to be added')}</figcaption></figure><div class="about-copy"><h1>${lines('aboutTitle')}</h1>${copy('aboutParagraphs').map(paragraph => `<p>${esc(paragraph)}</p>`).join('')}<a class="small-button" href="${href('/', 'contact')}">↗ ${t('联系我','Contact')}</a></div></section><section class="about-notes"><h2 class="outline-label">${t('实践的几个侧面','A few threads in my practice')}</h2><div class="practice-timeline"><div>${cat('logo')}<strong>${t('内容与沟通','Content & conversation')}</strong><span>${t('园艺 / 活动 / 医生内容','Garden / campaigns / expert content')}</span></div><div><span class="timeline-mark">↗</span><strong>${t('系统与服务','Systems & services')}</strong><span>UAL × IBM · Loopy</span></div><div><span class="timeline-mark">${doodle('star')}</span><strong>${t('研究与判断','Research & judgement')}</strong><span>Who Shapes the Post?</span></div></div><div class="personal-details">${historyRows(profile.education,t('教育背景','Education'),t('完整学校、专业与时间待补充。','Full institution, programme and dates to be added.'))}${historyRows(profile.experience,t('工作经历','Experience'),t('完整任职与时间待补充，已提供实践见案例。','Full roles and dates to be added; documented practice is shown in the cases.'))}</div><div class="skill-line">${profile.skills.map(s => `<span>${esc(s)}</span>`).join('')}</div></section>${contact()}</main>`;
}
function notFound() {
  return `<main id="main" class="page-width not-found" tabindex="-1"><span class="outline-label">404</span><h1>${t('这页还没被画出来。','This page has not been drawn yet.')}</h1><p>${t('去看看已经整理好的作品吧。','Have a look at the work already collected here.')}</p><a class="small-button" href="${href('/works')}">← ${t('返回作品','Back to work')}</a></main>`;
}
function render({preserveScroll = false} = {}) {
  const current = route();
  const y = scrollY;
  const pathChanged = current.path !== lastPath;
  let content;
  if (current.path === '/') content = home();
  else if (current.path === '/type-preview') content = typographyPreview();
  else if (current.path === '/works') content = worksPage();
  else if (current.path === '/about') content = about();
  else if (/^\/works\/[^/]+$/.test(current.path)) content = detail(current.path.split('/')[2]);
  else content = notFound();
  document.documentElement.lang = language === 'en' ? 'en' : 'zh-CN';
  document.body.classList.toggle('type-preview-active',current.path === '/type-preview');
  const project = getProjects().find(p => current.path === '/works/' + p.slug);
  document.title = `${project?.title || (current.path === '/type-preview' ? t('字体预览','Typography study') : current.path === '/about' ? t('关于','About') : current.path === '/works' ? t('作品','Work') : t('作品与观察','Work & observations'))} · ${originalProfile.name}`;
  app.innerHTML = header(current.path) + content + footer();
  bindBoard();
  bindInterest();
  if (activeNote && (current.path === '/' || current.path === '/type-preview')) setNote(activeNote, lockedNote);
  requestAnimationFrame(() => {
    if (preserveScroll) window.scrollTo(0,y);
    else if (current.section) document.getElementById(current.section)?.scrollIntoView();
    else window.scrollTo(0,0);
    if (pathChanged && !current.section && lastPath) document.querySelector('#main')?.focus({preventScroll:true});
    lastPath = current.path;
  });
}
function setNote(id, lock = false) {
  const element = document.querySelector('.scrapbook');
  const item = playground.find(p => p.id === id);
  if (!element || !item) return;
  activeNote = id;
  lockedNote = lock;
  element.dataset.state = 'focused';
  element.dataset.locked = String(lock);
  element.querySelectorAll('[data-note]').forEach(note => {
    const selected = note.dataset.note === id;
    note.classList.toggle('selected',selected);
    note.classList.toggle('has-second',selected && !!item.image2);
    note.setAttribute('aria-pressed',String(selected && lock));
    note.tabIndex = selected ? 0 : -1;
  });
  const story = element.querySelector('.note-story');
  const index = language === 'en' ? 1 : 0;
  story.hidden = false;
  story.innerHTML = `<p class="focus-type">${t('创作片段','A creative fragment')} / ${lock ? t('已固定','Pinned') : t('预览中','Preview')}</p><h3>${esc(item.title[index])}</h3><p class="note-question">${esc(item.question[index])}</p><p>${esc(item.description[index])}</p><small>${esc(item.note[index])}</small>`;
  element.querySelector('.close-note').hidden = false;
}
function clearNote(restoreFocus = false) {
  const element = document.querySelector('.scrapbook');
  const previous = activeNote;
  activeNote = null; lockedNote = false;
  noteResetUntil = performance.now() + 300;
  if (!element) return;
  element.dataset.state = 'overview';
  element.dataset.locked = 'false';
  element.querySelectorAll('[data-note]').forEach(note => {
    note.classList.remove('selected','has-second');note.setAttribute('aria-pressed','false');note.tabIndex = 0;
  });
  element.querySelector('.note-story').hidden = true;
  element.querySelector('.close-note').hidden = true;
  if (restoreFocus && previous) {
    suppressNotePreview = true;
    element.querySelector(`[data-note="${previous}"]`)?.focus({preventScroll:true});
    suppressNotePreview = false;
  }
}
function bindBoard() {
  const board = document.querySelector('.scrapbook');
  if (!board) return;
  board.querySelectorAll('[data-note]').forEach(note => {
    // Only actual pointer motion previews a note. Scrolling a photo underneath
    // a stationary pointer must not unexpectedly hide the rest of the collage.
    note.addEventListener('pointermove', () => {
      if (finePointer.matches && !lockedNote && !suppressNotePreview && performance.now() > noteResetUntil && activeNote !== note.dataset.note) setNote(note.dataset.note);
    });
    note.addEventListener('focus', () => { if (!lockedNote && !suppressNotePreview) setNote(note.dataset.note); });
  });
  board.addEventListener('pointerleave', () => { if (!lockedNote && !board.contains(document.activeElement)) clearNote(); });
  board.addEventListener('focusout', event => { if (!lockedNote && !board.contains(event.relatedTarget)) clearNote(); });
}
function bindInterest() {
  const wrap = document.querySelector('.interest-wrap');
  if (!wrap) return;
  const button = wrap.querySelector('button');
  const bubble = wrap.querySelector('.interest-bubble');
  const open = value => { button.setAttribute('aria-expanded',String(value));bubble.hidden = !value; };
  wrap.addEventListener('pointerenter', () => { if (finePointer.matches) open(true); });
  wrap.addEventListener('pointerleave', () => { if (!wrap.contains(document.activeElement)) open(false); });
  wrap.addEventListener('focusin', () => open(true));
  wrap.addEventListener('focusout', event => { if (!wrap.contains(event.relatedTarget)) open(false); });
  button.addEventListener('click', () => open(button.getAttribute('aria-expanded') !== 'true'));
}
function respondToCat() {
  const button = document.querySelector('.cat-companion');
  if (!button) return;
  clearTimeout(catTimer);
  button.classList.add('is-resting');
  const message = document.querySelector('.cat-response');
  message.textContent = t('喵。慢慢看，不着急。','Meow. Take your time.');
  catTimer = setTimeout(() => { button.classList.remove('is-resting');message.textContent = ''; },1500);
}

document.addEventListener('click', event => {
  const locale = event.target.closest('[data-language]');
  if (locale) {
    language = locale.dataset.language;
    try { localStorage.setItem('portfolio-language',language); } catch {}
    render({preserveScroll:true});
    document.querySelector(`[data-language="${language}"]`)?.focus({preventScroll:true});
    return;
  }
  const category = event.target.closest('[data-filter]');
  if (category) {
    filter = category.dataset.filter;render({preserveScroll:true});
    document.querySelector(`[data-filter="${CSS.escape(filter)}"]`)?.focus({preventScroll:true});return;
  }
  const menu = event.target.closest('.mobile-menu');
  if (menu) { const expanded = menu.getAttribute('aria-expanded') !== 'true';menu.setAttribute('aria-expanded',String(expanded));document.querySelector('.main-nav').classList.toggle('is-open',expanded);return; }
  const note = event.target.closest('[data-note]');
  if (note) { setNote(note.dataset.note,true);return; }
  if (event.target.closest('.close-note')) { clearNote(true);return; }
  if (event.target.closest('.cat-companion')) respondToCat();
  if (event.target.closest('[data-skip-intro]')) document.querySelector('.intro')?.remove();
  if (event.target.closest('.main-nav a')) { document.querySelector('.main-nav')?.classList.remove('is-open');document.querySelector('.mobile-menu')?.setAttribute('aria-expanded','false'); }
});
document.addEventListener('keydown', event => {
  if (event.key !== 'Escape') return;
  if (activeNote) clearNote(true);
  const interest = document.querySelector('.interest-tag');
  if (interest) { interest.setAttribute('aria-expanded','false');document.querySelector('.interest-bubble').hidden = true; }
  document.querySelector('.main-nav')?.classList.remove('is-open');document.querySelector('.mobile-menu')?.setAttribute('aria-expanded','false');
  document.querySelector('.intro')?.remove();
});
window.addEventListener('hashchange', () => {
  const current = route();
  if (current.path === lastPath && current.section) {
    document.getElementById(current.section)?.scrollIntoView();
    return;
  }
  if (current.path !== lastPath) { activeNote = null;lockedNote = false; }
  render();
});

function addIntro() {
  if (reducedMotion.matches || route().path !== '/' || route().section) return;
  const intro = document.createElement('div');intro.className = 'intro';
  intro.innerHTML = `<div>${cat('logo')}<span>${t('一些作品，一些观察。','Work, observations & a little curiosity.')}</span></div><button data-skip-intro>${t('跳过','Skip')} ↗</button>`;
  document.body.append(intro);
  setTimeout(() => intro.classList.add('is-leaving'),650);
  setTimeout(() => intro.remove(),1000);
}
function addPixelTrail() {
  const layer = document.createElement('div');layer.className = 'pixel-layer';layer.setAttribute('aria-hidden','true');
  layer.innerHTML = Array.from({length:8}, () => '<i></i>').join('');document.body.append(layer);
  const pixels = [...layer.children];let position = 0;let last = 0;
  window.addEventListener('pointermove', event => {
    if (event.pointerType === 'touch' || !finePointer.matches || reducedMotion.matches || performance.now() - last < 35) return;
    last = performance.now();const pixel = pixels[position++ % pixels.length];
    pixel.classList.remove('is-visible');pixel.style.left = `${event.clientX + 8}px`;pixel.style.top = `${event.clientY + 9}px`;
    void pixel.offsetWidth;pixel.classList.add('is-visible');
  },{passive:true});
  reducedMotion.addEventListener('change', () => { if (reducedMotion.matches) pixels.forEach(p => p.classList.remove('is-visible')); });
}
render();
addIntro();
addPixelTrail();
