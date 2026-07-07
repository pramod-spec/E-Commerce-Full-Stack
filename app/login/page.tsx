"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("userId", data.user.id);
        localStorage.setItem("userName", data.user.name);
        localStorage.setItem("userEmail", data.user.email);

        router.push("/dashboard");
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.log(error);
      alert("Something Went Wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg,#f8f9fa,#e9ecef)",
      }}
    >
      <div
        className="card shadow-lg border-0 p-4"
        style={{
          width: "100%",
          maxWidth: "430px",
          borderRadius: "18px",
        }}
      >
        <div className="text-center mb-4">
          <h2 className="fw-bold">Welcome Back</h2>
          <p className="text-muted mb-0">
            Login to continue shopping
          </p>
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">
            Email Address
          </label>

          <input
            type="email"
            className="form-control form-control-lg"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">
            Password
          </label>

          <input
            type="password"
            className="form-control form-control-lg"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="alert alert-warning py-2">
          Already logged in? No need to login again.
        </div>

        <button
          className="btn btn-dark btn-lg w-100 mb-3"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
              ></span>
              Logging In...
            </>
          ) : (
            "Login"
          )}
        </button>

        <button
          className="btn btn-outline-dark btn-lg w-100"
          onClick={() => router.push("/register")}
        >
          Create New Account
        </button>
      </div>
    </div>
  );
}