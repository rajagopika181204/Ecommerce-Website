import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaCheckCircle, FaArrowRight, FaShoppingCart } from "react-icons/fa";

const PaymentSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Extract data from location.state
  const { 
    orderId, 
    trackingId, 
    transactionId, 
    userDetails, 
    items, 
    total, 
    paymentMethod 
  } = location.state || {};

  // Show error message if essential data is missing
  if (!orderId || !trackingId) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            backgroundColor: "#fff",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
            textAlign: "center",
          }}
        >
          <h1 style={{ color: "#ff4d4f", fontSize: "24px" }}>Error</h1>
          <p>Payment details are missing. Please try again!</p>
          <button
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              color: "#fff",
              backgroundColor: "#4CAF50",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              marginTop: "10px",
            }}
            onClick={() => navigate("/")}
          >
            Go Back to Home
          </button>
        </div>
      </div>
    );
  }

  const handleViewOrders = () => {
     console.log("Navigating to Billing Page with:", {
    orderId,
    trackingId,
    transactionId,
    userDetails,
    items,
    total,
    paymentMethod,
  });
    navigate("/billing", {
      state: {
        orderId,
        trackingId,
        transactionId,
        userDetails,
        items,
        total,
        paymentMethod,
      },
    });
  };

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        maxWidth: "600px",
        margin: "50px auto",
        textAlign: "center",
        backgroundColor: "#fff",
        borderRadius: "15px",
        boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
        animation: "fadeIn 0.5s ease-in-out",
      }}
    >
      <div style={{ marginBottom: "20px" }}>
        <FaCheckCircle size={70} color="#4CAF50" />
        <h1 style={{ color: "#4CAF50", fontSize: "28px", marginTop: "15px" }}>
          Payment Successful!
        </h1>
        <p style={{ color: "#555", fontSize: "16px" }}>
          Thank you for your purchase. Your order is being processed.
        </p>
      </div>

      <div
        style={{
          backgroundColor: "#f9f9f9",
          padding: "15px",
          borderRadius: "10px",
          boxShadow: "0px 2px 6px rgba(0,0,0,0.05)",
          marginBottom: "20px",
          textAlign: "left",
        }}
      >
        <h2 style={{ fontSize: "20px", marginBottom: "10px", color: "#333" }}>
          Order Details
        </h2>
        <p style={{ fontSize: "16px", margin: "5px 0" }}>
          <strong>Order ID:</strong> {orderId}
        </p>
        <p style={{ fontSize: "16px", margin: "5px 0" }}>
          <strong>Tracking ID:</strong> {trackingId}
        </p>
         {paymentMethod === "upi" && transactionId && (
        <p style={{ fontSize: "16px", margin: "5px 0" }}>
          <strong>Transaction ID:</strong> {transactionId}
        </p>
         )}
      </div>

      <button
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "12px 20px",
          fontSize: "16px",
          color: "#fff",
          backgroundColor: "#4CAF50",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          margin: "10px auto 0",
          transition: "background-color 0.3s ease",
        }}
        onClick={() => navigate("/")}
      >
        Go to Home <FaArrowRight style={{ marginLeft: "10px" }} />
      </button>
      <button
        style={{
          display: "flex",
          alignItems: "center",
          padding: "12px 20px",
          fontSize: "16px",
          color: "#fff",
          backgroundColor: "#4CAF50",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          transition: "background-color 0.3s ease",
          marginTop: "10px",
        }}
        onClick={handleViewOrders}
      >
        <FaShoppingCart style={{ marginRight: "10px" }} /> View Orders
      </button>
    </div>
  );
};

export default PaymentSuccessPage;
