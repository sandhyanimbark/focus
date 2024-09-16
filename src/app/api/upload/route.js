import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { description, imageBase64 } = await req.json();

    const newImage = await prisma.image.create({
      data: {
        description,
        image_data: imageBase64,
      },
    });

    return new Response(JSON.stringify(newImage), { status: 201 });
  } catch (error) {
    console.log("chintan",error)
    return new Response(JSON.stringify({ error: 'Failed to upload image' }), { status: 500 });
  }
}
