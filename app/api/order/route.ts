import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/app/lib/jwt";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { total, productId, quantity, price } = body;

    const token = (await cookies()).get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = verifyToken(token) as { id: string };

    // Tracking Number Generate
    const trackingNumber = `TRK${Date.now()}`;

    // Estimated Delivery (5 Days)
    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 5);

    const order = await prisma.order.create({
      data: {
        userId: user.id,
        total,

        // Tracking Details
        status: "Order Placed",
        trackingNumber,
        estimatedDelivery,

        items: {
          create: {
            productId,
            quantity: quantity || 1,
            price: price || total,
          },
        },
      },

      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return NextResponse.json({
      message: "Order placed successfully",
      order,
    });

  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: "Order failed" },
      { status: 500 }
    );
  }
}