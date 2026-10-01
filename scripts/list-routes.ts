import fs from 'fs';
import path from 'path';

interface RouteEntry {
  app: string;
  path: string;
  type: 'Page' | 'API Route' | 'Controller Endpoint';
  method?: string;
  filePath: string;
}

const apps = [
  { name: 'Storefront', dir: 'apps/storefront/app', prefix: '' },
  { name: 'Admin Portal', dir: 'apps/admin-portal/app', prefix: '' },
  { name: 'Hub (Central Payment Hub)', dir: 'apps/hub/app', prefix: '' },
  { name: 'Provider Portal', dir: 'apps/provider-portal/app', prefix: '' },
];

const allRoutes: RouteEntry[] = [];

// 1. Next.js App Router route scanner
for (const app of apps) {
  const fullAppDir = path.resolve(process.cwd(), app.dir);
  if (!fs.existsSync(fullAppDir)) continue;

  function scanDir(currentDir: string, urlSegment: string = '') {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        // Handle route groups (e.g. (auth)) by not adding to URL segment
        const nextSegment = entry.name.startsWith('(') && entry.name.endsWith(')')
          ? urlSegment
          : `${urlSegment}/${entry.name}`;
        scanDir(fullPath, nextSegment);
      } else if (entry.isFile()) {
        if (entry.name === 'page.tsx' || entry.name === 'page.ts' || entry.name === 'page.jsx' || entry.name === 'page.js') {
          const routePath = urlSegment === '' ? '/' : urlSegment;
          allRoutes.push({
            app: app.name,
            path: routePath,
            type: 'Page',
            filePath: path.relative(process.cwd(), fullPath),
          });
        } else if (entry.name === 'route.ts' || entry.name === 'route.js') {
          const routePath = urlSegment === '' ? '/' : urlSegment;
          allRoutes.push({
            app: app.name,
            path: routePath,
            type: 'API Route',
            method: 'ALL',
            filePath: path.relative(process.cwd(), fullPath),
          });
        }
      }
    }
  }

  scanDir(fullAppDir);
}

// 2. Scan apps/api controllers
const apiDir = path.resolve(process.cwd(), 'apps/api/src');
if (fs.existsSync(apiDir)) {
  function scanControllers(dir: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        scanControllers(fullPath);
      } else if (entry.isFile() && entry.name.endsWith('.controller.ts')) {
        const fileContent = fs.readFileSync(fullPath, 'utf8');
        const ctrlMatch = fileContent.match(/@Controller\(['"]?(.*?)['"]?\)/);
        const basePath = ctrlMatch ? (ctrlMatch[1] ? `/${ctrlMatch[1]}` : '/') : '';

        // Match method decorators like @Get('path'), @Post('path'), etc.
        const methodRegex = /@(Get|Post|Patch|Put|Delete)\(['"]?(.*?)['"]?\)/g;
        let match;
        while ((match = methodRegex.exec(fileContent)) !== null) {
          const httpMethod = match[1].toUpperCase();
          const subPath = match[2] ? `/${match[2].replace(/^\//, '')}` : '';
          const fullRoutePath = (basePath + subPath).replace(/\/+/g, '/') || '/';

          allRoutes.push({
            app: 'API (NestJS)',
            path: fullRoutePath,
            type: 'Controller Endpoint',
            method: httpMethod,
            filePath: path.relative(process.cwd(), fullPath),
          });
        }
      }
    }
  }
  scanControllers(apiDir);
}

// Group by App
const grouped: Record<string, RouteEntry[]> = {};
for (const r of allRoutes) {
  if (!grouped[r.app]) grouped[r.app] = [];
  grouped[r.app].push(r);
}

// Generate Markdown
let md = `# BLDR Platform — Complete Authoritative Route Inventory\n\n`;
md += `> **Generated on**: ${new Date().toISOString()} via \`scripts/list-routes\`\n`;
md += `> **Source of Truth**: Active filesystem scan across all 5 monorepo applications\n\n`;

md += `## Summary Statistics\n\n`;
md += `| Application | Target Audience / Purpose | Pages | API Routes | Total Endpoints |\n`;
md += `|---|---|---|---|---|\n`;

let grandTotal = 0;
for (const [appName, routes] of Object.entries(grouped)) {
  const pages = routes.filter((r) => r.type === 'Page').length;
  const apis = routes.filter((r) => r.type !== 'Page').length;
  const total = routes.length;
  grandTotal += total;

  let desc = '';
  if (appName.includes('Storefront')) desc = 'Learner Storefront, Catalog & Hosted Checkout';
  else if (appName.includes('Admin')) desc = 'Studio Store Builder & Operations';
  else if (appName.includes('Hub')) desc = 'Central Financial Governance, Settlements & Ventures';
  else if (appName.includes('Provider')) desc = 'Venture Team Member Self-Service Portal';
  else if (appName.includes('API')) desc = 'Central Backend REST & Gateway Webhooks';

  md += `| **${appName}** | ${desc} | ${pages} | ${apis} | **${total}** |\n`;
}
md += `| **TOTAL** | *Across 5 monorepo applications* | **${allRoutes.filter((r) => r.type === 'Page').length}** | **${allRoutes.filter((r) => r.type !== 'Page').length}** | **${grandTotal}** |\n\n`;

md += `## Detailed Routes by Application\n\n`;

for (const [appName, routes] of Object.entries(grouped)) {
  md += `### ${appName} (${routes.length} routes)\n\n`;
  md += `| Method / Type | Route Path | Source File |\n`;
  md += `|---|---|---|\n`;

  routes.sort((a, b) => a.path.localeCompare(b.path));

  for (const r of routes) {
    const label = r.method ? `\`${r.method}\`` : `*${r.type}*`;
    md += `| ${label} | \`${r.path}\` | [\`${r.filePath}\`](file:///${path.resolve(process.cwd(), r.filePath)}) |\n`;
  }
  md += `\n`;
}

// Write to docs
const docsDir = path.resolve(process.cwd(), 'docs');
if (!fs.existsSync(docsDir)) fs.mkdirSync(docsDir, { recursive: true });
const outputPath = path.join(docsDir, 'routes-inventory.md');
fs.writeFileSync(outputPath, md, 'utf8');

console.log(md);
console.log(`\n✅ Generated route inventory written to: ${outputPath}`);
