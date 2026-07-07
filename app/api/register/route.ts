import { prisma } from "@/app/lib/prisma";
import bcrypt from "bcrypt";
import { rateLimit } from "@/app/lib/rate-limits"; // <-- 1. Limiter ko import kiya

export async function POST(req: Request) {
  try {
    // 2. Client ka IP address nikalein
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";

    // 3. Rate limit check karein (Max 5 attempts allowed)
    const limiter = await rateLimit(ip, 5);
    if (!limiter.success) {
      return Response.json(
        { error: "Too many registration attempts. Please try again after 15 minutes." },
        { status: 429 } // 429 = Too Many Requests
      );
    }

    // --- Aapka baaki ka saara code bilkul same hai ---
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return Response.json(
        { error: "All Fields Are Mandatory" }, 
        { status: 400 }
      );
    }

    const userExist = await prisma.user.findUnique({
      where: { email },
    });

    if (userExist) {
      return Response.json(
        { error: "User Already Exists" }, 
        { status: 400 }
      );
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, password: hashed }
    });

    return Response.json(
      { message: "User Created Succesfully" }, 
      { status: 201 }
    );

  } catch (error) {
    console.log("Error:", error);

    return Response.json(
      { error: "Internal Server Error At Register" }, 
      { status: 500 }
    );
  }
}