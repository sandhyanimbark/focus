import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();


export async function POST(req) {
  try {
    const { description, imageBase64 } = await req.json();


    let images = [];


    // If searching by description
    if (description) {
      images = await prisma.image.findMany({
        where: {
          description: {
            contains: description,  // Searching for matching descriptions
          },
        },
      });
    }


    // If searching by image
    if (imageBase64) {
      images = await prisma.image.findMany({
        where: {
          image_data: imageBase64,  // Assuming image_data is stored as base64 string
        },
      });
    }


    if (images.length === 0) {
      return new Response(JSON.stringify({ error: 'oyee ae image hi nako' }), { status: 404 });
    }


    return new Response(JSON.stringify(images), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'oyee ae image hi nako' }), { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
