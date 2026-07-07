import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/app/lib/jwt"; 

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token) as { id: string; email: string } | null;

    if (!decoded || !decoded.id) {
      return NextResponse.json({ error: "Invalid Token!" }, { status: 401 });
    }

    const userId = decoded.id;

    // PostgreSQL se items aur product dono sath mein load karna
    const orders = await prisma.order.findMany({
      where: {
        userId: userId,
      },
      include: {
        items: {
          include: {
            product: true, // Har item ke andar uski product details (name, images, etc.) nikalne ke liye
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // ⚡ TERMINAL MEIN CHECK KARNE KE LIYE LOGS:
    console.log("--- DEBUGGING MY-ORDERS ---");
    orders.forEach((order, index) => {
      console.log(`Order #${index + 1} ID: ${order.id}`);
      console.log(`Items count: ${order.items ? order.items.length : 0}`);
      if (order.items && order.items.length > 0) {
        console.log(`First Item Product Data:`, order.items[0].product);
      }
    });
    console.log("---------------------------");

    return NextResponse.json(orders);
  } catch (error) {
    console.error("PostgreSQL Orders Fetch Error:", error);
    return NextResponse.json({ error: "Something went wrong!" }, { status: 500 });
  }
}