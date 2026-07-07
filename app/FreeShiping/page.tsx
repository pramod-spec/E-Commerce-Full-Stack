import { FaTruck, FaBox, FaRegHeart } from "react-icons/fa";
import { FaMedal, FaTruckFast } from "react-icons/fa6";

export default function FreeShiping() {
  return (
    <div className="container py-5">
      {/* Hero Section */}
      <div
        className="row align-items-center rounded-4 p-5"
        style={{ backgroundColor: "#e2f0fc" }}
      >
        <div className="col-md-6">
          <p className="fw-bold text-primary">
            <FaTruck className="me-2" />
            AVAILABLE STOREWIDE
          </p>

          <h1 className="fw-bold display-4">FREE SHIPPING</h1>
          <h1 className="fw-bold display-4">ON ALL ORDERS</h1>

          <p className="fs-5 text-secondary mt-3">
            Shop your favorites and get them delivered to your door — on us.
          </p>

          <a href="/HomePage">
            <button className="btn btn-primary btn-lg mt-4">
              <FaBox className="me-2" />
              START SHOPPING
            </button>
          </a>
        </div>

        <div className="col-md-6 text-center">
          <img
            src="/FreeShipping.jpeg"
            alt="Free Shipping"
            className="img-fluid"
            style={{ maxHeight: "450px" }}
          />
        </div>
      </div>

      {/* Features */}
      <div className="text-center mt-5">
        <p className="fw-bold text-primary">WHY SHOP WITH US?</p>
        <h2 className="fw-bold mb-5">Enjoy More, Worry Less</h2>

        <div className="row g-4">
          <div className="col-md-3">
            <div className="border rounded-4 p-4 h-100 shadow-sm text-center">
              <FaTruck size={45} className="text-primary mb-3" />
              <h5 className="fw-bold">Free Shipping</h5>
              <p className="text-muted">
                On all orders, every time.
              </p>
            </div>
          </div>

          <div className="col-md-3">
            <div className="border rounded-4 p-4 h-100 shadow-sm text-center">
              <FaMedal size={45} className="text-warning mb-3" />
              <h5 className="fw-bold">No Minimums</h5>
              <p className="text-muted">
                No hidden fees or minimum purchase.
              </p>
            </div>
          </div>

          <div className="col-md-3">
            <div className="border rounded-4 p-4 h-100 shadow-sm text-center">
              <FaTruckFast size={45} className="text-success mb-3" />
              <h5 className="fw-bold">Fast Delivery</h5>
              <p className="text-muted">
                Quick and reliable delivery to your door.
              </p>
            </div>
          </div>

          <div className="col-md-3">
            <div className="border rounded-4 p-4 h-100 shadow-sm text-center">
              <FaRegHeart size={45} className="text-danger mb-3" />
              <h5 className="fw-bold">Hassle-Free</h5>
              <p className="text-muted">
                Easy returns and friendly customer support.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}