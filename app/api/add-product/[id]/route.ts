import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { cookies } from "next/headers"; // <-- 1. Cookies import kiya
import jwt from "jsonwebtoken"; // <-- 2. JWT import kiya

// GET Route OPEN rahega (Taki normal users/customers details dekh sakein)
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const product = await prisma.product.findUnique({
      where: {
        id,
      },
    });

    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// DELETE Route PROTECTED rahega (Sirf Admin delete kar payega)
export async function DELETE(req: Request) {
  try {
    // === ADMIN CHECK START ===
    
    // 1. Cookies se token nikalein
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Unauthorized! Please login first." },
        { status: 401 }
      );
    }

    // 2. Token ko verify karein
    let decoded: { id: string; email: string };
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; email: string };
    } catch (err) {
      return NextResponse.json(
        { success: false, error: "Invalid or expired token. Please login again." },
        { status: 401 }
      );
    }

    // 3. Database se check karein ki user ADMIN hai ya nahi
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Forbidden! Only admin can delete products." },
        { status: 403 }
      );
    }

    // === ADMIN CHECK END ===


    // --- Agar user admin hai, tabhi yeh niche ka code chalega ---
    const { id } = await req.json();

    const product = await prisma.product.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      success: true,
      product,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}