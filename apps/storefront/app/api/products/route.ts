import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

function getProductsFilePath() {
  const candidates = [
    path.resolve(process.cwd(), 'packages/shared-types/src/products-data.json'),
    path.resolve(process.cwd(), '../../packages/shared-types/src/products-data.json'),
    path.resolve(__dirname, '../../../../../../packages/shared-types/src/products-data.json'),
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  return candidates[0];
}

export async function GET() {
  try {
    const filePath = getProductsFilePath();
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      const data = JSON.parse(content);
      return NextResponse.json({ success: true, data }, {
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
      });
    }
    return NextResponse.json({ success: false, error: 'Products file not found' }, { status: 404 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
