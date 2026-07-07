"use client"; // 1. Client component banaya

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Men() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 2. Client-side par products fetch karna
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await fetch("/api/add-product"); // Aapka get all products wala API endpoint
        if (!res.ok) throw new Error("Failed to fetch");
        
        const data = await res.json();
        
        // Sirf wahi products filter kiye jinka section "Men" hai
        const filtered = Array.isArray(data) 
          ? data.filter((p: any) => p.section === "Men") 
          : [];
          
        setProducts(filtered);
      } catch (error) {
        console.log("Error loading men products:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // 3. Handlers
  const addToCart = async (productId: string) => {
    const res = await fetch("/api/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productId }),
    });

    const data = await res.json();
    alert(data.message || data.error);
  };

  const buyNow = (productId: string) => {
    router.push(`/checkout?productId=${productId}`);
  };

  if (loading) {
    return <div className="container mt-5 text-center"><h3>Loading Men's Collection...</h3></div>;
  }

  return (
    <div className="container mt-5">
      <h1>Men Only</h1>

      <div className="container mt-5">
        <div className="row">
          {products.length > 0 ? (
            products.map((p) => (
              <div className="col-lg-3 col-md-4 col-sm-6 mb-4" key={p.id || p._id}>
                <div className="card h-100">
                  <Link href={`/men/${p.id}`}>
                    <img
                      src={p.images?.[0]}
                      className="card-img-top"
                      alt={p.name}
                      style={{ height: "250px", objectFit: "cover" }}
                    />
                  </Link>

                  <div className="card-body border">
                    <h5 className="fs-4">{p.name}</h5>
                    <p className="fs-4">₹{p.discountprice}</p>

                    {/* Dono normal buttons inline onClick handlers ke sath */}
                    <div className="d-flex flex-row gap-5">
                      <button 
                        type="button" 
                        className="btn btn-outline-success text-center w-50" 
                        onClick={() => addToCart(p.id)}
                      >
                        Add To Cart
                      </button>
                      
                      <button 
                        type="button" 
                        className="btn btn-outline-warning text-center w-50" 
                        onClick={() => buyNow(p.id)}
                      >
                        Buy Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12 text-center">
              <p>No products found in Men's section.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}