import test from 'node:test';
import assert from 'node:assert/strict';
import { projects } from '../src/content.js';
import { localiseProjects, englishProjects } from '../src/english.js';
import { playground } from '../src/playground.js';

test('每个项目都有独立英文文案，不丢失原有证据图版', () => {
  const english = localiseProjects(projects, 'en');
  assert.equal(english.length, projects.length);
  projects.forEach((original, i) => {
    assert.ok(englishProjects[original.slug], `缺少英文内容：${original.slug}`);
    for (const [key, section] of Object.entries(original.sections)) {
      if (section.text) assert.ok(english[i].sections[key].text, `缺少英文案例段落：${original.slug}/${key}`);
      assert.deepEqual(english[i].sections[key].images.map(image => image.src), (section.images || []).map(image => image.src));
    }
  });
});

test('拼贴照片与文字独立配置，双语均有标题、介绍与来源说明', () => {
  assert.equal(new Set(playground.map(item => item.id)).size, playground.length);
  for (const item of playground) {
    assert.ok(item.image);
    for (const key of ['title', 'question', 'description', 'note']) {
      assert.equal(item[key].length, 2);
      assert.ok(item[key].every(value => value.length > 0));
    }
  }
});
