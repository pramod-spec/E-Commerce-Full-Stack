import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export const runtime = "nodejs";

const Razorpay = require("razorpay");

export async function POST(req: NextRequest) {
  try {
    const { productId } = await req.json();

    console.log("PRODUCT ID:", productId); // 🔥 debug

    if (!productId) {
      return NextResponse.json(
        { error: "productId missing" },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    console.log("PRODUCT:", product); // 🔥 debug

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    const price = product.discountprice ?? product.originalprice;

    if (!price) {
      return NextResponse.json(
        { error: "Price not found" },
        { status: 400 }
      );
    }

    // 🔥 CHECK ENV
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return NextResponse.json(
        { error: "Razorpay keys missing in env" },
        { status: 500 }
      );
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const order = await razorpay.orders.create({
      amount: Math.round(price * 100), // 🔥 important safe conversion
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
    });

    return NextResponse.json(order);
  } catch (err: any) {
    console.log("RAZORPAY ERROR 👉", err);

    return NextResponse.json(
      { error: err.message || "Payment order failed" },
      { status: 500 }
    );
  }
}