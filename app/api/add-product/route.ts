import { NextResponse } from "next/server";
import cloudinary from "@/app/lib/cloudinary";
import { prisma } from "@/app/lib/prisma";
import { cookies } from "next/headers"; // <-- 1. Cookies import kiya
import jwt from "jsonwebtoken"; // <-- 2. JWT import kiya

export async function POST(req: Request) {
  try {
    // === ROUTE PROTECTION START ===
    
    // 1. Cookies se token check karein
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Unauthorized! Please login first." },
        { status: 401 }
      );
    }

    // 2. Token ko verify karein (process.env.JWT_SECRET se)
    let decoded: { id: string; email: string };
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; email: string };
    } catch (err) {
      return NextResponse.json(
        { success: false, error: "Invalid or expired token. Please login again." },
        { status: 401 }
      );
    }

    // 3. Database se user ka role check karein
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Forbidden! Only admin can add products." },
        { status: 403 } // 403 = Access Denied
      );
    }

    // === ROUTE PROTECTION END ===


    // --- Aapka Baaki Ka Pura Code Bilkul Same Hai ---
    const formData = await req.formData();

    const name = formData.get("name") as string;
    const rating = formData.get("rating") as string;
    const color = formData.get("color") as string;
    const originalprice = Number(formData.get("originalprice"));
    const discountpercentage = Number(formData.get("discountpercentage"));
    const discountprice = Number(formData.get("discountprice"));
    const size = formData.get("size") as string;
    const description = formData.get("description") as string;
    const files = formData.getAll("images") as File[];
    const section = formData.get("section") as string;

    const uploadedImages: string[] = [];

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const result: any = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "products" }, (err, result) => {
            if (err) reject(err);
            else resolve(result);
          })
          .end(buffer);
      });

      uploadedImages.push(result.secure_url);
    }

    const product = await prisma.product.create({
      data: {
        name,
        rating,
        description,
        size,
        color,
        originalprice,
        discountpercentage,
        discountprice,
        section,
        images: uploadedImages,
      },
    });

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// GET Route ko open rakha hai taaki sabhi products dekh sakein
export async function GET() {
  const products = await prisma.product.findMany();
  return NextResponse.json(products);
}