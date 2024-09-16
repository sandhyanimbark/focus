import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function DELETE(req, { params }) {
  const { id } = params;

  try {
    await prisma.image.delete({
      where: {
        id: parseInt(id),
      },
    });
    return new Response(JSON.stringify({ message: 'Image deleted successfully' }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to delete image' }), { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(req, { params }) {
  const { id } = params;
  const { description, imageBase64 } = await req.json();

  try {
    await prisma.image.update({
      where: {
        id: parseInt(id),
      },
      data: {
        description,
        image_data: imageBase64,
      },
    });
    return new Response(JSON.stringify({ message: 'Image updated successfully' }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to update image' }), { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
