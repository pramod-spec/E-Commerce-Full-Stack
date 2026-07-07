"use client";

import { useState } from "react";

export default function CartItem({ item }: { item: any }) {
  // 🚨 State ko explicit <number> type de diya hai
  const [quantity, setQuantity] = useState<number>(item.quantity);
  const [loading, setLoading] = useState(false);

  const updateQuantity = async (
    cartId: string,
    type: "increment" | "decrement"
  ) => {
    if (loading) return;

    setLoading(true);

    // optimistic UI update (instant change)
    // 🚨 Yahan prev ke aage ': number' specify kar diya hai taaki implicit 'any' error na aaye
    setQuantity((prev: number) =>
      type === "increment" ? prev + 1 : prev - 1
    );

    const res = await fetch("/api/cart/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cartId,
        type,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error);

      // rollback if error
      setQuantity(item.quantity);
      setLoading(false);
      return;
    }

    setLoading(false);
  };

  return (
    <div className="card mb-3 shadow-sm">
      <div className="row g-0">
        <div className="col-md-3">
          <img
            src={item.product.images[0]}
            alt={item.product.name}
            className="img-fluid rounded-start"
            style={{
              height: "220px",
              width: "100%",
              objectFit: "cover",
            }}
          />
        </div>

        <div className="col-md-9">
          <div className="card-body">
            <h3>{item.product.name}</h3>

            <p>{item.product.description}</p>

            <h4 className="text-success">
              ₹{(item.product.discountprice || 0) * quantity}
            </h4>

            <div className="d-flex align-items-center gap-3">
              <button
                className="btn btn-dark"
                disabled={loading || quantity <= 1}
                onClick={() =>
                  updateQuantity(item.id, "decrement")
                }
              >
                -
              </button>

              <h5>{quantity}</h5>

              <button
                className="btn btn-dark"
                disabled={loading}
                onClick={() =>
                  updateQuantity(item.id, "increment")
                }
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}