import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { QRCodeSVG } from "qrcode.react";
import {
  FaRupeeSign,
  FaCreditCard,
  FaQrcode,
  FaShoppingCart,
  FaUser,
  FaMobileAlt,
  FaMoneyBillWave,
} from "react-icons/fa";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#0288D1",
        padding: "10px 20px",
        color: "#fff",
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
      }}
    >
      <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>Your Store</h1>
      <div style={{ display: "flex", gap: "10px" }}>
        <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            backgroundColor: "transparent",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            fontSize: "16px",
          }}
          onClick={() => navigate("/cart")}
        >
          <FaShoppingCart /> Cart
        </button>
        <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            backgroundColor: "transparent",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            fontSize: "16px",
          }}
          onClick={() => alert("Navigate to Profile")}
        >
          <FaUser /> Profile
        </button>
      </div>
    </nav>
  );
};

const BuyNowPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { product, quantity, cartDetails, totalPrice } = location.state || {};

  const [userDetails, setUserDetails] = useState({
    name: "",
    address: "",
    city: "",
    email: "",
    pincode: "",
    phone: "",
    paymentMethod: "creditCard",
  });

  const [upiPayment, setUpiPayment] = useState({
    show: false,
    link: "",
    qrData: "",
    qrVisible: false,
  });

  const items = cartDetails || (product ? [{ product, quantity }] : []);
  const calculatedTotal = cartDetails
    ? totalPrice
    : product
    ? product.price * quantity
    : 0;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenerateUPI = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/generate-upi-link",
        { amount: calculatedTotal, orderId: `ORDER_${Date.now()}` }
      );
      setUpiPayment({
        show: true,
        link: response.data.upiLink,
        qrData: response.data.qrData,
        qrVisible: false,
      });
    } catch (err) {
      console.error("UPI Generation Error:", err);
      alert("Failed to generate UPI link. Please try again.");
    }
  };

  const handlePlaceOrder = async () => {
    if (
      !userDetails.name ||
      !userDetails.address ||
      !userDetails.city ||
      !userDetails.email ||
      !userDetails.pincode ||
      !userDetails.phone
    ) {
      alert("Please fill out all required fields.");
      return;
    }

    if (userDetails.paymentMethod === "upi" && !upiPayment.show) {
      alert("Please generate UPI Payment before placing the order.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/orders", {
        items,
        userDetails,
        total: calculatedTotal,
        paymentMethod: userDetails.paymentMethod,
      });

      if (response.data && response.data.orderId) {
        alert("Order placed successfully!");
        navigate("/payment-success", {
          state: {
            orderId: response.data.orderId,
            trackingId: response.data.trackingId,
            transactionId: response.data.transactionId,
            userDetails: userDetails,  // Pass the correct user details
            items: items,              // Pass the correct items array
            total: calculatedTotal,    // Pass the calculated total
            paymentMethod: userDetails.paymentMethod,
          },
        });
      }
    } catch (err) {
      console.error("Order Placement Error:", err.response?.data || err.message);
      alert("Error placing order. Please try again.");
    }
  };

  return (
    <>
      <Navbar />
      <div
        style={{
          padding: "20px",
          maxWidth: "800px",
          margin: "0 auto",
          fontFamily: "'Roboto', sans-serif",
          color: "#333",
        }}
      >
        <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Checkout</h1>

        <div
          style={{
            backgroundColor: "#f9f9f9",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
            marginBottom: "20px",
          }}
        >
          <h2>Order Summary 🛒</h2>
          {items.map((item, index) => (
            <p key={index}>
              {item.product.name} (x{item.quantity}) — ₹
              {item.product.price * item.quantity}
            </p>
          ))}
          <h3>Total: ₹{calculatedTotal}</h3>
        </div>

        <div
          style={{
            backgroundColor: "#fff",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
            marginBottom: "20px",
          }}
        >
          <h2>Shipping Details 📦</h2>
          {["name", "address", "city", "email", "pincode", "phone"].map(
            (field) => (
              <input
                key={field}
                type="text"
                name={field}
                placeholder={field[0].toUpperCase() + field.slice(1)}
                value={userDetails[field]}
                onChange={handleInputChange}
                style={{
                  width: "100%",
                  padding: "10px",
                  margin: "10px 0",
                  borderRadius: "4px",
                  border: "1px solid #ddd",
                }}
              />
            )
          )}
        </div>

        <div
          style={{
            backgroundColor: "#f9f9f9",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
            marginBottom: "20px",
          }}
        >
          <h2><FaCreditCard/> Payment Method</h2>
          <select
            name="paymentMethod"
            value={userDetails.paymentMethod}
            onChange={handleInputChange}
            style={{
              width: "100%",
              padding: "10px",
              margin: "10px 0",
              borderRadius: "4px",
              border: "1px solid #ddd",
            }}
          >
            <option value="creditCard"><FaCreditCard/>Credit Card</option>
            <option value="upi"><FaMobileAlt/>UPI</option>
            <option value="cashOnDelivery"><FaMoneyBillWave/>Cash on Delivery</option>
          </select>
        </div>

        {userDetails.paymentMethod === "upi" && (
          <div>
            <button
              onClick={handleGenerateUPI}
              style={{
                width: "100%",
                padding: "15px",
                marginBottom: "10px",
                color: "#fff",
                backgroundColor: "#0288D1",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              <FaRupeeSign/>Generate UPI Payment Link
            </button>
            {upiPayment.show && (
              <div>
                <a
                  href={upiPayment.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "block",
                    textAlign: "center",
                    color: "#0288D1",
                    textDecoration: "underline",
                    margin: "10px 0",
                  }}
                >
                  Click here to Pay
                </a>
                <button
                  onClick={() =>
                    setUpiPayment((prev) => ({ ...prev, qrVisible: true }))
                  }
                  style={{
                    width: "100%",
                    padding: "15px",
                    color: "#fff",
                    backgroundColor: "#0288D1",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "16px",
                  }}
                >
                  <FaQrcode/>Show QR Code
                </button>
                {upiPayment.qrVisible && (
                  <div style={{ textAlign: "center", marginTop: "20px" }}>
                    <QRCodeSVG value={upiPayment.qrData} size={150} />
                  </div>
                )}
              </div>
            )}
          </div>
        )}
       <br/>
        <button
          onClick={handlePlaceOrder}
          style={{
            width: "100%",
            padding: "15px",
            color: "#fff",
            backgroundColor: "#4CAF50",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          Place Order
        </button>
      </div>
    </>
  );
};

export default BuyNowPage;
