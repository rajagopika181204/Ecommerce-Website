import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { QRCodeSVG } from "qrcode.react";
import { FaRupeeSign, FaQrcode,FaCreditCard  } from "react-icons/fa";

const Navbar = () => {
  const navigate = useNavigate();  // <-- FIX: get navigate here

  return (
    <nav
      style={{
        width: "100%",
        height: "60px",
        padding: "0px 20px",
        backgroundColor: "#4CAF50",
        color: "white",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        position: "sticky",
        top: "0",
        zIndex: "1000",
      }}
    >
      <h1 style={{ margin: 0, fontSize: "20px" }}>Your Store</h1>
      <div>
        <button
          style={{
            backgroundColor: "transparent",
            color: "white",
            border: "none",
            fontSize: "16px",
            marginRight: "15px",
            cursor: "pointer",
          }}
          onClick={() => navigate("/cart")}
        >
          Cart
        </button>
        <button
          style={{
            backgroundColor: "transparent",
            color: "white",
            border: "none",
            fontSize: "16px",
            cursor: "pointer",
          }}
          onClick={() => alert("Navigate to Profile")}
        >
          Profile
        </button>
      </div>
    </nav>
  );
};

function BuyNowPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { product, quantity, cartDetails, totalPrice } = location.state || {};

  const [userDetails, setUserDetails] = useState({
    name: "",
    address: "",
    phone: "",
    paymentMethod: "creditCard",
  });

  const [upiPayment, setUpiPayment] = useState({
    show: false,
    link: "",
    showQR: false,
    qrData: "",
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

  const handleUpiPayment = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/generate-upi-link",
        {
          amount: calculatedTotal,
          orderId: `order_${Date.now()}`,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      setUpiPayment({
        show: true,
        link: response.data.upiLink,
        qrData: response.data.qrData,
        showQR: false,
      });
    } catch (err) {
      console.error("UPI Error:", err.response?.data || err.message);
      alert("Failed to generate UPI link. Check console for details.");
    }
  };

  const handlePlaceOrder = async () => {
    if (!userDetails.name || !userDetails.address || !userDetails.phone) {
        alert("Please fill out all required fields.");
        return;
    }

    try {
        for (const item of items) {
            const res = await fetch("http://localhost:5000/api/update-stock", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    productId: item.product.id,
                    quantityPurchased: item.quantity,
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Stock update failed");
        }

        const orderDetails = {
            items,
            userDetails,
            total: calculatedTotal,
            paymentMethod: userDetails.paymentMethod, // Include payment method
        };

        alert("Order placed successfully!");
        navigate("/payment-success", { state: { orderDetails } }); // Navigate to Payment Success
    } catch (err) {
        alert("Error placing order: " + err.message);
        console.error(err);
    }

    if (userDetails.paymentMethod === "upi") {
      if (!upiPayment.show) {
        alert("Please generate UPI payment link first");
        return;
      }
      // UPI payment flow assumed handled separately
      return;
    }

  };

  return (
    <>
      <Navbar />
      <div
        style={{
          padding: "20px",
          fontFamily: "Arial, sans-serif",
          maxWidth: "800px",
          margin: "0 auto",
        }}
      >
        <h1 style={{ textAlign: "center", marginBottom: "20px", color: "white" }}>
          Checkout
        </h1>

        {/* Order Summary */}
        <div
          style={{
            backgroundColor: "#f9f9f9",
            padding: "15px",
            borderRadius: "8px",
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

        {/* Shipping Form */}
        <div
          style={{
            backgroundColor: "#fff",
            padding: "15px",
            borderRadius: "8px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          }}
        >
          <h2>Shipping Details 📦</h2>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={userDetails.name}
            onChange={handleInputChange}
            style={inputStyle}
            required
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={userDetails.address}
            onChange={handleInputChange}
            style={inputStyle}
            required
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={userDetails.phone}
            onChange={handleInputChange}
            style={inputStyle}
            required
          />

          <h2><FaCreditCard />  Payment Method</h2>
          <select
            name="paymentMethod"
            value={userDetails.paymentMethod}
            onChange={handleInputChange}
            style={inputStyle}
          >
            <option value="creditCard">💳 Credit Card</option>
            <option value="debitCard">💳 Debit Card</option>
            <option value="cashOnDelivery">💵 Cash on Delivery</option>
            <option value="upi">📱 UPI (GPay/PhonePe)</option>
          </select>

          {/* UPI Payment Section */}
          {userDetails.paymentMethod === "upi" && (
            <div style={{ marginTop: "15px" }}>
              <button
                onClick={handleUpiPayment}
                style={{
                  ...buttonStyle,
                  backgroundColor: "#3366CC",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                }}
              >
                <FaRupeeSign /> Generate UPI Payment Link
              </button>

              {upiPayment.show && (
                <div style={{ marginTop: "15px" }}>
                  <button
                    onClick={() =>
                      setUpiPayment((p) => ({ ...p, showQR: !p.showQR }))
                    }
                    style={{
                      ...buttonStyle,
                      backgroundColor: "#6c757d",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <FaQrcode /> <center>{upiPayment.showQR ? "Hide QR" : "Show QR"}</center>
                  </button>

                  {upiPayment.showQR && (
                    <div style={{ textAlign: "center", marginTop: "15px" }}>
                      <QRCodeSVG value={upiPayment.qrData} size={150} level="H" />
                      <p style={{ marginTop: "5px" }}>Scan to Pay</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Place Order Button */}
        <button
          onClick={handlePlaceOrder}
          style={{
            ...buttonStyle,
            marginTop: "20px",
            backgroundColor:
              userDetails.paymentMethod === "upi" && !upiPayment.show
                ? "#ccc"
                : "#4CAF50",
          }}
          disabled={userDetails.paymentMethod === "upi" && !upiPayment.show}
        >
          {userDetails.paymentMethod === "upi"
            ? "Complete UPI Payment"
            : "Place Order"}
        </button>
      </div>
    </>
  );
}

// Styles
const inputStyle = {
  width: "100%",
  padding: "10px",
  margin: "10px 0",
  borderRadius: "4px",
  border: "1px solid #ddd",
  boxSizing: "border-box",
};

const buttonStyle = {
  width: "100%",
  padding: "15px",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  fontSize: "16px",
  cursor: "pointer",
  transition: "background-color 0.3s",
};

export default BuyNowPage;
