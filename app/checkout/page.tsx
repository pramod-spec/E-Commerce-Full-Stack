import { prisma } from "@/app/lib/prisma";
import CheckoutForm from "./CheckoutForm";

export default async function Checkout({
  searchParams,
}: {
  searchParams: Promise<{ productId?: string }>;
}) {
  const { productId } = await searchParams; // 🔥 Next.js 15+ asynchronous handle kiya hai

  if (!productId) {
    return <h1 className="text-center mt-5">Product Id Missing</h1>;
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    return <h1 className="text-center mt-5">Product Not Found</h1>;
  }

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Checkout</h1>

      <div className="card p-3 mb-4 shadow-sm" style={{ maxWidth: "400px" }}>
        <img 
          src={product.images[0]} 
          alt={product.name}
          width={200} 
          height={200} 
          className="img-fluid rounded mb-3"
        />
        <h3 className="h5">{product.name}</h3>
        <h4 className="text-success">₹{product.discountprice}</h4>
      </div>

      {/* 🚨 TypeScript error fix karne ke liye yahan fallback || 0 de diya hai */}
      <CheckoutForm productId={product.id} price={product.discountprice || 0} />
    </div>
  );
}