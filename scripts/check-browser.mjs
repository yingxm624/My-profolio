import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, stat, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { projects } from '../src/content.js';

const root = path.resolve('dist');
const basePath = '/My-profolio';
const output = process.env.PORTFOLIO_OUTPUT_DIR || path.resolve('..', 'portfolio-delivery');
const shots = path.join(output, 'v2');
await mkdir(shots, {recursive:true});
const mime = {'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.jpg':'image/jpeg','.jpeg':'image/jpeg','.png':'image/png'};
const server = createServer(async (request, response) => {
  try {
    const rawPath = decodeURIComponent(new URL(request.url,'http://localhost').pathname);
    if (!rawPath.startsWith(basePath + '/')) {response.writeHead(404);response.end();return;}
    const pathname = rawPath.slice(basePath.length);
    let file = pathname === '/offline.html' ? path.join(output,'Ying-Portfolio-v2.html') : path.resolve(root,'.'+pathname);
    if (pathname !== '/offline.html' && !file.startsWith(root + path.sep) && file !== root) {response.writeHead(403);response.end();return;}
    try {if ((await stat(file)).isDirectory()) file = path.join(file,'index.html');} catch {file = path.join(root,'index.html');}
    const body = await readFile(file);
    response.writeHead(200,{'Content-Type':mime[path.extname(file)] || 'application/octet-stream','Cache-Control':'no-store'});response.end(body);
  } catch {response.writeHead(500);response.end();}
});
await new Promise(resolve => server.listen(0,'127.0.0.1',resolve));
const origin = `http://127.0.0.1:${server.address().port}${basePath}`;
let browser;
const errors = [];
const results = [];
const documentedCount = projects.filter(p => p.source && !p.research).length;
function record(message) {results.push(message);console.log('PASS',message);}
async function screenshot(page, name, locator) {
  if (locator) await locator.screenshot({path:path.join(shots,name),animations:'disabled'});
  else await page.screenshot({path:path.join(shots,name),animations:'disabled'});
}
async function checkImages(page) {
  for (const image of await page.locator('img').all()) {
    await image.scrollIntoViewIfNeeded();
    await image.evaluate(img => img.decode());
    assert.ok(await image.evaluate(img => img.naturalWidth > 0));
  }
}
try {
  browser = await chromium.launch({headless:true,executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || (existsSync('/usr/bin/chromium') ? '/usr/bin/chromium' : undefined),args:['--no-sandbox']});
  const context = await browser.newContext({viewport:{width:1440,height:960}});
  const page = await context.newPage();page.on('pageerror',e => errors.push(e.message));
  await page.goto(origin + '/');
  await page.locator('.intro').waitFor({state:'detached'});
  assert.match(await page.locator('h1').textContent(),/从真实需求/);
  assert.equal(await page.locator('#works .work-card').count(),documentedCount);
  await screenshot(page,'01-首屏.png');
  await screenshot(page,'02-Works.png',page.locator('#works'));
  record('中文首屏、四个已有作品与独立研究入口');

  await page.locator('.interest-tag').hover();await page.locator('.interest-bubble').waitFor();
  assert.equal(await page.locator('.interest-tag').getAttribute('aria-expanded'),'true');
  await page.keyboard.press('Escape');assert.ok(await page.locator('.interest-bubble').isHidden());
  await page.locator('.cat-companion').click();assert.ok(await page.locator('.cat-companion').evaluate(el => el.classList.contains('is-resting')));
  assert.match(await page.locator('.cat-response').textContent(),/喵/);
  record('兴趣气泡、Esc 关闭与猫猫点击回应');

  await page.mouse.move(0,0);
  await page.locator('#playground').scrollIntoViewIfNeeded();await page.waitForTimeout(400);
  await screenshot(page,'03-拼贴总览.png',page.locator('#playground'));
  await page.locator('[data-note="cats"]').hover();await page.locator('.scrapbook[data-state="focused"]').waitFor();
  await page.locator('.note-story').hover();assert.equal(await page.locator('.scrapbook').getAttribute('data-state'),'focused');
  await page.mouse.move(0,0);await page.locator('.scrapbook[data-state="overview"]').waitFor();
  record('桌面 hover 预览、移动到介绍不闪退、离开拼贴恢复总览');

  await page.locator('[data-note="cats"]').click();await page.locator('.scrapbook[data-locked="true"]').waitFor();
  await page.mouse.move(0,0);assert.equal(await page.locator('.scrapbook').getAttribute('data-state'),'focused');
  await page.waitForTimeout(550);await screenshot(page,'04-拼贴聚焦.png',page.locator('#playground'));
  await page.locator('.close-note').click();await page.locator('.scrapbook[data-state="overview"]').waitFor();
  await page.locator('[data-note="welfare"]').waitFor({state:'visible'});
  await page.locator('[data-note="welfare"]').focus();await page.locator('.scrapbook[data-state="focused"]').waitFor();
  await page.keyboard.press('Enter');assert.equal(await page.locator('.scrapbook').getAttribute('data-locked'),'true');
  await page.keyboard.press('Escape');await page.locator('.scrapbook[data-state="overview"]').waitFor();
  record('点击锁定、显式关闭、键盘聚焦 / Enter / Esc 与总览恢复');

  await page.locator('[data-language="en"]').click();
  assert.equal(await page.locator('html').getAttribute('lang'),'en');assert.match(await page.locator('h1').textContent(),/Designing thoughtful/);
  assert.equal(await page.locator('#works .work-card').count(),documentedCount);
  await page.goto(origin + '/#/works/loopy');await page.locator('.case-intro').waitFor();
  assert.match(await page.locator('.case-section#role').textContent(),/shared team outcome/);
  assert.match(await page.locator('.case-section#outcome').textContent(),/not achieved Loopy results/);
  assert.equal(await page.locator('.case-section').count(),8);
  await page.reload();assert.equal(await page.locator('html').getAttribute('lang'),'en');
  await checkImages(page);
  await page.goto(origin + '/#/about');assert.match(await page.locator('h1').textContent(),/Making complex things/);
  await page.locator('[data-language="zh"]').click();assert.match(await page.locator('h1').textContent(),/复杂/);
  await page.evaluate(() => {document.activeElement?.blur();window.scrollTo({top:0,behavior:'instant'});});
  await page.waitForTimeout(100);
  await page.screenshot({path:path.join(shots,'05-About.png'),fullPage:true,animations:'disabled'});
  record('中英全文切换、语言刷新保留、案例证据边界与 About');

  await page.goto(origin + '/#/works');await page.getByRole('button',{name:'服务设计',exact:true}).click();
  assert.equal(await page.locator('.work-card').count(),projects.filter(p => p.source && p.category === '服务设计').length);
  await page.locator('.work-cover').click();await page.locator('.case-intro').waitFor();
  await page.locator('.case-toc a').nth(4).click();assert.ok(page.url().includes('section=process'));
  await page.reload();assert.equal(await page.locator('.case-section').count(),8);
  await page.goto(origin + '/#/missing');assert.match(await page.locator('h1').textContent(),/还没被画出来/);
  record('分类、案例八阶段目录、锚点刷新与 404');

  for (const width of [375,768,1440]) {
    await page.setViewportSize({width,height:960});
    for (const route of ['/#/','/#/works','/#/about','/#/works/loopy']) {
      await page.goto(origin + route);await page.locator('h1').waitFor();
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),`横向溢出：${width} ${route}`);
    }
  }
  record('三个屏幕宽度下的 12 项布局溢出检查');

  const mobileContext = await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  const mobile = await mobileContext.newPage();mobile.on('pageerror',e => errors.push(e.message));
  await mobile.goto(origin + '/');await mobile.locator('.intro').waitFor({state:'detached'});await screenshot(mobile,'06-移动端.png');
  await mobile.locator('.mobile-menu').tap();await mobile.locator('.main-nav a[href="#/?section=playground"]').tap();
  await mobile.locator('[data-note="cats"]').tap();await mobile.locator('.scrapbook[data-locked="true"]').waitFor();
  assert.ok(await mobile.locator('.note-story').isVisible());await mobile.waitForTimeout(550);
  await screenshot(mobile,'07-移动端拼贴.png',mobile.locator('#playground'));
  assert.ok(await mobile.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
  await mobile.locator('.close-note').tap();await mobile.locator('.scrapbook[data-state="overview"]').waitFor();
  record('真实触屏上下文：移动菜单、拼贴点开与关闭');

  const accessible = await browser.newContext({viewport:{width:1440,height:960},reducedMotion:'reduce'});
  const reduced = await accessible.newPage();await reduced.goto(origin + '/');assert.equal(await reduced.locator('.intro').count(),0);
  await reduced.mouse.move(200,200);assert.equal(await reduced.locator('.pixel-layer .is-visible').count(),0);
  await reduced.locator('[data-note="cats"]').focus();await reduced.keyboard.press('Enter');assert.equal(await reduced.locator('.scrapbook').getAttribute('data-locked'),'true');await reduced.keyboard.press('Escape');assert.equal(await reduced.locator('.scrapbook').getAttribute('data-state'),'overview');
  record('减少动态效果偏好：无开场 / 无拖尾，键盘与拼贴功能保留');

  const typeShots = path.join(output, 'typography');
  await mkdir(typeShots, {recursive:true});
  await page.setViewportSize({width:1440,height:960});
  await page.goto(origin + '/#/type-preview');
  await page.locator('.type-preview').waitFor();
  assert.equal(await page.locator('[data-note]').count(),2);
  for (const locale of ['zh','en']) {
    await page.locator(`[data-language="${locale}"]`).click();
    await page.evaluate(() => document.fonts.ready);
    const loaded = await page.evaluate(() => [...document.fonts].filter(font => font.status === 'loaded').map(font => font.family));
    for (const family of ['Ying Print Chinese','Ying Print Typewriter','Ying Study Sans','Ying Study Notes']) assert.ok(loaded.includes(family), `${locale}: ${family} did not load`);
    assert.match(await page.locator('.hero h1').evaluate(el => getComputedStyle(el).fontFamily),/Ying Print Chinese/);
    assert.match(await page.locator('.hero-bio').evaluate(el => getComputedStyle(el).fontFamily),/Ying Study Sans/);
    assert.match(await page.locator('.hand-note').evaluate(el => getComputedStyle(el).fontFamily),/Ying Study Notes/);
    await page.evaluate(() => {document.activeElement?.blur();window.scrollTo({top:0,behavior:'instant'});});
    await page.screenshot({path:path.join(typeShots,`hero-${locale}.png`),animations:'disabled'});
    await page.mouse.move(0,0);
    await page.locator('#playground').screenshot({path:path.join(typeShots,`notebook-${locale}.png`),animations:'disabled'});
  }
  await page.locator('[data-note="cats"]').click();
  await page.locator('.scrapbook[data-locked="true"]').waitFor();
  assert.match(await page.locator('.note-story h3').evaluate(el => getComputedStyle(el).fontFamily),/Ying Study Sans/);
  assert.match(await page.locator('.note-story p').last().evaluate(el => getComputedStyle(el).fontFamily),/Ying Study Sans/);
  await page.locator('.close-note').click();
  for (const locale of ['zh','en']) {
    await page.locator(`[data-language="${locale}"]`).click();
    for(const width of [375,768]) {
      await page.setViewportSize({width,height:900});
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),`Typography overflow: ${locale} ${width}`);
    }
  }
  await page.setViewportSize({width:1440,height:960});
  await page.locator('[data-language="zh"]').click();
  await page.setViewportSize({width:375,height:900});
  await page.evaluate(() => {document.activeElement?.blur();window.scrollTo({top:0,behavior:'instant'});});
  await page.screenshot({path:path.join(typeShots,'mobile-zh.png'),animations:'disabled'});
  await page.goto(origin + '/#/');
  assert.doesNotMatch(await page.locator('.hero h1').evaluate(el => getComputedStyle(el).fontFamily),/Ying (Study|Print)/);
  assert.ok(!(await page.locator('body').getAttribute('class'))?.includes('type-preview-active'));
  record('字体预览：中英文原生印刷字体、清晰正文与一处手写旁注、局部两张拼贴、原版未受影响、四项响应式检查');

  const offlineContext = await browser.newContext({viewport:{width:1440,height:960},reducedMotion:'reduce'});
  const offline = await offlineContext.newPage();offline.on('pageerror',e => errors.push(e.message));const requests=[];offline.on('request',r => requests.push(r.url()));
  await offline.goto(origin + '/offline.html');await offlineContext.setOffline(true);
  await offline.locator('.main-nav a[href="#/?section=playground"]').click();
  await offline.locator('[data-note="garden"]').click();await offline.locator('.note-story').waitFor();
  assert.match(await offline.locator('.note-story').textContent(),/植物/);await offline.locator('.close-note').click();
  await offline.locator('[data-language="en"]').click();assert.match(await offline.locator('h1').textContent(),/Designing thoughtful/);
  await offline.evaluate(() => {location.hash = '#/type-preview';});
  await offline.locator('.type-preview').waitFor();
  await offline.evaluate(() => document.fonts.ready);
  assert.ok(await offline.evaluate(() => [...document.fonts].every(font => font.status === 'loaded')));
  // Hash navigation stays local even when network is disabled.
  await offline.evaluate(() => { location.hash = '#/works/loopy'; });await offline.locator('.case-intro').waitFor();await checkImages(offline);
  assert.ok((await offline.locator('svg image').first().getAttribute('href')).startsWith('data:image/png;base64,'));
  assert.ok(requests.filter(url => !url.startsWith('data:')).every(url => url.startsWith(origin + '/offline.html')),'离线版不应请求外部图片、字体或脚本');
  record('自包含 HTML：载入后断网，双语 / 拼贴 / 案例 / JPEG 与猫猫 SVG 图版可用');
  assert.deepEqual(errors,[]);
  console.log(`Completed ${results.length} browser check groups; no JavaScript errors. Screenshots: ${shots}`);
} finally {
  if (browser) await browser.close();
  await new Promise(resolve => server.close(resolve));
}
