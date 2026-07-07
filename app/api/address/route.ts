import { prisma } from "@/app/lib/prisma";
import { verifyToken } from "@/app/lib/jwt";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const token = (await cookies()).get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = verifyToken(token) as {
      id: string;
      email: string;
    };

    const existingAddress = await prisma.address.findFirst({
      where: {
        userId: user.id,
      },
    });

    if (existingAddress) {
      await prisma.address.update({
        where: {
          id: existingAddress.id,
        },
        data: {
          fullName: body.fullName,
          mobile: body.mobile,
          address: body.address,
          city: body.city,
          locality: body.locality,
          pincode: body.pincode,
        },
      });
    } else {
      await prisma.address.create({
        data: {
          fullName: body.fullName,
          mobile: body.mobile,
          address: body.address,
          city: body.city,
          locality: body.locality,
          pincode: body.pincode,
          userId: user.id,
        },
      });
    }

    return NextResponse.json({
      message: "Address Saved Successfully",
    });

  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        error: "Something went wrong",
      },
      {
        status: 500,
      }
    );
  }
}