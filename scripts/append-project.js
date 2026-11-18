#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { execSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = resolve(__dirname, '..');
const PROJECTS_JSON_PATH = resolve(ROOT_DIR, 'src/data/projects.json');
const TEMPLATE_PATH = resolve(ROOT_DIR, 'templates/project.template.json');
const DEFAULT_INPUT_PATH = resolve(ROOT_DIR, 'new-project.json');

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

function slugify(text) {
  return String(text || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

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
  console.log(`\n${colors.cyan}${colors.bright}=== Interactive Project Wizard ===${colors.reset}\n`);
  const caTitle = await rl.question('Project Title (Català) [required]: ');
  if (!caTitle.trim()) {
    throw new Error('Project title is required.');
  }
  const esTitle = (await rl.question(`Project Title (Castellano) [default: ${caTitle}]: `)).trim() || caTitle;
  const enTitle = (await rl.question(`Project Title (English) [default: ${caTitle}]: `)).trim() || caTitle;

  const currentYear = new Date().getFullYear();
  const yearInput = (await rl.question(`Year [default: ${currentYear}]: `)).trim();
  const year = yearInput ? parseInt(yearInput, 10) : currentYear;

  const defaultSlug = slugify(caTitle);
  const slugInput = (await rl.question(`URL slug [default: ${defaultSlug}]: `)).trim();
  const slug = slugInput ? slugify(slugInput) : defaultSlug;

  const client = (await rl.question('Client name (optional): ')).trim();
  const discipline = (await rl.question('Discipline [default: Disseny de producte]: ')).trim() || 'Disseny de producte';

  const caDesc = (await rl.question('Short description / summary (Català): ')).trim();
  const esDesc = (await rl.question('Short description / summary (Castellano): ')).trim() || caDesc;
  const enDesc = (await rl.question('Short description / summary (English): ')).trim() || caDesc;

  const caBody = (await rl.question('Full text / body (Català): ')).trim();
  const esBody = (await rl.question('Full text / body (Castellano): ')).trim() || caBody;
  const enBody = (await rl.question('Full text / body (English): ')).trim() || caBody;

  const orderInput = (await rl.question('Order position (0 or press Enter for Top / Latest): ')).trim();
  const slidesInput = (await rl.question('Number of gallery slides [default: 5]: ')).trim();
  const slidesCount = slidesInput ? parseInt(slidesInput, 10) : 5;

  return {
    order: orderInput || 0,
    slug,
    year,
    showOnHome: true,
    client,
    discipline,
    copy: {
      ca: { title: caTitle, sidebarTitle: caTitle, client, discipline, description: caDesc, body: caBody },
      es: { title: esTitle, sidebarTitle: esTitle, client, discipline, description: esDesc, body: esBody },
      en: { title: enTitle, sidebarTitle: enTitle, client, discipline, description: enDesc, body: enBody },
    },
    slidesCount,
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

        // If the user hasn't changed the default placeholder
        if (data.copy?.ca?.title === 'Nom del projecte' && !data.slug) {
          console.log(`\n${colors.yellow}⚠️ It looks like ${filePath} still has template placeholder values ("Nom del projecte").${colors.reset}`);
          const answer = await rl.question('Do you want to edit it first, or use the interactive wizard right now? [1: edit file, 2: wizard]: ');
          if (answer.trim() !== '2') {
            console.log(`Please edit ${filePath} with your project details and run this script again!`);
            rl.close();
            return;
          }
          data = await runWizard(rl);
        }
      }
    }

    // Validate and normalize data
    const title = data.copy?.ca?.title || data.copy?.es?.title || data.copy?.en?.title || data.title;
    if (!title) {
      console.error(`\n${colors.red}❌ Error: Project title is missing in copy.ca.title.${colors.reset}\n`);
      rl.close();
      process.exit(1);
    }

    const currentYear = new Date().getFullYear();
    const year = Number(data.year || data.copy?.ca?.year || currentYear);
    const client = data.client || data.copy?.ca?.client || '';
    const discipline = data.discipline || data.copy?.ca?.discipline || 'Disseny de producte';

    const slug = slugify(data.slug || title);

    const caCopy = {
      title: data.copy?.ca?.title || title,
      sidebarTitle: data.copy?.ca?.sidebarTitle || data.copy?.ca?.title || title,
      ...(client ? { client: data.copy?.ca?.client || client } : {}),
      year,
      discipline: data.copy?.ca?.discipline || discipline,
      description: data.copy?.ca?.description || '',
      body: data.copy?.ca?.body || '',
    };

    const esCopy = {
      title: data.copy?.es?.title || caCopy.title,
      sidebarTitle: data.copy?.es?.sidebarTitle || caCopy.sidebarTitle,
      ...(client ? { client: data.copy?.es?.client || client } : {}),
      year,
      discipline: data.copy?.es?.discipline || discipline,
      description: data.copy?.es?.description || caCopy.description,
      body: data.copy?.es?.body || caCopy.body,
    };

    const enCopy = {
      title: data.copy?.en?.title || caCopy.title,
      sidebarTitle: data.copy?.en?.sidebarTitle || caCopy.sidebarTitle,
      ...(client ? { client: data.copy?.en?.client || client } : {}),
      year,
      discipline: data.copy?.en?.discipline || discipline,
      description: data.copy?.en?.description || caCopy.description,
      body: data.copy?.en?.body || caCopy.body,
    };

    // Calculate slides
    let slides = [];
    if (Array.isArray(data.slides) && data.slides.length > 0) {
      slides = data.slides;
    } else {
      const count = Number(data.slidesCount ?? 5);
      if (count > 0) {
        slides = Array.from({ length: count }, (_, i) => i + 1);
      }
    }

    const detailImageCount = Number(data.detailImageCount ?? slides.length);
    const phoneProjectImageCount = Number(data.phoneProjectImageCount ?? detailImageCount);

    const projectEntry = {
      slug,
      year,
      showOnHome: data.showOnHome !== false,
      image: data.image || `/images/projects/${slug}/thumb.png`,
      copy: {
        ca: caCopy,
        es: esCopy,
        en: enCopy,
      },
      slides,
      exitToHome: Boolean(data.exitToHome),
      detailImageCount,
      phoneProjectImageCount,
    };

    // Load existing projects
    const existingProjects = JSON.parse(readFileSync(PROJECTS_JSON_PATH, 'utf-8'));
    const existingIndex = existingProjects.findIndex((p) => p.slug === slug);

    if (existingIndex >= 0) {
      console.log(`\n${colors.yellow}⚠️ A project with slug '${slug}' already exists at position ${existingIndex + 1}.${colors.reset}`);
      const confirm = await rl.question('Do you want to update/overwrite it? (y/N): ');
      if (!confirm.toLowerCase().startsWith('y')) {
        console.log('Cancelled.');
        rl.close();
        return;
      }
      existingProjects[existingIndex] = projectEntry;
      console.log(`${colors.green}✓ Updated existing project '${slug}'.${colors.reset}`);
    } else {
      const targetIndex = parseOrder(data.order, existingProjects.length);
      existingProjects.splice(targetIndex, 0, projectEntry);
      const positionLabel = targetIndex === 0 ? 'Top / Latest (position 1)' : `position ${targetIndex + 1}`;
      console.log(`\n${colors.green}${colors.bright}✓ Added new project '${caCopy.title}' at ${positionLabel}.${colors.reset}`);
    }

    // Save projects.json
    writeFileSync(PROJECTS_JSON_PATH, JSON.stringify(existingProjects, null, 2), 'utf-8');
    console.log(`${colors.green}✓ Saved src/data/projects.json${colors.reset}`);

    // Create required image directories
    const projectImgDir = resolve(ROOT_DIR, `public/images/projects/${slug}`);
    const detailImgDir = resolve(projectImgDir, 'detail');
    const galleryImgDir = resolve(ROOT_DIR, `public/images/galleries/${slug}`);

    mkdirSync(detailImgDir, { recursive: true });
    mkdirSync(galleryImgDir, { recursive: true });

    // Save backup of what was added and reset new-project.json
    writeFileSync(resolve(ROOT_DIR, 'new-project.last-added.json'), JSON.stringify(data, null, 2), 'utf-8');
    if (existsSync(TEMPLATE_PATH)) {
      const freshTemplate = readFileSync(TEMPLATE_PATH, 'utf-8');
      writeFileSync(DEFAULT_INPUT_PATH, freshTemplate, 'utf-8');
      console.log(`${colors.dim}✓ Reset new-project.json to blank template (backup saved to new-project.last-added.json)${colors.reset}`);
    }

    // Rebuild static pages & sitemap
    console.log(`\n${colors.cyan}Updating static pages and sitemap...${colors.reset}`);
    try {
      execSync('npm run build', { cwd: ROOT_DIR, stdio: 'inherit' });
      console.log(`\n${colors.green}${colors.bright}🎉 Project successfully added and site rebuilt!${colors.reset}`);
    } catch (e) {
      console.log(`${colors.yellow}Note: Could not run full build, running static generators...${colors.reset}`);
      execSync('node scripts/generate-static-pages.js && node scripts/generate-sitemap.js', { cwd: ROOT_DIR, stdio: 'inherit' });
    }

    // Print Next Steps for user
    console.log(`\n${colors.bright}------------------------------------------------------------${colors.reset}`);
    console.log(`${colors.cyan}${colors.bright}📸 NEXT STEPS - Add your images:${colors.reset}`);
    console.log(`1. Thumbnail card image:`);
    console.log(`   ${colors.yellow}public/images/projects/${slug}/thumb.png${colors.reset}`);
    console.log(`2. Detail page images (${detailImageCount} images):`);
    console.log(`   ${colors.yellow}public/images/projects/${slug}/detail/image-1.png ... image-${detailImageCount}.png${colors.reset}`);
    if (slides.length > 0) {
      console.log(`3. Gallery slides (${slides.length} images):`);
      console.log(`   ${colors.yellow}public/images/galleries/${slug}/1.png ... ${slides.length}.png${colors.reset}`);
    }
    console.log(`${colors.bright}------------------------------------------------------------${colors.reset}\n`);

  } catch (err) {
    console.error(`\n${colors.red}❌ Error:${colors.reset} ${err.message}\n`);
  } finally {
    rl.close();
  }
}

main();
