"use client";

import { useState } from "react";

export default function CheckoutForm() {
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [locality, setLocality] = useState("");
  const [pincode, setPincode] = useState("");
  const [loading, setLoading] = useState(false);

  // 1️⃣ Save Address
  const saveAddress = async () => {
    try {
      const res = await fetch("/api/address", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName,
          mobile,
          address,
          city,
          locality,
          pincode,
        }),
      });

      return await res.json();
    } catch (error) {
      console.log("Address error:", error);
      return { error: "Network error while saving address" };
    }
  };

  // 2️⃣ Payment Handler
  const handlePayment = async () => {
    try {
      setLoading(true);

      // Step 1: Save Address
      const addr = await saveAddress();

      if (!addr || addr.error) {
        alert(addr?.error || "Address save failed");
        setLoading(false);
        return;
      }

      // Step 2: Create Order
      const res = await fetch("/api/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: 99900, // ₹999 in paise
        }),
      });

      const data = await res.json();

      if (!data?.id) {
        alert("Order creation failed");
        setLoading(false);
        return;
      }

      // Step 3: Razorpay check
      if (typeof window === "undefined" || !(window as any).Razorpay) {
        alert("Razorpay SDK not loaded");
        setLoading(false);
        return;
      }

      // Step 4: Open Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount: data.amount,
        currency: data.currency,
        name: "My Shop",
        description: "Product Payment",
        order_id: data.id,

        handler: function (response: any) {
          alert("Payment Successful 🎉");
          console.log("Payment Response:", response);

          window.location.href = "/";
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error) {
      console.log("Payment error:", error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4">

      <input
        className="form-control mb-2"
        placeholder="Full Name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
      />

      <input
        className="form-control mb-2"
        placeholder="Mobile"
        value={mobile}
        onChange={(e) => setMobile(e.target.value)}
      />

      <textarea
        className="form-control mb-2"
        placeholder="Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />

      <input
        className="form-control mb-2"
        placeholder="City"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />

      <input
        className="form-control mb-2"
        placeholder="Locality"
        value={locality}
        onChange={(e) => setLocality(e.target.value)}
      />

      <input
        className="form-control mb-2"
        placeholder="Pincode"
        value={pincode}
        onChange={(e) => setPincode(e.target.value)}
      />

      <button
        className="btn btn-dark w-100"
        onClick={handlePayment}
        disabled={loading}
      >
        {loading ? "Processing..." : "Continue to Payment"}
      </button>
    </div>
  );
}