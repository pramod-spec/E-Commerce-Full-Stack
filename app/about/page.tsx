"use client"; // Client component taaki interactive features ya links handle ho sakein

import Link from "next/link";

export default function AboutPage() {
  return (
    <>
      {/* 1. Hero Section */}
      <div className="bg-dark text-white text-center py-5 mb-5" style={{ background: "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200') no-repeat center center/cover" }}>
        <div className="container py-5">
          <h1 className="display-4 fw-bold mb-3 text-warning">Our Story</h1>
          <p className="lead fs-4 max-w-2xl mx-auto">
            Bringing premium quality products directly to your doorstep with love and care.
          </p>
        </div>
      </div>

      <div className="container py-4">
        {/* 2. Mission & Vision Section */}
        <div className="row align-items-center g-5 mb-5">
          <div className="col-lg-6">
            <h2 className="fw-bold mb-3 text-success">Who We Are</h2>
            <p className="text-secondary fs-5 lh-base">
              Welcome to our e-commerce store! Founded with a vision to redefine online shopping, we aim to provide high-quality items at affordable prices. We constantly monitor market trends to offer curated selections that match your taste and style perfectly.
            </p>
            <p className="text-secondary fs-5 lh-base">
              Customer satisfaction is our ultimate fuel. From our fast shipping pipelines to seamless secure payment gateways, we ensure that every single interaction leaves a smile on your face.
            </p>
          </div>
          <div className="col-lg-6">
            <img 
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=600" 
              alt="Our Workspace" 
              className="img-fluid rounded-4 shadow-lg w-100"
              style={{ objectFit: "cover", height: "350px" }}
            />
          </div>
        </div>

        {/* 3. Numbers/Statistics Section */}
        <div className="row text-center my-5 g-4">
          <div className="col-md-4">
            <div className="card shadow border-0 rounded-4 p-4 bg-light">
              <h2 className="fw-bold text-primary display-5">10K+</h2>
              <h6 className="text-secondary fw-semibold mb-0">Happy Customers</h6>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card shadow border-0 rounded-4 p-4 bg-light">
              <h2 className="fw-bold text-success display-5">500+</h2>
              <h6 className="text-secondary fw-semibold mb-0">Premium Products</h6>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card shadow border-0 rounded-4 p-4 bg-light">
              <h2 className="fw-bold text-warning display-5">24/7</h2>
              <h6 className="text-secondary fw-semibold mb-0">Customer Support</h6>
            </div>
          </div>
        </div>

        <hr className="my-5 text-muted" />

        {/* 4. Core Values Section */}
        <div className="mb-5">
          <h2 className="fw-bold text-center mb-5">Why Choose Us?</h2>
          <div className="row g-4">
            
            <div className="col-md-4">
              <div className="text-center p-3">
                <div className="bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: "60px", height: "60px", fontSize: "24px" }}>
                  📦
                </div>
                <h5 className="fw-bold">Fast & Safe Delivery</h5>
                <p className="text-secondary">Safe, secure, and lightning-fast logistics network directly tracking your order to your house.</p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="text-center p-3">
                <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: "60px", height: "60px", fontSize: "24px" }}>
                  🛡️
                </div>
                <h5 className="fw-bold">Secure Payments</h5>
                <p className="text-secondary">Fully encrypted checkouts making sure your financial tokens and transactions remain protected.</p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="text-center p-3">
                <div className="bg-danger text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: "60px", height: "60px", fontSize: "24px" }}>
                  ⭐
                </div>
                <h5 className="fw-bold">Premium Quality</h5>
                <p className="text-secondary">We run rigorous inspection algorithms and checks on every product to maintain top tier standards.</p>
              </div>
            </div>

          </div>
        </div>

        {/* 5. Call To Action (CTA) */}
        <div className="card border-0 bg-warning text-dark rounded-4 p-5 text-center my-5 shadow">
          <h2 className="fw-bold mb-3">Ready to Start Shopping?</h2>
          <p className="fs-5 mb-4 max-w-lg mx-auto">Explore our premium catalog filled with verified amazing products, curated just for you.</p>
          <Link href="/HomePage" className="btn btn-dark btn-lg rounded-pill px-5 fw-bold shadow-sm">
            Browse Products 🛒
          </Link>
        </div>

      </div>
    </>
  );
}