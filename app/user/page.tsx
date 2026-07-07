import { cookies } from "next/headers";
import { verifyToken } from "../lib/jwt";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function User() {
  const token = (await cookies()).get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  let user: { id: string; email: string; name?: string };

  try {
    // 🚨 TypeScript error fix karne ke liye yahan explicit type cast (Type Assertion) laga diya hai
    user = verifyToken(token) as { id: string; email: string; name?: string };
  } catch {
    redirect("/login");
  }

  return (
    <div
      className="container d-flex justify-content-center align-items-center"
      style={{ minHeight: "90vh" }}
    >
      <div
        className="card shadow-lg border-0"
        style={{ maxWidth: "500px", width: "100%", borderRadius: "20px" }}
      >
        <div
          className="card-header text-center text-white py-4"
          style={{
            background: "linear-gradient(90deg,#0d6efd,#6610f2)",
            borderTopLeftRadius: "20px",
            borderTopRightRadius: "20px",
          }}
        >
          <div
            className="bg-white text-primary rounded-circle d-inline-flex justify-content-center align-items-center mb-3"
            style={{
              width: "80px",
              height: "80px",
              fontSize: "35px",
              fontWeight: "bold",
            }}
          >
            {/* Safe check ke sath dynamic first letter user ke email se nikal liya */}
            {user?.email?.charAt(0).toUpperCase()}
          </div>

          <h3 className="mb-0">My Profile</h3>
        </div>

        <div className="card-body p-4">

          <div className="mb-4">
            <label className="form-label fw-bold text-secondary">
              Email Address
            </label>
            <div className="form-control bg-light">
              {user.email}
            </div>
          </div>

          <div className="d-grid gap-2">

            <Link href="/my-orders" className="btn btn-outline-primary">
              📦 My Orders
            </Link>

            <Link href="/cart" className="btn btn-outline-success">
              🛒 My Cart
            </Link>

            <Link href="/logout" className="btn btn-danger">
              🚪 Logout
            </Link>

          </div>

        </div>
      </div>
    </div>
  );
}