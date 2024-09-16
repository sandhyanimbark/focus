import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const images = await prisma.image.findMany();
    return new Response(JSON.stringify(images), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ error: 'Failed to fetch images' }), { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
