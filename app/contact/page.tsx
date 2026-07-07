"use client"; // Client component form submissions aur inputs handle karne ke liye

import { useState } from "react";
import { FaLocationDot } from "react-icons/fa6";
import { FaEnvelope } from "react-icons/fa";
import { FaPhoneAlt } from "react-icons/fa";

export default function ContactPage() {
  // Form input states
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  // Input change handler
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Form submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Yahan aap apna actual API routes path call kar sakte hain backend integration ke waqt
      // const res = await fetch("/api/contact", { method: "POST", body: JSON.stringify(formData) });
      
      // Temporary check action simulate karne ke liye alert loop
      console.log("Contact form data submitted:", formData);
      alert("We Recieved Your Message, Our Team Will Connect You As Soon As Possible");
      
      // Reset Form fields
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      console.error("Error submitting contact form:", error);
      alert("Try Again Later");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* 1. Header Section */}
      <div className="bg-light text-center py-5 border-bottom">
        <div className="container py-3">
          <h1 className="fw-bold display-5 text-dark">Contact Us</h1>
          <p className="text-secondary fs-5 mx-auto" style={{ maxWidth: "600px" }}>
           If You have Any Isuue With Our Platform/Product , Please Contact With Us, We Make Sure Solve Your Issue.
          </p>
        </div>
      </div>

      <div className="container py-5">
        <div className="row g-5">
          
          {/* Left Column: Contact Details & Info */}
          <div className="col-lg-5">
            <h3 className="fw-bold mb-4 text-primary">Get In Touch</h3>
            <p className="text-secondary mb-4">
              You Can Connect Us on Our Another Platform OR You can Fill this Form To Connect Us.
            </p>

            {/* Info Cards */}
            <div className="d-flex align-items-start mb-4">
              <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3 shadow-sm" style={{ width: "50px", height: "50px", minWidth: "50px", fontSize: "20px" }}>
                <FaLocationDot size={40} />
              </div>
              <div>
                <h5 className="fw-bold mb-1">Our Location</h5>
                <p className="text-secondary mb-0">Delhi, New Delhi, India</p>
              </div>
            </div>

            <div className="d-flex align-items-start mb-4">
              <div className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center me-3 shadow-sm" style={{ width: "50px", height: "50px", minWidth: "50px", fontSize: "20px" }}>
                <FaEnvelope size={40} />
              </div>
              <div>
                <h5 className="fw-bold mb-1">Email Support</h5>
                <p className="text-secondary mb-0">pramod200419@gmail.com</p>
              </div>
            </div>


            <a href="tel:+917838095673" style={{textDecoration:"none", color:"black"}}>
            <div className="d-flex align-items-start mb-4">
              <div className="bg-warning text-dark rounded-circle d-flex align-items-center justify-content-center me-3 shadow-sm" style={{ width: "50px", height: "50px", minWidth: "50px", fontSize: "20px" }}>
                <FaPhoneAlt size={40} />
              </div>
              <div>
                <h5 className="fw-bold mb-1">Call / WhatsApp</h5>
                <p className="text-secondary mb-0">+91 7838095673</p>
              </div>
            </div>
            
            </a>

            <hr className="my-4 text-muted" />

            {/* Timings */}
            <h5 className="fw-bold mb-2">Business Hours</h5>
            <p className="text-secondary mb-1">24/7</p>
            {/* <p className="text-secondary">📅 Sunday: Closed</p> */}
          </div>

          {/* Right Column: Contact Form */}
          <div className="col-lg-7">
            <div className="card shadow border-0 rounded-4 p-4 p-md-5 bg-white">
              <h3 className="fw-bold mb-4">Send Us A Message</h3>
              
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Your Name</label>
                    <input
                      type="text"
                      name="name"
                      className="form-control rounded-3 py-2.5"
                      placeholder="Enter name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      className="form-control rounded-3 py-2.5"
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label small fw-semibold">Subject</label>
                    <input
                      type="text"
                      name="subject"
                      className="form-control rounded-3 py-2.5"
                      placeholder="Subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label small fw-semibold">Message</label>
                    <textarea
                      name="message"
                      className="form-control rounded-3"
                      rows={5}
                      placeholder="Please Input Your Issue In Details"
                      value={formData.message}
                      onChange={handleChange}
                      required
                    ></textarea>
                  </div>

                  <div className="col-12 mt-4">
                    <button
                      type="submit"
                      className="btn btn-primary w-100 py-3 fw-bold rounded-pill shadow"
                      disabled={loading}
                    >
                      {loading ? "Sending..." : "Send Message 🚀"}
                    </button>
                  </div>

                </div>
              </form>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}