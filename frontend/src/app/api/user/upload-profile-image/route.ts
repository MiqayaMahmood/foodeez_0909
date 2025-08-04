import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import sharp from 'sharp';
import { StrapiFileService } from '@/services/StrapiFileService';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Optimize image
    const optimizedBuffer = await sharp(buffer)
      .resize(400, 400, {
        fit: 'cover',
        position: 'center',
      })
      .jpeg({ quality: 80 })
      .toBuffer();

    // Create blob from optimized buffer
    const blob = new Blob([optimizedBuffer], { type: 'image/jpeg' });

    // Upload to Strapi using the service (this will automatically delete previous images)
    const imageUrl = await StrapiFileService.uploadProfileImage(blob as File, session.user.email);

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Failed to upload image to Strapi' },
        { status: 500 }
      );
    }

    // Update user profile in database
    await prisma.visitors_account.update({
      where: { EMAIL_ADDRESS: session.user.email },
      data: { PIC: imageUrl },
    });

    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error('Profile image upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
} 