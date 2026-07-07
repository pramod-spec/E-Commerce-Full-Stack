"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Register() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name || !email || !password) {
      alert("Please fill all fields.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      if (res.ok) {
        alert("Registration Successful 🎉");
        router.push("/login");
      } else {
        const data = await res.json();
        alert(data.error);
      }
    } catch (error) {
      console.log("Error:", error);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg,#f8f9fa,#e9ecef)",
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
          <h2 className="fw-bold">Create Account </h2>
          <p className="text-muted">
            Join us and start shopping today.
          </p>
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">
            Full Name
          </label>
          <input
            type="text"
            className="form-control form-control-lg"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
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
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
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
              Creating Account...
            </>
          ) : (
            "Create Account"
          )}
        </button>

        <button
          className="btn btn-outline-dark btn-lg w-100"
          onClick={() => router.push("/login")}
        >
          Already Have an Account?
        </button>
      </div>
    </div>
  );
}