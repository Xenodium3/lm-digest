'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const failures = [];

function fail(message) {
  failures.push(message);
}

function read(relativePath) {
  return fs.readFileSync(path.join(ROOT, relativePath), 'utf8');
}

function verifyHtml(relativePath) {
  const html = read(relativePath);
  const ids = [...html.matchAll(/\bid=["']([^"']+)["']/g)].map(match => match[1]);
  const duplicates = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
  if (duplicates.length) fail(`${relativePath}: duplicate id(s): ${duplicates.join(', ')}`);

  const scripts = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)]
    .map(match => match[1])
    .filter(script => script.trim());
  if (!scripts.length) fail(`${relativePath}: no inline application script found`);
  scripts.forEach((script, index) => {
    try {
      new vm.Script(script, { filename: `${relativePath}#script-${index + 1}` });
    } catch (error) {
      fail(`${relativePath}: ${error.message}`);
    }
  });
}

verifyHtml('index.html');
verifyHtml('retarget.html');

const siteConfigSource = read('config/site-config.js');
const sandbox = { window: {} };
try {
  vm.runInNewContext(siteConfigSource, sandbox, { filename: 'config/site-config.js' });
} catch (error) {
  fail(`config/site-config.js: ${error.message}`);
}

const config = sandbox.window.LM_DIGEST_SITE_CONFIG;
if (!config || typeof config !== 'object') fail('site config does not define window.LM_DIGEST_SITE_CONFIG');
if (!/^https:\/\//.test(config?.backendUrl || '')) fail('site config backendUrl must use HTTPS');
if (!Array.isArray(config?.topics) || !config.topics.length) fail('site config must define at least one topic');
if (!config?.domain?.defaultCategory) fail('site config must define domain.defaultCategory');

const indexSource = read('index.html');
if (/localStorage\.(?:getItem|setItem)\(['"]lmd_admin_token/.test(indexSource)) {
  fail('admin token must not be persisted in localStorage');
}
if (!/sessionStorage\.(?:getItem|setItem)\(['"]lmd_admin_token/.test(indexSource)) {
  fail('admin token session storage guard is missing');
}
if (!/never displays hard-coded demo papers/i.test(indexSource)) {
  fail('index.html is missing the no-demo-data maintenance guard');
}

if (failures.length) {
  console.error('Site verification failed:');
  failures.forEach(message => console.error(`- ${message}`));
  process.exit(1);
}

console.log('Site verification passed: scripts, IDs, config, and admin-token storage are valid.');
