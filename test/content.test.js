import test from 'node:test';
import assert from 'node:assert/strict';
import { projects, caseSections, profile } from '../src/content.js';

test('项目链接唯一，项目模块能匹配详情模板', () => {
  assert.equal(new Set(projects.map(p => p.slug)).size, projects.length);
  for (const project of projects) {
    assert.match(project.slug, /^[a-z0-9-]+$/);
    assert.ok(project.title && project.category && Array.isArray(project.tags));
    for (const id of Object.keys(project.sections)) {
      assert.ok(caseSections.some(section => section.id === id), `未知模块：${id}`);
    }
  }
});

test('案例包含完整的八个阶段，研究与精选项目分开', () => {
  assert.equal(caseSections.length, 8);
  assert.equal(new Set(caseSections.map(s => s.id)).size, 8);
  assert.ok(projects.some(p => p.research));
  assert.ok(projects.filter(p => p.featured).every(p => !p.research));
  assert.ok(Array.isArray(profile.education) && Array.isArray(profile.experience));
});
