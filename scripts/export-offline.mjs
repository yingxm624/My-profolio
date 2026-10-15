import fs from 'node:fs';
import path from 'node:path';

// Produce a self-contained HTML file: no server, remote fonts or asset requests.
let html = fs.readFileSync('dist/index.html', 'utf8');
const scriptTag = html.match(/<script[^>]+src="([^"]+)"[^>]*><\/script>/);
if (!scriptTag) throw new Error('Built script was not found');
let js = fs.readFileSync(path.join('dist', scriptTag[1].replace(/^\//, '')), 'utf8');
const assets = {};
for (const name of fs.readdirSync('public/assets')) {
  if (!/\.(jpe?g|png|webp)$/.test(name)) continue;
  const mime = /\.jpe?g$/.test(name) ? 'jpeg' : path.extname(name).slice(1);
  const uri = `data:image/${mime};base64,${fs.readFileSync(path.join('public/assets', name)).toString('base64')}`;
  assets[`/assets/${name}`] = uri;
}
// Vite may emit a modulepreload helper; no external modules remain in this build.
if (/\bimport\s*\(/.test(js)) throw new Error('Dynamic imports require a different offline bundling strategy');
html = html.replace(scriptTag[0], '');
const inline = `globalThis.__portfolioAssets=${JSON.stringify(assets)};\n${js}`;
html = html.replace('</body>', () => `<script>${inline.replace(/<\/script/gi, '<\\/script')}</script></body>`);
html = html.replace(/<link[^>]+rel="stylesheet"[^>]*>/g, tag => {
  const href = tag.match(/href="([^"]+)"/)[1];
  const cssFile = path.join('dist', href.replace(/^\//,''));
  const css = fs.readFileSync(cssFile, 'utf8').replace(/url\((["']?)([^)"']+\.woff2)\1\)/g, (_match, _quote, fontPath) => {
    const file = fontPath.startsWith('/') ? path.join('dist', fontPath.slice(1)) : path.join(path.dirname(cssFile), fontPath);
    return `url(data:font/woff2;base64,${fs.readFileSync(file).toString('base64')})`;
  });
  return `<style>${css}</style>`;
});
html = html.replace('<html lang="zh-CN">', '<html lang="zh-CN" data-offline="true">');
const output = process.env.PORTFOLIO_OUTPUT_DIR || path.resolve('..', 'portfolio-delivery');
fs.mkdirSync(output, { recursive: true });
fs.writeFileSync(path.join(output, '作品集.html'), html);
fs.writeFileSync(path.join(output, 'Ying-Portfolio-v2.html'), html);
console.log(`Offline HTML written (${(Buffer.byteLength(html)/1024/1024).toFixed(2)} MiB)`);
