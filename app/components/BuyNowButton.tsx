"use client";

import { useRouter } from "next/navigation";

interface BuyNowButtonProps {
  productId: string;
}

export default function BuyNowButton({ productId }: BuyNowButtonProps) {
  const router = useRouter();

  const buyNow = () => {
    // Isse user checkout page par redirect ho jayega product id ke sath
    router.push(`/checkout?productId=${productId}`);
  };

  return (
    <button 
      type="button" 
      className="btn btn-outline-warning text-center w-50" 
      onClick={buyNow}
    >
      Buy Now
    </button>
  );
}