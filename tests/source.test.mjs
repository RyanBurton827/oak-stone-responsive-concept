import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const read = name => readFile(new URL(name, root), 'utf8');
const html = await read('index.html');
const css = await read('styles.css');
const js = await read('script.js');

test('fictional and form boundaries stay visible', () => {
  assert.ok(html.includes('Concept demo — not client work'));
  assert.ok(html.includes('does not send or store information'));
  assert.ok(html.includes('Demo only — nothing is transmitted.'));
  assert.ok(html.includes('Davenport, Florida'));
  assert.ok(html.includes('A finished client'));
});

test('markup has only local assets and same-page links', () => {
  const values = [...html.matchAll(/\b(?:href|src)="([^"]+)"/g)].map(match => match[1]);
  assert.ok(values.length > 0);
  for (const value of values) {
    assert.ok(value.startsWith('#') || ['styles.css', 'script.js', 'mark.svg'].includes(value), value);
  }
  for (const link of values.filter(value => value.startsWith('#'))) {
    assert.ok(html.includes(`id="${link.slice(1)}"`), `Missing destination: ${link}`);
  }
  assert.ok(!/\b(?:action|formaction)\s*=|<iframe|<img/i.test(html));
});

test('source has no contact details or private configuration', async () => {
  for (const name of ['index.html', 'styles.css', 'script.js', 'mark.svg', 'README.md']) {
    const source = await read(name);
    assert.ok(!/mailto:|tel:|[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}|(?:\+?1[\s.-]?)?\(\d{3}\)[\s.-]?\d{3}[\s.-]?\d{4}/i.test(source), name);
    assert.ok(!/\/Users\/|appgprj_|appgver_|appgdep_|sk-proj-|ghp_|github_pat_|-----BEGIN .*PRIVATE KEY/.test(source), name);
    assert.ok(!/https?:\/\//i.test(source.replace('http://www.w3.org/2000/svg', '')), name);
  }
  const names = await readdir(root);
  assert.ok(!names.includes('.openai'));
});

test('interaction is local and form values are rendered as text', () => {
  assert.ok(js.includes('event.preventDefault()'));
  assert.ok(js.includes('status.textContent'));
  assert.ok(js.includes("event.key === 'Escape'"));
  assert.ok(!/\bfetch\s*\(|XMLHttpRequest|sendBeacon|localStorage|sessionStorage|document\.cookie|\.innerHTML\s*=|\beval\s*\(/.test(js));
  const controls = [...html.matchAll(/<(?:input|select|textarea|button)\b[^>]*>/g)].map(match => match[0]).filter(tag => !tag.includes('menu-button'));
  assert.equal(controls.length, 5);
  assert.ok(controls.every(tag => /\bdisabled\b/.test(tag)), 'No-JavaScript baseline is disabled');
  assert.ok(js.indexOf('control.disabled = false') > js.indexOf("form?.addEventListener('submit'"));
});

test('responsive and keyboard-friendly foundations are present', () => {
  assert.ok(css.includes('@media (max-width: 900px)'));
  assert.ok(css.includes('@media (max-width: 600px)'));
  assert.ok(css.includes('@media (prefers-reduced-motion: reduce)'));
  assert.ok(css.includes(':focus-visible'));
  assert.ok(html.includes('aria-controls="site-nav"'));
  assert.ok(html.includes('aria-live="polite"'));
  assert.ok(!css.includes('.direct-contact'));
});
