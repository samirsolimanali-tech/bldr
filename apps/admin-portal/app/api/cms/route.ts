import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Path to shared CMS data file
const CMS_FILE_PATH = path.resolve(process.cwd(), '../../packages/shared-types/src/cms-data.json');

export async function GET() {
  try {
    if (fs.existsSync(CMS_FILE_PATH)) {
      const content = fs.readFileSync(CMS_FILE_PATH, 'utf-8');
      const data = JSON.parse(content);
      return NextResponse.json({ success: true, data });
    }
    return NextResponse.json({ success: false, error: 'CMS file not found' }, { status: 404 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 });
    }

    fs.writeFileSync(CMS_FILE_PATH, JSON.stringify(body, null, 2), 'utf-8');
    return NextResponse.json({ success: true, timestamp: Date.now(), message: 'CMS updated successfully' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
