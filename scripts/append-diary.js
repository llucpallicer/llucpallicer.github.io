#!/usr/bin/env node
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { execSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = resolve(__dirname, '..');
const DIARY_JSON_PATH = resolve(ROOT_DIR, 'src/data/diary.json');
const TEMPLATE_PATH = resolve(ROOT_DIR, 'templates/diary.template.json');
const DEFAULT_INPUT_PATH = resolve(ROOT_DIR, 'new-diary.json');

// Terminal colors
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  red: '\x1b[31m',
  dim: '\x1b[2m',
};

function parseOrder(orderValue, totalLength) {
  if (
    orderValue === undefined ||
    orderValue === null ||
    orderValue === '' ||
    orderValue === 0 ||
    orderValue === '0' ||
    String(orderValue).toLowerCase() === 'none' ||
    String(orderValue).toLowerCase() === 'top' ||
    String(orderValue).toLowerCase() === 'latest'
  ) {
    return 0; // Top / Latest
  }
  if (
    orderValue === -1 ||
    orderValue === '-1' ||
    String(orderValue).toLowerCase() === 'end' ||
    String(orderValue).toLowerCase() === 'bottom' ||
    String(orderValue).toLowerCase() === 'last'
  ) {
    return totalLength; // Bottom
  }
  const parsed = parseInt(orderValue, 10);
  if (isNaN(parsed)) return 0;
  return Math.max(0, Math.min(parsed, totalLength));
}

async function runWizard(rl) {
  console.log(`\n${colors.cyan}${colors.bright}=== Interactive Diary Wizard ===${colors.reset}\n`);
  const caTitle = await rl.question('Sidebar Title (Català) [e.g. 01.00.00 / El meu article]: ');
  if (!caTitle.trim()) {
    throw new Error('Title is required.');
  }
  const esTitle = (await rl.question(`Sidebar Title (Castellano) [default: ${caTitle}]: `)).trim() || caTitle;
  const enTitle = (await rl.question(`Sidebar Title (English) [default: ${caTitle}]: `)).trim() || caTitle;

  const defaultSlug = caTitle.split('/')[0].trim().replace(/\./g, '-') || '01-00-00';
  const slugInput = (await rl.question(`Slug code [default: ${defaultSlug}]: `)).trim();
  const slug = slugInput || defaultSlug;

  const caHeadline = (await rl.question(`Article Headline (Català) [default: ${caTitle}]: `)).trim() || caTitle;
  const esHeadline = (await rl.question(`Article Headline (Castellano) [default: ${esTitle}]: `)).trim() || esTitle;
  const enHeadline = (await rl.question(`Article Headline (English) [default: ${enTitle}]: `)).trim() || enTitle;

  console.log('\nEnter article body text (or press Enter to fill in later):');
  const caBody = (await rl.question('Body (Català): ')).trim();
  const esBody = (await rl.question('Body (Castellano): ')).trim() || caBody;
  const enBody = (await rl.question('Body (English): ')).trim() || caBody;

  const orderInput = (await rl.question('Order position (0 or press Enter for Top / Latest): ')).trim();

  return {
    order: orderInput || 0,
    slug,
    copy: {
      ca: caTitle,
      es: esTitle,
      en: enTitle,
    },
    content: {
      ca: { headline: caHeadline, body: caBody },
      es: { headline: esHeadline, body: esBody },
      en: { headline: enHeadline, body: enBody },
    },
  };
}

async function main() {
  const args = process.argv.slice(2);
  let filePath = DEFAULT_INPUT_PATH;
  let forceWizard = false;

  for (const arg of args) {
    if (arg === '--wizard' || arg === '-w') {
      forceWizard = true;
    } else if (!arg.startsWith('-')) {
      filePath = resolve(process.cwd(), arg);
    }
  }

  const rl = readline.createInterface({ input, output });

  try {
    let data;

    if (forceWizard) {
      data = await runWizard(rl);
    } else {
      if (!existsSync(filePath)) {
        console.log(`${colors.yellow}File not found: ${filePath}${colors.reset}`);
        const answer = await rl.question('Would you like to run the interactive wizard instead? (Y/n): ');
        if (answer.toLowerCase().startsWith('n')) {
          console.log('Exiting.');
          rl.close();
          return;
        }
        data = await runWizard(rl);
      } else {
        const rawContent = readFileSync(filePath, 'utf-8');
        try {
          data = JSON.parse(rawContent);
        } catch (err) {
          console.error(`\n${colors.red}${colors.bright}❌ JSON Syntax Error in ${filePath}:${colors.reset}`);
          console.error(`${colors.yellow}${err.message}${colors.reset}\n`);
          console.log(`Tip: Make sure all quotes and commas are properly closed.`);
          rl.close();
          process.exit(1);
        }

        // If template placeholder remains
        if (data.copy?.ca?.includes("Títol breu de l'article") || !data.slug) {
          console.log(`\n${colors.yellow}⚠️ It looks like ${filePath} still has template placeholder values.${colors.reset}`);
          const answer = await rl.question('Do you want to edit it first, or use the interactive wizard right now? [1: edit file, 2: wizard]: ');
          if (answer.trim() !== '2') {
            console.log(`Please edit ${filePath} with your diary article and run this script again!`);
            rl.close();
            return;
          }
          data = await runWizard(rl);
        }
      }
    }

    const caCopy = data.copy?.ca || data.title || '';
    if (!caCopy) {
      console.error(`\n${colors.red}❌ Error: Diary entry copy.ca is required.${colors.reset}\n`);
      rl.close();
      process.exit(1);
    }

    const esCopy = data.copy?.es || caCopy;
    const enCopy = data.copy?.en || caCopy;
    const slug = data.slug || '01-00-00';

    const diaryEntry = {
      slug,
      copy: {
        ca: caCopy,
        es: esCopy,
        en: enCopy,
      },
      content: {
        ca: {
          headline: data.content?.ca?.headline || caCopy,
          body: data.content?.ca?.body || '',
        },
        es: {
          headline: data.content?.es?.headline || esCopy,
          body: data.content?.es?.body || data.content?.ca?.body || '',
        },
        en: {
          headline: data.content?.en?.headline || enCopy,
          body: data.content?.en?.body || data.content?.ca?.body || '',
        },
      },
    };

    const existingEntries = JSON.parse(readFileSync(DIARY_JSON_PATH, 'utf-8'));
    const existingIndex = existingEntries.findIndex((e) => e.slug === slug);

    if (existingIndex >= 0) {
      console.log(`\n${colors.yellow}⚠️ A diary entry with slug '${slug}' already exists at position ${existingIndex + 1}.${colors.reset}`);
      const confirm = await rl.question('Do you want to update/overwrite it? (y/N): ');
      if (!confirm.toLowerCase().startsWith('y')) {
        console.log('Cancelled.');
        rl.close();
        return;
      }
      existingEntries[existingIndex] = diaryEntry;
      console.log(`${colors.green}✓ Updated existing diary entry '${slug}'.${colors.reset}`);
    } else {
      const targetIndex = parseOrder(data.order, existingEntries.length);
      existingEntries.splice(targetIndex, 0, diaryEntry);
      const positionLabel = targetIndex === 0 ? 'Top / Latest (position 1)' : `position ${targetIndex + 1}`;
      console.log(`\n${colors.green}${colors.bright}✓ Added new diary entry '${caCopy}' at ${positionLabel}.${colors.reset}`);
    }

    // Save diary.json
    writeFileSync(DIARY_JSON_PATH, JSON.stringify(existingEntries, null, 2), 'utf-8');
    console.log(`${colors.green}✓ Saved src/data/diary.json${colors.reset}`);

    // Save backup and reset new-diary.json
    writeFileSync(resolve(ROOT_DIR, 'new-diary.last-added.json'), JSON.stringify(data, null, 2), 'utf-8');
    if (existsSync(TEMPLATE_PATH)) {
      const freshTemplate = readFileSync(TEMPLATE_PATH, 'utf-8');
      writeFileSync(DEFAULT_INPUT_PATH, freshTemplate, 'utf-8');
      console.log(`${colors.dim}✓ Reset new-diary.json to blank template (backup saved to new-diary.last-added.json)${colors.reset}`);
    }

    // Rebuild static pages & sitemap
    console.log(`\n${colors.cyan}Updating static pages and sitemap...${colors.reset}`);
    try {
      execSync('npm run build', { cwd: ROOT_DIR, stdio: 'inherit' });
      console.log(`\n${colors.green}${colors.bright}🎉 Diary entry successfully added and site rebuilt!${colors.reset}\n`);
    } catch (e) {
      console.log(`${colors.yellow}Running static page generators...${colors.reset}`);
      execSync('node scripts/generate-static-pages.js && node scripts/generate-sitemap.js', { cwd: ROOT_DIR, stdio: 'inherit' });
    }

  } catch (err) {
    console.error(`\n${colors.red}❌ Error:${colors.reset} ${err.message}\n`);
  } finally {
    rl.close();
  }
}

main();
