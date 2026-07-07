"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation"; // 🚀 Redirect karne ke liye import kiya
import { FaCircleUser } from "react-icons/fa6";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(""); // 🚀 Input text handle karne ke liye state
  const router = useRouter();

  // 🚀 Enter dabane par ya search button click hone par chalega
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() !== "") {
      // User ko query ke sath seedha search page par bhej dega
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setQuery(""); // Search hone ke baad input box khali karne ke liye
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm sticky-top">
      <div className="container-fluid d-flex flex-wrap align-items-center justify-content-between">
        
        {/* 🏢 Logo */}
        <Link className="navbar-brand me-2" href="/">
          <img src="/logo.png" alt="Logo" width="60" height="60" />
        </Link>

        {/* ======================================================== */}
        {/* 🔥 ALWAYS VISIBLE SEARCH BAR (Mobile aur Desktop dono par dikhega) */}
        {/* ======================================================== */}
        <form 
          onSubmit={handleSearchSubmit} 
          className="d-flex order-lg-2 mx-auto my-1" 
          style={{ maxWidth: "500px", width: "100%", flex: "1 1 280px" }}
        >
          <div className="input-group shadow-sm rounded-pill overflow-hidden border border-secondary-subtle">
            <input
              type="text"
              className="form-control border-0 ps-3 py-2"
              placeholder="Search products..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{ fontSize: "0.95rem", outline: "none" }}
            />
            <button 
              type="submit" 
              className="btn btn-primary px-3 border-0 d-flex align-items-center justify-content-center"
            >
              🔍
            </button>
          </div>
        </form>

        {/* 📱 Mobile Toggle Button (Ab isme sirf Links chhupenge, Search nahi) */}
        <button
          className="navbar-toggler order-lg-3 ms-2"
          type="button"
          onClick={() => setOpen(!open)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* 🔗 Links Wrapper */}
        <div className={`${open ? "show" : ""} navbar-collapse collapse order-lg-4`}>
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item">
              <Link className="nav-link" href="/HomePage">Home</Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" href="/cart">Cart</Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" href="/my-orders">My Orders</Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" href="/user"><FaCircleUser size={30}/></Link>
            </li>
          </ul>
        </div>

      </div>
    </nav>
  );
}