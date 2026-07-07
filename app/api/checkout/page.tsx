import { prisma } from "@/app/lib/prisma";

// import CheckoutForm from "./CheckoutForm";

export default async function Checkout({
  searchParams,
}: {
  searchParams: { productId?: string };
}) {
  const productId = searchParams.productId;

  if (!productId) {
    return <h1>Product Id Missing</h1>;
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    return <h1>Product Not Found</h1>;
  }

  return (
    <div className="container mt-5">
      <h1>Checkout</h1>

      <img
        src={product.images?.[0]}
        width={200}
        height={200}
        alt={product.name}
      />

      <h3>{product.name}</h3>
      <h4>₹{product.discountprice}</h4>

      {/* 🔥 IMPORTANT: PASS PRODUCT ID */}
      {/* <CheckoutForm productId={product.id} /> */}
    </div>
  );
}