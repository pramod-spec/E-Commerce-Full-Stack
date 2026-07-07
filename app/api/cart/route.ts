import { prisma } from "@/app/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/app/lib/jwt";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // 1. Cookies se token nikalna
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Please Login First" }, 
        { status: 401 }
      );
    }

    // 2. Token Verify karna
    let user;
    try {
      user = verifyToken(token) as {
        id: string;
        email: string;
      };
    } catch (err) {
      return NextResponse.json(
        { success: false, error: "Invalid Token. Please login again." }, 
        { status: 401 }
      );
    }

    // 3. Frontend se Product ID nikalna
    const { productId } = await req.json();

    if (!productId) {
      return NextResponse.json(
        { success: false, error: "Product Id is Required" }, 
        { status: 400 }
      );
    }

    // 4. Check karna ki product pehle se cart mein hai ya nahi
    const existingCart = await prisma.cart.findFirst({
      where: {
        userId: user.id,
        productId: productId,
      },
    });

    // 5. Agar pehle se hai toh quantity badhao
    if (existingCart) {
      const updatedCart = await prisma.cart.update({
        where: {
          id: existingCart.id,
        },
        data: {
          quantity: {
            increment: 1,
          },
        },
      });

      return NextResponse.json({
        success: true,
        message: "Quantity Updated",
        data: updatedCart
      });
    }

    // 6. Agar naya hai toh fresh item create karo
    const newCartItem = await prisma.cart.create({
      data: {
        userId: user.id,
        productId: productId,
        quantity: 1,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Product Added to cart",
      data: newCartItem
    });

  } catch (error: any) {
    // Kisi bhi unexpected crash ke liye safe handler
    return NextResponse.json(
      { success: false, error: error.message }, 
      { status: 500 }
    );
  }
}