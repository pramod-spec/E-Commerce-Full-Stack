"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // 🚨 SAFE REDIRECT KE LIYE IMPORT

// 🚨 Props ke interface mein 'price' ko accept karne ke liye type add kiya
interface CheckoutFormProps {
  productId: string;
  price: number;
}

export default function CheckoutForm({ productId, price }: CheckoutFormProps) {
  const router = useRouter(); // 🚨 Router initialization
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [locality, setLocality] = useState("");
  const [pincode, setPincode] = useState("");
  const [loading, setLoading] = useState(false);

  // Save Address
  const saveAddress = async () => {
    const res = await fetch("/api/address", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName,
        mobile,
        address,
        city,
        locality,
        pincode,
      }),
    });

    return res.json();
  };

  // Payment
  const handlePayment = async () => {
    setLoading(true);

    try {
      // 1️⃣ Save Address
      const addr = await saveAddress();

      if (!addr?.message) {
        alert(addr?.error || "Address error");
        setLoading(false);
        return;
      }

      // 2️⃣ Create Order
      const res = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });

      const data = await res.json();

      if (!data?.id) {
        alert(data.error || "Payment failed");
        setLoading(false);
        return;
      }

      // 3️⃣ Razorpay check
      if (!(window as any).Razorpay) {
        alert("Razorpay script not loaded");
        setLoading(false);
        return;
      }

      // 4️⃣ Open Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: "Modern & Tech Ecommerce",
        order_id: data.id,

        handler: async function (response: any) {
          console.log("Payment Success:", response);

          // ✅ 5️⃣ Save & Verify Order with proper signature check
          const orderRes = await fetch("/api/order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              productId,
              total: data.amount / 100,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature, // Backend verification ke liye safe hai
            }),
          });


          console.log("status:", orderRes.status)

          const orderData = await orderRes.json();
          console.log("Response:",orderData)

          if (orderRes.ok) {
            alert("Payment Successful 🎉");
            // 🚨 HARD REDIRECT KI JAGAH NEXT.JS ROUTER ROUTING:
            router.push("/"); 
            router.refresh(); // Cookies state sync rakhne ke liye
          } else {
            alert(orderData.error || "Order saving failed!");
          }
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
      setLoading(false);
    }
  };
 
  return (
    <div className="mt-4">
      {/* 💰 Ek Chota sa price display form ke upar taaki user ko amount dikhe */}
      <div className="alert alert-secondary py-2 mb-3 text-center fw-bold text-dark">
        Total Payable Amount: ₹{price}
      </div>

      <input className="form-control mb-2"
        placeholder="Full Name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
      />

      <input className="form-control mb-2"
        placeholder="Mobile"
        value={mobile}
        onChange={(e) => setMobile(e.target.value)}
      />

      <textarea className="form-control mb-2"
        placeholder="Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />

      <input className="form-control mb-2"
        placeholder="City"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />

      <input className="form-control mb-2"
        placeholder="Locality"
        value={locality}
        onChange={(e) => setLocality(e.target.value)}
      />

      <input className="form-control mb-2"
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