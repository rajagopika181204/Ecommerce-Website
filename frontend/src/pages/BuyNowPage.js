import React, { useState, useEffect } from "react";
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
  FaPlus,
  FaCheck,
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
          onClick={() => navigate("/profile")}
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

  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [upiPayment, setUpiPayment] = useState({
    show: false,
    link: "",
    qrData: "",
    qrVisible: false,
  });

  // Fetch saved addresses on component mount
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/get-addresses");
        if (response.data.success) {
          setSavedAddresses(response.data.addresses);
        }
      } catch (err) {
        console.error("Error fetching addresses:", err);
      }
    };
    fetchAddresses();
  }, []);

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

  const handleAddressSelect = (address) => {
    setSelectedAddress(address.id);
    setUserDetails({
      name: address.name,
      address: address.address,
      city: address.city,
      email: address.email,
      pincode: address.pincode,
      phone: address.phone,
      paymentMethod: userDetails.paymentMethod,
    });
  };

  const handleSaveNewAddress = async () => {
  try {
    const response = await axios.post("http://localhost:5000/api/save-address", userDetails);
    if (response.data.success) {
      const updatedResponse = await axios.get("http://localhost:5000/api/get-addresses");
      if (updatedResponse.data.success) {
        setSavedAddresses(updatedResponse.data.addresses);
      }
      setShowNewAddressForm(false);
      alert("Address saved successfully!");
    }
  } catch (err) {
    console.error("Error saving address:", err);
    alert("Failed to save address. Please try again.");
  }
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
      const transactionId =
        userDetails.paymentMethod === "upi" ? `TXN${Date.now()}` : null;

      const response = await axios.post("http://localhost:5000/api/orders", {
        items,
        userDetails,
        total: calculatedTotal,
        paymentMethod: userDetails.paymentMethod,
        transactionId,
      });

      if (response.data && response.data.orderId) {
        alert("Order placed successfully!");
        navigate("/payment-success", {
          state: {
            orderId: response.data.orderId,
            trackingId: response.data.trackingId,
            transactionId: response.data.transactionId,
            userDetails: userDetails,
            items: items,
            total: calculatedTotal,
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
        <h1 style={{ textAlign: "center", marginBottom: "20px", color: "black" }}>
          Checkout
        </h1>

        {/* Order Summary Section */}
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

        {/* Saved Addresses Section */}
        <div
          style={{
            backgroundColor: "#fff",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
            marginBottom: "20px",
          }}
        >
          <h2>Select Delivery Address 📦</h2>
          
          {savedAddresses.length > 0 ? (
            <div>
              {savedAddresses.map((address) => (
                <div
                  key={address.id}
                  style={{
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    padding: "10px",
                    margin: "10px 0",
                    backgroundColor: selectedAddress === address.id ? "#f0f8ff" : "#fff",
                    cursor: "pointer",
                  }}
                  onClick={() => handleAddressSelect(address)}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <input
                      type="radio"
                      name="address"
                      checked={selectedAddress === address.id}
                      onChange={() => handleAddressSelect(address)}
                      style={{ marginRight: "10px" }}
                    />
                    <div>
                      <p>
                        <strong>{address.name}</strong>
                      </p>
                      <p>{address.address}</p>
                      <p>
                        {address.city} - {address.pincode}
                      </p>
                      <p>Phone: {address.phone}</p>
                      <p>Email: {address.email}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No saved addresses found.</p>
          )}

          <button
            onClick={() => setShowNewAddressForm(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              padding: "10px 15px",
              backgroundColor: "#0288D1",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              marginTop: "10px",
            }}
          >
            <FaPlus /> Add New Address
          </button>
        </div>

        {/* New Address Form (Conditional) */}
        {showNewAddressForm && (
          <div
            style={{
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
              marginBottom: "20px",
            }}
          >
            <h2>New Shipping Address</h2>
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
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={handleSaveNewAddress}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  padding: "10px 15px",
                  backgroundColor: "#4CAF50",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                <FaCheck /> Save Address
              </button>
              <button
                onClick={() => setShowNewAddressForm(false)}
                style={{
                  padding: "10px 15px",
                  backgroundColor: "#f44336",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Payment Method Section */}
        <div
          style={{
            backgroundColor: "#f9f9f9",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
            marginBottom: "20px",
          }}
        >
          <h2>
            <FaCreditCard /> Payment Method
          </h2>
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
            <option value="creditCard">
              <FaCreditCard />
              Credit Card
            </option>
            <option value="upi">
              <FaMobileAlt />
              UPI
            </option>
            <option value="cashOnDelivery">
              <FaMoneyBillWave />
              Cash on Delivery
            </option>
          </select>
        </div>

        {/* UPI Payment Section (Conditional) */}
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
              <FaRupeeSign />
              Generate UPI Payment Link
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
                  <FaQrcode />
                  Show QR Code
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
        <br />
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