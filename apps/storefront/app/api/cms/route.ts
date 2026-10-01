import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Path to shared CMS data file
// process.cwd() in Next.js monorepo = monorepo root (NOT apps/storefront)
const CMS_FILE_PATH = path.resolve(process.cwd(), 'packages/shared-types/src/cms-data.json');

export async function GET() {
  try {
    if (fs.existsSync(CMS_FILE_PATH)) {
      const content = fs.readFileSync(CMS_FILE_PATH, 'utf-8');
      const data = JSON.parse(content);
      return NextResponse.json({ success: true, data }, {
        headers: { 'Cache-Control': 'no-store, max-age=0' },
      });
    }
    return NextResponse.json({ success: false, error: 'CMS file not found' }, { status: 404 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
