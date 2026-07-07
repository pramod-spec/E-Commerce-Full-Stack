import { signToken } from "@/app/lib/jwt";
import { prisma } from "@/app/lib/prisma";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import { rateLimit } from "@/app/lib/rate-limits"; // Aapka import sahi hai

export async function POST(req: Request) {
  try {
    // 1. Sabse pehle user ka IP address nikalein
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";

    // 2. YAHAN PAR rateLimit ko call karna zaroori hai (Max 5 attempts)
    const limiter = await rateLimit(ip, 5);
    if (!limiter.success) {
      return Response.json(
        { error: "Too many login attempts. Please try again after 15 minutes." },
        { status: 429 }
      );
    }

    // 3. Rate limit pass hone ke baad hi request ki body ko read karein
    const { email, password } = await req.json();

    if (!email || !password) {
      return Response.json(
        { error: "All Fields Are Required" },
        { status: 400 }
      );
    }

    const userExist = await prisma.user.findUnique({
      where: { email },
    });

    if (!userExist) {
      return Response.json(
        { error: "User Not Found" },
        { status: 404 }
      );
    }

    const isValid = await bcrypt.compare(
      password,
      userExist.password
    );

    if (!isValid) {
      return Response.json(
        { error: "Invalid Password" },
        { status: 401 }
      );
    }

    const token = signToken({
      id: userExist.id,
      email: userExist.email,
    });

    (await cookies()).set("token", token, {
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });

    return Response.json({
      message: "Login Successfully",
      user: {
        id: userExist.id,
        name: userExist.name,
        email: userExist.email,
      },
    });
  } catch (error) {
    console.error("Error:", error);

    return Response.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}