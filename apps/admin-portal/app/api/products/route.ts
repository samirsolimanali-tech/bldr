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
        headers: { 'Cache-Control': 'no-store, max-age=0' },
      });
    }
    return NextResponse.json({ success: false, error: 'Products file not found' }, { status: 404 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const filePath = getProductsFilePath();

    let products: any[] = [];
    if (fs.existsSync(filePath)) {
      try {
        products = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      } catch (e) {
        products = [];
      }
    }

    if (Array.isArray(body)) {
      // Overwrite / bulk sync
      products = body;
    } else if (body && typeof body === 'object') {
      // Single product addition or update
      const existingIdx = products.findIndex((p: any) => p.id === body.id || (p.slug && p.slug === body.slug));
      if (existingIdx >= 0) {
        products[existingIdx] = { ...products[existingIdx], ...body };
      } else {
        products.unshift(body);
      }
    }

    // Ensure directory exists
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(filePath, JSON.stringify(products, null, 2), 'utf-8');
    return NextResponse.json({ success: true, count: products.length, message: 'Products updated successfully' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
