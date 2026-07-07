import { cookies } from "next/headers";
import { verifyToken } from "../lib/jwt";
import { redirect } from "next/navigation";


export default async function Dashboard() {
  const token = (await cookies()).get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  let user;

  try {
    user = verifyToken(token) as any;
  } catch {
    redirect("/login");
  }
  redirect("/HomePage")
}

  
