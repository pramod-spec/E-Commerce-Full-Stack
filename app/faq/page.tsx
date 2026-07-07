"use client"; // Client component for interactive search and accordion toggles

import { useState } from "react";

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("");

  // FAQ Data Array (You can change or add questions here based on your project requirements)
  const faqData = [
    {
      id: "faq-1",
      question: "When can I expect my order to be delivered?",
      answer: "Normal orders are delivered within **3 to 5 business days**. Once your order has been shipped, you will receive a tracking link via **SMS and email**.",
    },
    {
      id: "faq-2",
      question: "Can I return the product after it has been delivered?",
      answer: "Yes! We have a 7-day easy return policy. If there is an issue with the product or the size doesn't fit, you can go to the profile section and submit a return request.",
    },
    {
      id: "faq-3",
      question: "Is Cash on Delivery (COD) available?",
      answer: "Yes, we support Cash on Delivery (COD) for almost all pincodes across India. You can select this option on the checkout page.",
    },
    {
      id: "faq-4",
      question: "My payment failed but the money was deducted, what should I do?",
      answer: "Do not worry! If a transaction fails, the money is automatically refunded to your bank account within 3-5 working days. For any ongoing issues, please reach out to our customer support.",
    },
    {
      id: "faq-5",
      question: "Can I change my shipping address after placing the order?",
      answer: "If the order has not been shipped yet, you can change the address directly from your dashboard. If the order has already been shipped, please contact the logistics team or our support helpline directly.",
    }
  ];

  // Filter FAQs based on the real-time search logic
  const filteredFAQs = faqData.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* 1. Top Hero Section */}
      <div className="bg-dark text-white text-center py-5 border-bottom">
        <div className="container py-4">
          <h1 className="fw-bold display-5 text-warning">Frequently Asked Questions ❓</h1>
          <p className="text-light opacity-75 fs-5 mx-auto mb-4" style={{ maxWidth: "600px" }}>
            We have answered the most common questions here to help save your time!
          </p>

          {/* Real-time Search Box */}
          <div className="mx-auto" style={{ maxWidth: "500px" }}>
            <div className="input-group shadow-sm">
              <span className="input-group-text bg-white border-end-0 fs-5">🔍</span>
              <input
                type="text"
                className="form-control border-start-0 py-2.5 rounded-end-3"
                placeholder="Search your question here..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Accordion Container Section */}
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            
            {filteredFAQs.length === 0 ? (
              <div className="text-center py-5 card border-0 bg-light rounded-4">
                <h4 className="text-muted mb-2">No matching questions found! 😔</h4>
                <p className="text-secondary mb-0">Please try searching with different keywords.</p>
              </div>
            ) : (
              <div className="accordion accordion-flush shadow rounded-4 overflow-hidden" id="ecommerceFAQ">
                {filteredFAQs.map((faq, index) => (
                  <div className="accordion-item border-bottom" key={faq.id}>
                    <h2 className="accordion-header" id={`heading-${faq.id}`}>
                      <button
                        className="accordion-button collapsed fw-bold py-3 fs-5 text-dark"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target={`#collapse-${faq.id}`}
                        aria-expanded="false"
                        aria-controls={`collapse-${faq.id}`}
                      >
                        {index + 1}. {faq.question}
                      </button>
                    </h2>
                    <div
                      id={`collapse-${faq.id}`}
                      className="accordion-collapse collapse"
                      aria-labelledby={`heading-${faq.id}`}
                      data-bs-parent="#ecommerceFAQ"
                    >
                      <div className="accordion-body text-secondary lh-base fs-6 bg-light py-4">
                        {faq.answer}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Bottom Support Callout Box */}
            <div className="card border-0 bg-success-subtle text-success-emphasis rounded-4 p-4 mt-5 text-center shadow-sm">
              <h5 className="fw-bold mb-2">Didn't find your answer? 🤔</h5>
              <p className="mb-3 text-secondary">Don't worry, our support team is always ready to help you.</p>
              <a href="/contact" className="btn btn-success rounded-pill px-4 fw-bold">
                Contact Support Directly 🚀
              </a>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}