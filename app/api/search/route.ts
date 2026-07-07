import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const sort = searchParams.get("sort"); // "lowToHigh" ya "highToLow"

    const searchTerm = query.trim();

    // 🚀 Base Query Parameters
    let whereCondition: any = {
      OR: [
        { name: { contains: searchTerm, mode: "insensitive" } },
        { description: { contains: searchTerm, mode: "insensitive" } },
      ],
    };

    // 💰 Price Filter Handling
    if (minPrice || maxPrice) {
      whereCondition.discountprice = {};
      if (minPrice) whereCondition.discountprice.gte = Number(minPrice);
      if (maxPrice) whereCondition.discountprice.lte = Number(maxPrice);
    }

    // 📊 Sorting Handling
    let orderByCondition: any = {};
    if (sort === "lowToHigh") {
      orderByCondition = { discountprice: "asc" };
    } else if (sort === "highToLow") {
      orderByCondition = { discountprice: "desc" };
    } else {
      orderByCondition = { id: "desc" }; // Default sorting
    }

    const products = await prisma.product.findMany({
      where: whereCondition,
      orderBy: orderByCondition,
      take: 20,
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Search API Filter Error:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}