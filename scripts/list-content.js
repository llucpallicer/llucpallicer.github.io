#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = resolve(__dirname, '..');

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  dim: '\x1b[2m',
};

const projects = JSON.parse(readFileSync(resolve(ROOT_DIR, 'src/data/projects.json'), 'utf-8'));
const diary = JSON.parse(readFileSync(resolve(ROOT_DIR, 'src/data/diary.json'), 'utf-8'));

console.log(`\n${colors.cyan}${colors.bright}=== PROJECTS (${projects.length}) ===${colors.reset}`);
console.log(`${colors.dim}Pos | Year | Slug | Title${colors.reset}`);
console.log(`${colors.dim}----+------+---------------------+----------------------------${colors.reset}`);
projects.forEach((p, idx) => {
  const pos = String(idx).padEnd(3);
  const year = String(p.year).padEnd(4);
  const slug = p.slug.padEnd(21);
  const title = p.copy.ca.title;
  const isTop = idx === 0 ? ` ${colors.green}[Latest/Top]${colors.reset}` : '';
  console.log(`${colors.bright}${pos}${colors.reset} | ${year} | ${colors.yellow}${slug}${colors.reset} | ${title}${isTop}`);
});

console.log(`\n${colors.cyan}${colors.bright}=== DIARY ENTRIES (${diary.length}) ===${colors.reset}`);
console.log(`${colors.dim}Pos | Slug | Title${colors.reset}`);
console.log(`${colors.dim}----+---------------------+-----------------------------------${colors.reset}`);
diary.forEach((d, idx) => {
  const pos = String(idx).padEnd(3);
  const slug = d.slug.padEnd(21);
  const title = d.copy.ca;
  const isTop = idx === 0 ? ` ${colors.green}[Latest/Top]${colors.reset}` : '';
  console.log(`${colors.bright}${pos}${colors.reset} | ${colors.yellow}${slug}${colors.reset} | ${title}${isTop}`);
});
console.log('');
