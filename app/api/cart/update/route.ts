import { prisma } from "@/app/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/app/lib/jwt";

export async function POST(req: Request) {
  const token = (await cookies()).get("token")?.value;

  if (!token) {
    return Response.json(
      { error: "Please Login First" },
      { status: 401 }
    );
  }

  let user;

  try {
    user = verifyToken(token) as {
      id: string;
      email: string;
    };
  } catch {
    return Response.json(
      { error: "Invalid Token" },
      { status: 401 }
    );
  }

  const { cartId, type } = await req.json();

  if (!cartId || !type) {
    return Response.json(
      { error: "Missing Data" },
      { status: 400 }
    );
  }

  const cart = await prisma.cart.findFirst({
    where: {
      id: cartId,
      userId: user.id,
    },
  });

  if (!cart) {
    return Response.json(
      { error: "Cart Not Found" },
      { status: 404 }
    );
  }

  // Remove product if quantity is 1 and user clicks -
  if (type === "decrement" && cart.quantity === 1) {
    await prisma.cart.delete({
      where: {
        id: cartId,
      },
    });

    return Response.json({
      message: "Product Removed From Cart",
    });
  }

  // Update quantity
  await prisma.cart.update({
    where: {
      id: cartId,
    },
    data: {
      quantity:
        type === "increment"
          ? { increment: 1 }
          : { decrement: 1 },
    },
  });

  return Response.json({
    message: "Quantity Updated",
  });
}