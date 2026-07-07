import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/app/lib/jwt"; // 🚀 FIXED: Tera custom jwt verify import kiya

async function getUserIdFromSession() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value; // ✅ Login schema ke hisab se exact match

    if (!token) return null;

    // 🚀 FIXED: Tere custom signToken ke mutabik verifyToken use kiya
    const decoded: any = verifyToken(token);
    
    if (!decoded) return null;

    // Payload mein tune 'id' bheja tha (id: userExist.id)
    return decoded.id; 
  } catch (error) {
    console.error("JWT Verification Error in Reviews:", error);
    return null;
  }
}

// 1. Naya Comment POST karne ke liye
export async function POST(req: Request) {
  try {
    const userId = await getUserIdFromSession();
    
    if (!userId) {
      return NextResponse.json({ error: "Please login first to submit a review!" }, { status: 401 });
    }

    const body = await req.json();
    const { productId, comment, rating } = body;

    if (!productId || !comment || !rating) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check unique constraint
    const existingReview = await prisma.review.findUnique({
      where: {
        userId_productId: { userId, productId },
      },
    });

    if (existingReview) {
      return NextResponse.json(
        { error: "Aap is product par pehle hi review de chuke hain!" }, 
        { status: 400 }
      );
    }

    // Review create karna
    const newReview = await prisma.review.create({
      data: {
        productId,
        userId,
        comment,
        rating: Number(rating),
      },
      include: {
        user: {
          select: { name: true }
        }
      },
    });

    return NextResponse.json({ message: "Review submitted successfully!", review: newReview });
  } catch (error) {
    console.error("Review POST Error:", error);
    return NextResponse.json({ error: "Failed to add review" }, { status: 500 });
  }
}

// 2. Product Page par Saare Comments load karne ke liye
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    const reviews = await prisma.review.findMany({
      where: { productId },
      include: {
        user: {
          select: { name: true }
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(reviews);
  } catch (error) {
    console.error("Review GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}