"use client";


import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaPinterest } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const router = useRouter()

  // Load Products
  const loadProducts = async () => {
    try {
      const res = await fetch("/api/add-product");

      if (!res.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await res.json();
      

      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log("Error loading products:", error);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);


  const addToCart = async(productId: string)=>{
    const res = await fetch("/api/cart",{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
      },
      body: JSON.stringify({
        productId,
      })
    })

    const data = await res.json()

    alert(data.message || data.error)
  }


  const buyNow=(productId: string)=>{
    router.push(`/checkout?productId=${productId}`)
  }

  return (
    <div className="container py-4">
      {/* Categories */}
      <div className="row">
        <div className="col-12">
          <div className="d-flex flex-wrap justify-content-center gap-4 text-center">
            <a href="/new-arrival" style={{ textDecoration: "none", color: "black" }}>
              <b>New Arrivals</b>
            </a>

            <a href="/men" style={{ textDecoration: "none", color: "black" }}>
              <b>Men</b>
            </a>

            <a href="/women" style={{ textDecoration: "none", color: "black" }}>
              <b>Women</b>
            </a>

            <a href="/living" className="nav-link disabled" aria-disabled="true" style={{ textDecoration: "none", color: "black" }}>
              <b>Home & Living</b>
            </a>

            <a href="/electronics" style={{ textDecoration: "none", color: "black" }}>
              <b>Electronics</b>
            </a>

            <a href="/Sales&Offers" style={{ textDecoration: "none", color: "black" }}>
              <b>Sales & Offers</b>
            </a>
          </div>
        </div>
      </div>

      {/* Services */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="d-flex flex-wrap justify-content-center gap-4 text-center">
            <a href="/FreeShiping" style={{ textDecoration: "none", color: "black" }}>
              <b>Free Shipping</b>
            </a>

            <a href="#" style={{ textDecoration: "none", color: "black" }}>
              <b>Easy Returns</b>
            </a>

            <a href="#" style={{ textDecoration: "none", color: "black" }}>
              <b>Secure Payments</b>
            </a>

            <a href="#" style={{ textDecoration: "none", color: "black" }}>
              <b>24/7 Support</b>
            </a>
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <div className="row mt-5">
        <div className="col-12">
          <h2 className="mb-4">
            <b>Featured Products</b>
          </h2>
        </div>

        <div
          className="col-12 col-md-6 mb-4"
          style={{ backgroundColor: "rgb(241,242,219)" }}
        >
          <Image
            src="/fs.png"
            alt="Featured Product"
            width={600}
            height={600}
            className="img-fluid"
            style={{ width: "100%", height: "auto" }}
          />

          {/* <button
            className="btn w-100 fs-4 mt-2"
            style={{
              backgroundColor: "rgb(241,242,219)",
              border: "none",
            }}
          >
            <b>Shop Now</b>
          </button> */}
        </div>

        <div
          className="col-12 col-md-6 mb-4"
          style={{ backgroundColor: "rgb(241,242,219)" }}
        >
          <Image
            src="/fs-two.png"
            alt="Featured Product Two"
            width={600}
            height={600}
            className="img-fluid"
            style={{ width: "100%", height: "auto" }}
          />

          {/* <button
            className="btn w-100 fs-4 mt-2"
            style={{
              backgroundColor: "rgb(241,242,219)",
              border: "none",
            }}
          >
            <b>Shop Now</b>
          </button> */}
        </div>
      </div>

      {/* Products Section */}
      <div className="row mt-5">
        <div className="col-12">
          <h1>Popular Products</h1>
        </div>

        {/* <div className="d-flex gap-2 overflow-auto"> */}

        {products.length > 0 ? (
          products.map((p:any) => (
            <div className="col-md-4 mb-4" key={p._id || p.id}>
              
              <div className="card h-100">
                <Link href={`/add-product/${p.id}`} >
                {p.images?.[0] && (
                  <img
                    src={p.images[0]}
                    className="card-img-top"
                    alt={p.name}
                    style={{ height: "150px", objectFit: "cover" }}
                  />
                )}
                </Link>

                <div className="card-body">
                  <h5 className="card-title">{p.name}</h5>
                  { <p className="card-text">
                    <strong>Discount: {p.discountpercentage}%</strong><br />
                    <strong>₹{p.discountprice}</strong>
                  </p> }
                  <p className="card-text">
                    <strong>{p.rating}</strong>
                  </p>
                  
                  <div className="d-flex flex-row gap-5">
                  {/* <p className="card-text">{p.description}</p> */}
                  <button type="button" className="btn btn-outline-success text-center w-50" onClick={()=> addToCart(p.id)}>Add To Cart</button>
                  <button type="button" className="btn btn-outline-warning text-center w-50" onClick={()=> buyNow(p.id)}>Buy Now</button>
                  </div>
                  
                
                </div>
                
              </div>

              
            </div>
            
          ))
        ) : (
          <div className="col-12">
            <p>No products found.</p>
          </div>
        )}
        {/* </div> */}
      </div>





          {/* FOOTER */}
     <div className="row">
  <div className="col-12 d-flex justify-content-center align-items-center gap-4 flex-wrap py-3">

    <a href="/about" className="text-decoration-none text-dark fw-bold fs-4">
      About Us
    </a>

    <a href="/contact" className="text-decoration-none text-dark fw-bold fs-4">
      Contact Us
    </a>

    <a href="/faq" className="text-decoration-none text-dark fw-bold fs-4">
      FAQ
    </a>

    {/* <a href="#" className="text-decoration-none text-dark fw-bold fs-4">
      Shipping
    </a> */}

    <a href="https://www.facebook.com/" className="text-dark fs-3">
      <FaFacebook />
    </a>

    <a href="https://www.instagram.com/" className="text-dark fs-3">
      <FaInstagram />
    </a>

    <a href="https://x.com/" className="text-dark fs-3">
      <FaXTwitter />
    </a>

    <a href="https://in.pinterest.com/" className="text-dark fs-3">
      <FaPinterest />
    </a>

    <a href="https://www.youtube.com/" className="text-dark fs-3">
      <FaYoutube />
    </a>

  </div>
</div>
    </div>
  );
}