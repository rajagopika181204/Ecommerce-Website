import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

function PaymentSuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Retrieve order details from location.state or fallback to null
  const orderDetails = location.state?.orderDetails || null;

  const handleContinueShopping = () => {
    navigate("/"); // Redirect to home/shop page
  };

  const handleViewBilling = () => {
    navigate("/billing", { state: { orderDetails } }); // Pass details to billing page
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#f8f9fa",
        fontFamily: "'Roboto', sans-serif",
        color: "#333",
        padding: "20px",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "12px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
          maxWidth: "500px",
          textAlign: "center",
          padding: "30px 20px",
          margin: "20px",
        }}
      >
        <img
          src="https://cdn-icons-png.flaticon.com/512/190/190411.png"
          alt="Success"
          style={{ width: "100px", margin: "20px auto" }}
        />
        <h1 style={{ color: "#28a745", fontSize: "24px", marginBottom: "10px" }}>
          Payment Successful!
        </h1>
        <p style={{ fontSize: "16px", color: "#666", marginBottom: "20px" }}>
          Thank you for your purchase! Your order has been successfully placed.
        </p>

        <div
          style={{
            backgroundColor: "#f8f9fa",
            padding: "15px",
            borderRadius: "8px",
            marginBottom: "20px",
            fontSize: "14px",
            color: "#555",
            textAlign: "left",
          }}
        >
          <h4 style={{ marginBottom: "10px", fontSize: "16px", color: "#333" }}>
            Order Summary
          </h4>
          {orderDetails?.items?.map((item, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "8px",
              }}
            >
              <span>{item.product.name} x {item.quantity}</span>
              <span>₹{item.product.price * item.quantity}</span>
            </div>
          ))}
          <hr style={{ border: "0.5px solid #ddd", margin: "10px 0" }} />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontWeight: "bold",
            }}
          >
            <span>Total</span>
            <span>₹{orderDetails?.total || 0}</span>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-around" }}>
          <button
            onClick={handleContinueShopping}
            style={{
              backgroundColor: "#007bff",
              color: "#fff",
              padding: "10px 20px",
              borderRadius: "6px",
              fontSize: "16px",
              border: "none",
              cursor: "pointer",
              transition: "background-color 0.3s",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#0056b3")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#007bff")}
          >
            Continue Shopping
          </button>

          <button
            onClick={handleViewBilling}
            style={{
              backgroundColor: "#28a745",
              color: "#fff",
              padding: "10px 20px",
              borderRadius: "6px",
              fontSize: "16px",
              border: "none",
              cursor: "pointer",
              transition: "background-color 0.3s",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#1e7e34")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#28a745")}
          >
            View Billing
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaymentSuccessPage;
