"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

// 1. TypeScript Interfaces
interface ProductDetails {
  id: string;
  name: string;
  images: string[];
  description?: string;
  size?: string;
  color?: string;
}

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: ProductDetails;
}

interface Order {
  id: string;
  total: number;
  status: string; // "Order Placed" | "Processing" | "Shipped" | "Delivered"
  trackingNumber?: string | null;      // Schema support
  estimatedDelivery?: string | null;  // Schema support
  createdAt: string;
  items: OrderItem[];
}

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);

  // 🚀 TRACKING POP-UP STATES
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);

  // 2. API se orders fetch karne ka logic
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/my-orders");
        
        if (res.status === 401) {
          setIsLoggedIn(false);
          return;
        }

        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        }
      } catch (error) {
        console.error("Frontend orders loading error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // 3. Loading State Layout
  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status"></div>
        <h3 className="mt-3">Your Orders Are Loading...</h3>
      </div>
    );
  }

  // 4. Unauthorized State Layout
  if (!isLoggedIn) {
    return (
      <div className="container mt-5 text-center">
        <h3 className="text-danger">Please Login First</h3>
        <Link href="/login" className="btn btn-primary mt-3 px-4 rounded-pill">
          Go To Login page
        </Link>
      </div>
    );
  }

  // Schema Status Mapping Array
  const trackingStatuses = ["Order Placed", "Processing", "Shipped", "Delivered"];
  const getStatusIndex = (status: string) => {
    if (status === "Paid") return 0; // Fallback handles
    return trackingStatuses.indexOf(status);
  };

  // 5. Main UI Render
  return (
    <div className="container mt-5">
      <h2 className="fw-bold mb-4">📦 Order History</h2>

      {orders.length === 0 ? (
        <div className="text-center py-5 border rounded bg-light shadow-sm">
          <h4>Your Order Is Empty!</h4>
          <Link href="/" className="btn btn-warning mt-3 px-4 fw-bold rounded-pill">
            Explore Shop
          </Link>
        </div>
      ) : (
        <div className="row">
          {orders.map((order) => (
            <div className="col-12 mb-4" key={order.id}>
              <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
                
                {/* Card Header */}
                <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center p-3">
                  <div>
                    <span className="text-muted small">Order ID:</span>{" "}
                    <span className="font-monospace text-warning">{order.id.slice(-8)}</span>
                  </div>
                  <div>
                    <span 
                      className={`badge ${
                        order.status === "Paid" || order.status === "Delivered" ? "bg-success" : "bg-warning text-dark"
                      } fs-6`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="card-body p-4 bg-white">
                  {order.items?.map((item) => (
                    <div className="row align-items-start mb-4 border-bottom pb-4" key={item.id}>
                      
                      {/* IMAGE LINK */}
                      <div className="col-md-2 col-sm-3 col-4">
                        <Link href={`/product/${item.product?.id}`} className="text-decoration-none">
                          <img
                            src={item.product?.images?.[0] || "https://via.placeholder.com/150"}
                            alt={item.product?.name}
                            className="img-fluid rounded-3 shadow-sm border"
                            style={{ 
                              maxHeight: "110px", 
                              width: "100%", 
                              objectFit: "cover",
                              cursor: "pointer",
                              transition: "transform 0.2s ease"
                            }}
                            onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
                            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
                          />
                        </Link>
                      </div>

                      {/* PRODUCT DETAILS SECTION */}
                      <div className="col-md-7 col-sm-6 col-8">
                        <Link 
                          href={`/product/${item.product?.id}`} 
                          className="text-decoration-none text-dark"
                        >
                          <h4 
                            className="fw-bold mb-1 text-hover-blue" 
                            style={{ cursor: "pointer", transition: "color 0.2s" }}
                            onMouseOver={(e) => (e.currentTarget.style.color = "#0d6efd")}
                            onMouseOut={(e) => (e.currentTarget.style.color = "#212529")}
                          >
                            {item.product?.name}
                          </h4>
                        </Link>
                        
                        <div className="d-flex flex-wrap gap-2 my-2">
                          <span className="badge bg-light text-dark border">
                            Size: {item.product?.size || "Standard"}
                          </span>
                          <span className="badge bg-light text-dark border">
                            Color: {item.product?.color || "N/A"}
                          </span>
                          <span className="badge bg-secondary-subtle text-secondary-emphasis">
                            Qty: {item.quantity}
                          </span>
                        </div>

                        <p className="text-muted small mb-0" style={{ fontSize: "0.9rem", lineHeight: "1.4" }}>
                          <strong>Description:</strong>{" "}
                          {item.product?.description || "No description available for this product."}
                        </p>
                      </div>

                      {/* Pricing Columns */}
                      <div className="col-md-3 col-sm-3 col-12 text-md-end mt-2 mt-sm-0">
                        <span className="text-muted small d-block">Price: ₹{item.price}</span>
                        <h5 className="text-success fw-bold mt-1">Total: ₹{item.price * item.quantity}</h5>
                      </div>

                    </div>
                  ))}

                  {/* Order Grand Total Footer */}
                  <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center mt-2 pt-2">
                    <span className="text-secondary small mb-2 mb-sm-0">
                      Ordered on: {new Date(order.createdAt).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                    <div className="d-flex align-items-center gap-3">
                      <h3 className="mb-0 fs-4 fw-semibold">
                        Grand Total: <span className="text-primary fw-bold">₹{order.total}</span>
                      </h3>
                      
                      {/* 🚀 FIXED: TRACK ORDER BUTTON MODAL TRIGGER */}
                      <button 
                        onClick={() => { setSelectedOrder(order); setShowModal(true); }}
                        className="btn btn-primary btn-sm px-3 rounded-pill fw-bold"
                      >
                        🚚 Track Order
                      </button>
                    </div>
                  </div>

                </div>

              </div>
            </div>
          ))}
        </div>
      )}

      {/* ======================================================== */}
      {/* 🛠️ LIVE TRACKING MODAL POP-UP (Bootstrap Design)        */}
      {/* ======================================================== */}
      {showModal && selectedOrder && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }} role="dialog">
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 rounded-4 p-3 shadow-lg">
              
              {/* Modal Header */}
              <div className="modal-header border-0 pb-0">
                <h4 className="modal-title fw-bold">📍 Live Order Tracking</h4>
                <button type="button" className="btn-close" onClick={() => { setShowModal(false); setSelectedOrder(null); }}></button>
              </div>

              {/* Modal Body */}
              <div className="modal-body py-4">
                <p className="text-muted small">Order ID: <span className="font-monospace text-primary">{selectedOrder.id}</span></p>
                
                {/* Schema Estimated Delivery Display */}
                <div className="mb-4">
                  {selectedOrder.estimatedDelivery ? (
                    <span className="badge bg-info-subtle text-info-emphasis p-2 fs-6 rounded-3">
                      📅 Expected Delivery: {new Date(selectedOrder.estimatedDelivery).toLocaleDateString("en-IN", { day: 'numeric', month: 'short' })}
                    </span>
                  ) : (
                    <span className="badge bg-light text-muted p-2 border rounded-3">
                      Est. Delivery: 3-5 Working Days
                    </span>
                  )}
                </div>

                {/* LIVE TIMELINE PROGRESS BAR */}
                <div className="row justify-content-between text-center my-5 position-relative">
                  {/* Background Gray Line */}
                  <div className="position-absolute top-50 start-0 translate-y-50 bg-secondary-subtle" style={{ height: "4px", width: "100%", zIndex: 1, transform: "translateY(-50%)" }}></div>
                  
                  {/* Active Green Progress Line */}
                  <div 
                    className="position-absolute top-50 start-0 bg-success" 
                    style={{ 
                      height: "4px", 
                      width: `${Math.max(0, getStatusIndex(selectedOrder.status)) / (trackingStatuses.length - 1) * 100}%`, 
                      zIndex: 1, 
                      transform: "translateY(-50%)",
                      transition: "width 0.4s ease"
                    }}
                  ></div>

                  {/* Tracking Nodes */}
                  {trackingStatuses.map((step, idx) => {
                    const isDone = idx <= getStatusIndex(selectedOrder.status);
                    return (
                      <div className="col-3 position-relative" style={{ zIndex: 2 }} key={step}>
                        <div className={`rounded-circle d-inline-flex align-items-center justify-content-center border-4 ${isDone ? "bg-success border-success text-white" : "bg-white border-secondary-subtle text-muted"}`} style={{ width: "38px", height: "38px", fontWeight: "bold" }}>
                          {isDone ? "✓" : idx + 1}
                        </div>
                        <h6 className={`mt-2 small fw-bold ${isDone ? "text-success" : "text-muted"}`}>{step}</h6>
                      </div>
                    );
                  })}
                </div>

                {/* Courier tracking number if available in Schema */}
                {selectedOrder.trackingNumber && (
                  <div className="alert alert-secondary border-0 rounded-3 small">
                    📦 <strong>Courier Tracking No:</strong> {selectedOrder.trackingNumber}
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="modal-footer border-0 pt-0">
                <button type="button" className="btn btn-secondary rounded-pill px-4 btn-sm" onClick={() => { setShowModal(false); setSelectedOrder(null); }}>Close</button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}