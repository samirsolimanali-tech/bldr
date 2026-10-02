import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { createClient } from '@vercel/edge-config';

const CMS_FILE_PATH = path.resolve(process.cwd(), 'packages/shared-types/src/cms-data.json');

export async function GET() {
  try {
    // 1. Ultra-low latency read from Vercel Global Config (Edge Config)
    const configUrl = process.env.GLOBAL_CONFIG || process.env.EDGE_CONFIG;
    if (configUrl) {
      try {
        const edgeClient = createClient(configUrl);
        const globalData = await edgeClient.get('cms_data');
        if (globalData && typeof globalData === 'object') {
          return NextResponse.json(
            { success: true, data: globalData, source: 'global_config' },
            { headers: { 'Cache-Control': 'no-store, max-age=0' } }
          );
        }
      } catch (edgeErr) {
        console.warn('[Global Config Read Warning - falling back to bundle]', edgeErr);
      }
    }

    // 2. Fallback to bundled local CMS file
    const candidatePaths = [
      CMS_FILE_PATH,
      path.resolve(process.cwd(), '../../packages/shared-types/src/cms-data.json'),
      path.resolve(process.cwd(), '../packages/shared-types/src/cms-data.json'),
    ];

    for (const p of candidatePaths) {
      if (fs.existsSync(p)) {
        const content = fs.readFileSync(p, 'utf-8');
        const data = JSON.parse(content);
        return NextResponse.json(
          { success: true, data, source: 'file' },
          { headers: { 'Cache-Control': 'no-store, max-age=0' } }
        );
      }
    }

    return NextResponse.json({ success: false, error: 'CMS file not found' }, { status: 404 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
