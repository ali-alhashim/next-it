import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import { existsSync } from 'fs';



export async function GET(
  req: NextRequest,
  { params }: { params: { photoName: string } }
) {
  // 🔐 Optional auth check


  const { photoName } = params;
  const filePath = path.join(process.cwd(), 'uploads', photoName);

  try {
    if (!existsSync(filePath)) {
      return new NextResponse('Image not found', { status: 404 });
    }

    const fileBuffer = await fs.readFile(filePath);

    // Guess content type by extension
    const ext = path.extname(photoName).toLowerCase();
    const contentType = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
    }[ext] || 'application/octet-stream';

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `inline; filename="${photoName}"`,
      },
    });
  } catch (err) {
    console.error('Error reading image:', err);
    return new NextResponse('Server error', { status: 500 });
  }
}
