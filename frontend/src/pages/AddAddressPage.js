import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddAddressPage = () => {
  const navigate = useNavigate();
  const [addressDetails, setAddressDetails] = useState({
    name: "",
    address: "",
    city: "",
    email: "",
    pincode: "",
    phone: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddressDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveAddress = async () => {
    const { name, address, city, email, pincode, phone } = addressDetails;

    if (!name || !address || !city || !email || !pincode || !phone) {
      alert("All fields are required.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/save-address", addressDetails);
      if (response.data.success) {
        alert("Address saved successfully!");
        navigate("/buy-now"); // Redirect back to checkout page after saving
      } else {
        alert("Failed to save address. Please try again.");
      }
    } catch (error) {
      console.error("Error saving address:", error.message);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "600px",
        margin: "50px auto",
        fontFamily: "'Roboto', sans-serif",
        color: "#333",
        backgroundColor: "#f9f9f9",
        borderRadius: "10px",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Add Address</h1>
      <div>
        {["name", "address", "city", "email", "pincode", "phone"].map((field) => (
          <div key={field} style={{ marginBottom: "15px" }}>
            <label
              htmlFor={field}
              style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}
            >
              {field[0].toUpperCase() + field.slice(1)}
            </label>
            <input
              id={field}
              name={field}
              type="text"
              placeholder={`Enter ${field}`}
              value={addressDetails[field]}
              onChange={handleInputChange}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                fontSize: "16px",
              }}
            />
          </div>
        ))}
      </div>
      <button
        onClick={handleSaveAddress}
        style={{
          width: "100%",
          padding: "15px",
          backgroundColor: "#6200ea",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          fontSize: "16px",
          cursor: "pointer",
        }}
      >
        Save Address
      </button>
    </div>
  );
};

export default AddAddressPage;
