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

function functionSource(source, name) {
  const start = source.indexOf(`function ${name}(`);
  if (start < 0) return '';
  const bodyStart = source.indexOf('{', start);
  let depth = 0;
  for (let index = bodyStart; index < source.length; index++) {
    if (source[index] === '{') depth++;
    if (source[index] === '}' && --depth === 0) return source.slice(start, index + 1);
  }
  return '';
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
if (!/let adminMutationInFlight=false/.test(indexSource)) {
  fail('admin mutation lock is missing');
}
if (!/async function adminDelete[\s\S]{0,2000}await adminPersistPreview/.test(indexSource)) {
  fail('admin deletion must persist before another mutation can reload the digest');
}
if (!/list\.splice\(deleteIndex,0,removed\)/.test(indexSource)) {
  fail('failed admin deletion must restore the local paper row');
}
const deleteSource = functionSource(indexSource, 'adminDelete');
if (
  !deleteSource
  || deleteSource.indexOf('const target=adminPaperFromCard') < 0
  || deleteSource.indexOf('const target=adminPaperFromCard') > deleteSource.indexOf('adminSyncFromDom()')
) {
  fail('admin deletion must capture the clicked card before form synchronization');
}
if (!/if\(!adminPaperIdentity\(target\)\)[\s\S]*saved paper list was not changed[\s\S]*return;/.test(deleteSource)) {
  fail('blank admin drafts must be removed locally without persisting a deletion');
}

const identitySource = functionSource(indexSource, 'adminPaperIdentity');
const findIndexSource = functionSource(indexSource, 'adminFindPaperIndex');
const helperSandbox = {};
try {
  vm.runInNewContext(
    `${identitySource}\n${findIndexSource}\nthis.adminPaperIdentity=adminPaperIdentity;this.adminFindPaperIndex=adminFindPaperIndex;`,
    helperSandbox,
    { filename: 'index.html#admin-delete-helpers' }
  );
  const realPapers = [
    { title: 'Verified paper A', doi: '10.1000/a' },
    { title: 'Verified paper B', doi: '10.1000/b' },
  ];
  if (helperSandbox.adminPaperIdentity({ title: '', doi: '' }) !== '') {
    fail('blank admin draft unexpectedly has a paper identity');
  }
  if (helperSandbox.adminFindPaperIndex(realPapers, { doi: 'https://doi.org/10.1000/a' }) !== 0) {
    fail('admin deletion cannot find the intended DOI after blank rows are filtered');
  }
  if (helperSandbox.adminFindPaperIndex(realPapers, { title: '', doi: '' }) !== -1) {
    fail('blank admin draft can incorrectly resolve to a real paper');
  }
  if (
    helperSandbox.adminPaperIdentity({ doi: 'https://arxiv.org/abs/2607.12345v2' })
    !== helperSandbox.adminPaperIdentity({ doi: '10.48550/arXiv.2607.12345' })
  ) {
    fail('equivalent arXiv identifiers do not resolve to the same paper');
  }
  if (helperSandbox.adminPaperIdentity({ doi: '10.1000/examplev2' }) !== 'id:10.1000/examplev2') {
    fail('admin paper identity strips version-like suffixes from publication DOIs');
  }
} catch (error) {
  fail(`admin deletion helper test failed: ${error.message}`);
}

if (failures.length) {
  console.error('Site verification failed:');
  failures.forEach(message => console.error(`- ${message}`));
  process.exit(1);
}

console.log('Site verification passed: scripts, IDs, config, and admin-token storage are valid.');
