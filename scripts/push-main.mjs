#!/usr/bin/env node
// scripts/push-main.mjs
// Push the working tree's modified+untracked files to main via Git Data API.
// Used when git push is blocked by network but gh API works.

import { readFile, readdir, stat } from 'node:fs/promises';
import { join, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const OWNER  = 'silverenternal';
const REPO   = 'cinematic-3d';
const BRANCH = 'main';
const ROOT   = dirname(fileURLToPath(import.meta.url)) + '/..';

const TOKEN = process.env.GH_TOKEN;
if (!TOKEN) { console.error('GH_TOKEN env var required'); process.exit(1); }

const API = `https://api.github.com/repos/${OWNER}/${REPO}`;
const HEADERS = {
  'Accept': 'application/vnd.github+json',
  'Authorization': `Bearer ${TOKEN}`,
  'X-GitHub-Api-Version': '2022-11-28',
  'Content-Type': 'application/json',
  'User-Agent': 'mavis-push-main-script',
};

async function req(path, init = {}) {
  const r = await fetch(API + path, { ...init, headers: { ...HEADERS, ...(init.headers || {}) } });
  if (!r.ok) {
    const t = await r.text();
    throw new Error(`${init.method || 'GET'} ${path} → ${r.status} ${t.slice(0, 300)}`);
  }
  return r.status === 204 ? null : r.json();
}

function gitStatus() {
  const out = execSync('git status --porcelain', { cwd: ROOT, encoding: 'utf8' });
  return out.split('\n').filter(Boolean).map((line) => {
    const [code, ...rest] = line.trim().split(/\s+/);
    const path = rest.join(' ').replace(/^"|"$/g, '');
    return { code, path };
  });
}

async function main() {
  const status = gitStatus();
  console.log(`[push-main] ${status.length} changed files`);

  // Collect files: anything not 'D' (deleted) — for simplicity, all changed paths.
  const tree = [];
  for (const f of status) {
    if (f.code === 'D') continue; // skip deletes
    // ? in column 2 means untracked; we still need to read it
    const full = join(ROOT, f.path);
    const buf = await readFile(full);
    const blob = await req(`/git/blobs`, {
      method: 'POST',
      body: JSON.stringify({ content: buf.toString('base64'), encoding: 'base64' }),
    });
    tree.push({ path: f.path, mode: '100644', type: 'blob', sha: blob.sha });
    console.log(`  blob: ${f.path}`);
  }

  // Get current main head
  const ref = await req(`/git/ref/heads/${BRANCH}`);
  const prevSha = ref.object.sha;
  console.log(`[push-main] current ${BRANCH}: ${prevSha}`);

  // Get base tree from the head commit
  const headCommit = await req(`/git/commits/${prevSha}`);
  const baseTreeSha = headCommit.tree.sha;

  // Create new tree
  const newTree = await req(`/git/trees`, {
    method: 'POST',
    body: JSON.stringify({ base_tree: baseTreeSha, tree }),
  });
  console.log(`[push-main] new tree: ${newTree.sha}`);

  // Create commit
  const newCommit = await req(`/git/commits`, {
    method: 'POST',
    body: JSON.stringify({
      message: 'sync from local working tree (pushed via Git Data API)',
      tree: newTree.sha,
      parents: [prevSha],
    }),
  });
  console.log(`[push-main] new commit: ${newCommit.sha}`);

  // Update ref
  await req(`/git/refs/heads/${BRANCH}`, {
    method: 'PATCH',
    body: JSON.stringify({ sha: newCommit.sha, force: true }),
  });

  console.log(`[push-main] ✓ ${BRANCH} updated to ${newCommit.sha}`);
  console.log(`[push-main] https://github.com/${OWNER}/${REPO}/commit/${newCommit.sha}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
