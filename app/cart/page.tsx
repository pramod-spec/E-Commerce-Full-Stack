import { prisma } from "@/app/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "../lib/jwt";
import { redirect } from "next/navigation";
import CartItem from "../components/cartItem";
import Link from "next/link";

export default async function CartPage() {
  const token = (await cookies()).get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  let user;

  try {
    user = verifyToken(token) as {
      id: string;
      email: string;
    };
  } catch {
    redirect("/login");
  }

  const cartItems = await prisma.cart.findMany({
    where: {
      userId: user.id,
    },
    include: {
      product: true,
    },
  });

  // 💰 Total price pure cart ka calculate karne ke liye (TypeScript safe kiya fallback || 0 dekar)
  const totalPrice = cartItems.reduce((acc, item) => {
    return acc + (item.product.discountprice || 0) * item.quantity; 
  }, 0);

  return (
    <div className="container mt-5">
      <h1 className="mb-4">My Cart</h1>

      {cartItems.length === 0 ? (
        <h4>Your cart is empty.</h4>
      ) : (
        <div className="row">
          {/* Left Side: Cart Items List */}
          <div className="col-md-8">
            {cartItems.map((item) => (
              <div key={item.id} className="card p-3 mb-3 shadow-sm">
                {/* Aapka purana CartItem Component */}
                <CartItem item={item} />
                
                {/* 🎯 Har product ke liye uska apna specific Buy Now Button */}
                <div className="d-flex justify-content-end mt-2">
                  <Link 
                    href={`/checkout?productId=${item.product.id}&quantity=${item.quantity}`} 
                    className="text-decoration-none"
                  >
                    <button className="btn btn-warning btn-sm fw-bold px-4 shadow-sm">
                      Buy This Now
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}