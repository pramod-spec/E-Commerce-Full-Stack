"use client"; // 1. Isko client component bana diya taaki direct click handlers chal sakein

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProductPage({ params }: PageProps) {
  const router = useRouter();
  
  // unwrapping async params using React's use() hook
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 💬 Reviews and Comments States
  const [reviews, setReviews] = useState<any[]>([]);
  const [commentText, setCommentText] = useState("");
  const [commentRating, setCommentRating] = useState("5");
  const [submittingComment, setSubmittingComment] = useState(false);

  // 2. Client-side par product aur uske reviews fetch karna
  useEffect(() => {
    const fetchProductAndReviews = async () => {
      try {
        // Fetch Product Details
        const res = await fetch(`/api/add-product/${id}`, {
          cache: "no-store",
        });
        if (res.ok) {
          const data = await res.json();
          setProduct(data);
        }

        // Fetch Reviews Array
        const reviewRes = await fetch(`/api/reviews?productId=${id}`);
        if (reviewRes.ok) {
          const reviewData = await reviewRes.json();
          if (Array.isArray(reviewData)) {
            setReviews(reviewData);
          }
        }
      } catch (error) {
        console.log("Error fetching page details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProductAndReviews();
    }
  }, [id]);

  // 3. Handlers for Add To Cart and Buy Now
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

  // 💬 Form Handler for submitting new review/comment
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return alert("Comment khali nahi chhod sakte!");

    setSubmittingComment(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: id,
          comment: commentText,
          rating: Number(commentRating),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        // UI list me naya review sabse upar add karne ke liye
        setReviews([data.review, ...reviews]);
        setCommentText("");
        setCommentRating("5");
        alert(data.message || "Review post ho gaya!");
      } else {
        alert(data.error || "Review post karne me error aaya.");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Server response error. Phir se try karein.");
    } finally {
      setSubmittingComment(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <h3>Loading Product Details...</h3>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container py-5 text-center">
        <h1 className="text-danger">Product Not Found</h1>
      </div>
    );
  }

  return (
    <>
      <div className="container py-5">
        <div className="row g-5">

          {/* Left Side - Product Images */}
          <div className="col-lg-6">
            <div
              id="productCarousel"
              className="carousel slide shadow rounded overflow-hidden"
              data-bs-ride="carousel"
            >
              <div className="carousel-inner">
                {product.images?.map((img: string, index: number) => (
                  <div
                    key={index}
                    className={`carousel-item ${index === 0 ? "active" : ""}`}
                  >
                    <img
                      src={img}
                      className="d-block w-100"
                      alt="Product"
                      style={{
                        height: "550px",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                ))}
              </div>

              <button
                className="carousel-control-prev"
                type="button"
                data-bs-target="#productCarousel"
                data-bs-slide="prev"
              >
                <span className="carousel-control-prev-icon"></span>
              </button>

              <button
                className="carousel-control-next"
                type="button"
                data-bs-target="#productCarousel"
                data-bs-slide="next"
              >
                <span className="carousel-control-next-icon"></span>
              </button>
            </div>
          </div>

          {/* Right Side */}
          <div className="col-lg-6">
            <span className="badge bg-danger fs-6 mb-3">
              {product.discountpercentage}% OFF
            </span>

            <h1 className="fw-bold">{product.name}</h1>

            <h5 className="text-warning mb-3">{product.rating}</h5>

            <div className="card border-0 shadow rounded-4 p-4">
              <h2 className="text-success fw-bold">₹{product.discountprice}</h2> 

              <h5 className="text-muted">
                <s>₹{product.originalprice}</s>
              </h5>

              <hr />

              <div className="row text-center">
                <div className="col-6">
                  <div className="border rounded p-3">
                    <h6 className="text-secondary">Size</h6>
                    <h5>{product.size || "N/A"}</h5>
                  </div>
                </div>

                <div className="col-6">
                  <div className="border rounded p-3">
                    <h6 className="text-secondary">Color</h6>
                    <h5>{product.color || "N/A"}</h5>
                  </div>
                </div>
              </div>

              <hr />

              <h4>About this Product</h4>
              <p className="text-secondary">{product.description}</p>
            </div>
          </div>

        </div>

        {/* Price Comparison */}
        <div className="card shadow border-0 rounded-4 mt-4">
          <div className="card-body">
            <h3 className="fw-bold mb-4">Price Comparison</h3>

            <div className="row">
              <div className="col-md-4 mb-3">
                <div className="border rounded text-center p-3">
                  <h6>Original Price</h6>
                  <h4>
                    <s>₹{product.originalprice}</s>
                  </h4>
                </div>
              </div>

              <div className="col-md-4 mb-3">
                <div className="bg-danger text-white rounded text-center p-3">
                  <h6>Discount</h6>
                  <h4>{product.discountpercentage}%</h4>
                </div>
              </div>

              <div className="col-md-4 mb-3">
                <div className="bg-success text-white rounded text-center p-3">
                  <h6>Final Price</h6>
                  <h4>₹{product.discountprice}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 💬 REVIEWS & COMMENTS DISPLAY AND FORM SECTION           */}
        {/* ======================================================== */}
        <div className="card shadow border-0 rounded-4 mt-5 p-4">
          <h3 className="fw-bold mb-4">Customer Reviews & Comments 💬</h3>

          {/* Review Post Form */}
          <form onSubmit={handleCommentSubmit} className="bg-light p-4 rounded-3 mb-4 border">
            <h5 className="fw-bold mb-3">Add Your Review</h5>
            <div className="row g-3">
              <div className="col-md-12">
                <label className="form-label small fw-semibold">Rating ⭐</label>
                <select className="form-select rounded-3" value={commentRating} onChange={(e) => setCommentRating(e.target.value)}>
                  <option value="5">5 Stars ⭐⭐⭐⭐⭐</option>
                  <option value="4">4 Stars ⭐⭐⭐⭐</option>
                  <option value="3">3 Stars ⭐⭐⭐</option>
                  <option value="2">2 Stars ⭐⭐</option>
                  <option value="1">1 Star ⭐</option>
                </select>
              </div>
              <div className="col-12">
                <label className="form-label small fw-semibold">Your Comment</label>
                <textarea
                  className="form-control rounded-3"
                  rows={3}
                  placeholder="Share your experience about this product..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  required
                ></textarea>
              </div>
              <div className="col-12">
                <button type="submit" className="btn btn-primary rounded-pill px-4 fw-bold" disabled={submittingComment}>
                  {submittingComment ? "Submitting..." : "Submit Review"}
                </button>
              </div>
            </div>
          </form>

          {/* Render Active Reviews */}
          <div className="reviews-list mt-3">
            {reviews.length === 0 ? (
              <p className="text-muted text-center py-3">Your feedback is important for us</p>
            ) : (
              reviews.map((rev) => (
                <div key={rev.id} className="border-bottom py-3">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <h6 className="fw-bold mb-0 text-dark">{rev.user?.name || "Anonymous User"}</h6>
                    <span className="text-warning small">{"⭐".repeat(rev.rating)}</span>
                  </div>
                  <p className="text-secondary mb-1 small">{rev.comment}</p>
                  <small className="text-muted" style={{ fontSize: "0.8rem" }}>
                    {new Date(rev.createdAt).toLocaleDateString("en-IN")}
                  </small>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Bottom Space */}
        <div style={{ height: "100px" }}></div>
      </div>

      {/* Fixed Bottom Buttons */}
      <div className="fixed-bottom bg-white border-top shadow-lg p-3">
        <div className="container">
          <div className="row g-3">
            <div className="col-6">
              <button 
                type="button" 
                className="btn btn-outline-success w-100 py-3 fw-bold rounded-pill" 
                onClick={() => addToCart(product.id)}
              >
                Add To Cart
              </button>
            </div>

            <div className="col-6">
              <button 
                type="button" 
                className="btn btn-warning w-100 py-3 fw-bold rounded-pill" 
                onClick={() => buyNow(product.id)}
              >
                ⚡ Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}