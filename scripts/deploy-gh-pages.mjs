#!/usr/bin/env node
// scripts/deploy-gh-pages.mjs
// Push ./dist to the gh-pages branch using Git Data API.
// Avoids git push's connection flakiness.

import { readFile, readdir, stat } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const OWNER  = 'silverenternal';
const REPO   = 'cinematic-3d';
const BRANCH = 'gh-pages';
const ROOT   = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIST   = join(ROOT, 'dist');

const TOKEN = process.env.GH_TOKEN;
if (!TOKEN) {
  console.error('GH_TOKEN env var required');
  process.exit(1);
}

const API = `https://api.github.com/repos/${OWNER}/${REPO}`;
const HEADERS = {
  'Accept': 'application/vnd.github+json',
  'Authorization': `Bearer ${TOKEN}`,
  'X-GitHub-Api-Version': '2022-11-28',
  'Content-Type': 'application/json',
  'User-Agent': 'mavis-deploy-script',
};

async function req(path, init = {}) {
  const r = await fetch(API + path, { ...init, headers: { ...HEADERS, ...(init.headers || {}) } });
  if (!r.ok) {
    const t = await r.text();
    throw new Error(`${init.method || 'GET'} ${path} → ${r.status} ${t.slice(0, 300)}`);
  }
  return r.status === 204 ? null : r.json();
}

async function walk(dir, base = dir) {
  const out = [];
  for (const name of await readdir(dir)) {
    const full = join(dir, name);
    const st = await stat(full);
    if (st.isDirectory()) out.push(...(await walk(full, base)));
    else if (st.isFile()) out.push({ path: relative(base, full), full });
  }
  return out;
}

async function main() {
  console.log(`[deploy] dist = ${DIST}`);
  const files = await walk(DIST);
  console.log(`[deploy] ${files.length} files to upload`);

  // 1. get current gh-pages head (so we can fast-forward)
  let prevSha = null;
  try {
    const ref = await req(`/git/ref/heads/${BRANCH}`);
    prevSha = ref.object.sha;
    console.log(`[deploy] previous ${BRANCH} sha: ${prevSha}`);
  } catch (e) {
    console.log(`[deploy] branch ${BRANCH} does not exist yet — will create it.`);
  }

  // 2. create blobs (base64-encode file content)
  const tree = [];
  for (const f of files) {
    const buf = await readFile(f.full);
    const blob = await req(`/git/blobs`, {
      method: 'POST',
      body: JSON.stringify({
        content: buf.toString('base64'),
        encoding: 'base64',
      }),
    });
    tree.push({ path: f.path, mode: '100644', type: 'blob', sha: blob.sha });
    console.log(`  blob: ${f.path}`);
  }

  // 3. base tree — if branch exists, fetch its tree and use as base
  let baseTreeSha = null;
  if (prevSha) {
    const commit = await req(`/git/commits/${prevSha}`);
    baseTreeSha = commit.tree.sha;
  }

  const newTree = await req(`/git/trees`, {
    method: 'POST',
    body: JSON.stringify({
      base_tree: baseTreeSha || undefined,
      tree,
    }),
  });
  console.log(`[deploy] new tree: ${newTree.sha}`);

  // 4. create commit
  const newCommit = await req(`/git/commits`, {
    method: 'POST',
    body: JSON.stringify({
      message: `deploy: ${new Date().toISOString().replace('T', ' ').slice(0, 19)} UTC`,
      tree: newTree.sha,
      parents: prevSha ? [prevSha] : [],
    }),
  });
  console.log(`[deploy] new commit: ${newCommit.sha}`);

  // 5. update ref (create or update)
  if (prevSha) {
    await req(`/git/refs/heads/${BRANCH}`, {
      method: 'PATCH',
      body: JSON.stringify({ sha: newCommit.sha, force: true }),
    });
  } else {
    await req(`/git/refs`, {
      method: 'POST',
      body: JSON.stringify({ ref: `refs/heads/${BRANCH}`, sha: newCommit.sha }),
    });
  }

  console.log(`[deploy] ✓ ${BRANCH} updated to ${newCommit.sha}`);
  console.log(`[deploy] https://github.com/${OWNER}/${REPO}/tree/${BRANCH}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
