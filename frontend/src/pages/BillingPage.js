import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  FaFileInvoice,
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhone,
  FaShoppingCart,
  FaCheckCircle,
  FaArrowLeft,
  FaFilePdf,
  FaUser,
} from "react-icons/fa";

const BillingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    orderId,
    trackingId,
    transactionId,
    userDetails,
    items,
    total,
    paymentMethod,
  } = location.state || {};

  const generateInvoice = () => {
  const doc = new jsPDF();

  // Header Section
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("Tech Gadgets Store", 105, 20, { align: "center" });
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text("Your Trusted Electronics Partner", 105, 30, { align: "center" });
  doc.setDrawColor(0);
  doc.setLineWidth(0.5);
  doc.line(20, 35, 190, 35); // Draw border under header

  // Invoice Title and Order Info
  doc.setFontSize(16);
  doc.text("Invoice", 20, 45);
  doc.setFontSize(12);
  doc.text(`Order ID: ${orderId}`, 20, 55);
  doc.text(`Tracking ID: ${trackingId}`, 20, 65);
  doc.text(`Transaction ID: ${transactionId}`, 20, 75);
  doc.text(`Payment Method: ${paymentMethod}`, 20, 85);

  // Customer Details
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Customer Details", 20, 100);
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(`Name: ${userDetails?.name || "N/A"}`, 20, 110);
  doc.text(`Address: ${userDetails?.address || "N/A"}`, 20, 120);
  doc.text(`City: ${userDetails?.city || "N/A"}`, 20, 130);
  doc.text(`Email: ${userDetails?.email || "N/A"}`, 20, 140);
  doc.text(`Phone: ${userDetails?.phone || "N/A"}`, 20, 150);

  // Order Items Table
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Order Items", 20, 165);
  autoTable(doc, {
    startY: 170,
    head: [["Product Name", "Quantity", "Price (₹)", "Total (₹)"]],
    body: items.map((item) => [
      item.product.name,
      item.quantity,
      item.product.price,
      item.quantity * item.product.price,
    ]),
    theme: "grid", // Adds borders for a professional look
    styles: { halign: "center" },
    headStyles: { fillColor: [60, 179, 113] }, // Green header background
  });

  // Total Section
  const finalY = doc.lastAutoTable.finalY + 10;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text(`Total Amount: ₹${total || 0}`, 20, finalY);

  // Footer Section
  doc.setFontSize(10);
  doc.setFont("helvetica", "italic");
  doc.text("Thank you for shopping with Tech Gadgets Store!", 105, 290, { align: "center" });

  // Save PDF
  doc.save(`Invoice_Order_${orderId}.pdf`);
};


  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        maxWidth: "1000px",
        margin: "30px auto",
        padding: "50px",
        backgroundColor: "#f9f9f9",
        borderRadius: "10px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        border: "1px solid #ddd",
      }}
    >
      <h1
        style={{
          color: "#333",
          textAlign: "center",
          marginBottom: "20px",
          fontSize: "34px",
          fontWeight: "bold",
        }}
      >
        Billing Details <FaFileInvoice style={{ marginLeft: "10px" }} />
      </h1>

      {/* Order Details Section */}
      <div
        style={{
          padding: "20px",
          backgroundColor: "#ffffff",
          borderRadius: "10px",
          marginBottom: "20px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
          border: "1px solid #ddd",
        }}
      >
        <h2 style={{ color: "#4CAF50", fontSize: "18px", fontWeight: "bold" }}>
          Order Details:
        </h2>
        <p>
          <FaShoppingCart style={{ marginRight: "5px", color: "#4CAF50" }} />
          <strong>Order ID:</strong> {orderId || "N/A"}
        </p>
        <p>
          <FaCheckCircle style={{ marginRight: "5px", color: "#4CAF50" }} />
          <strong>Tracking ID:</strong> {trackingId || "N/A"}
        </p>
        <p>
          <FaCheckCircle style={{ marginRight: "5px", color: "#4CAF50" }} />
           <strong>Transaction ID:</strong>{" "}
  {transactionId || "Null"}
        </p>
        <p>
          <FaCheckCircle style={{ marginRight: "5px", color: "#4CAF50" }} />
          <strong>Payment Method:</strong> {paymentMethod || "N/A"}
        </p>
      </div>

      {/* Shipping Details Section */}
      <div
        style={{
          padding: "15px",
          backgroundColor: "#ffffff",
          borderRadius: "8px",
          marginBottom: "20px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
          border: "1px solid #ddd",
        }}
      >
        <h2 style={{ color: "#4CAF50", fontSize: "18px", fontWeight: "bold" }}>
          Shipping Details:
        </h2>
        <p>
          <FaUser style={{ marginRight: "5px" }}/>
          {userDetails?.name||"N/A"}
        </p>
        <p>
          <FaMapMarkerAlt style={{ marginRight: "5px" }} />
          {userDetails?.address || "N/A"}, {userDetails?.city || "N/A"}
        </p>
        <p>
          <FaEnvelope style={{ marginRight: "5px" }} />{" "}
          {userDetails?.email || "N/A"}
        </p>
        <p>
          <FaPhone style={{ marginRight: "5px" }} /> {userDetails?.phone || "N/A"}
        </p>
      </div>

      {/* Order Items Section */}
      <div
        style={{
          padding: "15px",
          backgroundColor: "#ffffff",
          borderRadius: "8px",
          marginBottom: "20px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
          border: "1px solid #ddd",
        }}
      >
        <h2 style={{ color: "#4CAF50", fontSize: "18px", fontWeight: "bold" }}>
          Order Items:
        </h2>
        {items?.length > 0 ? (
          <ul>
            {items.map((item, index) => (
              <li key={index} style={{ marginBottom: "8px" }}>
                <FaCheckCircle
                  style={{ color: "#4CAF50", marginRight: "5px" }}
                />
                {item.product.name} (x{item.quantity}) — ₹
                {item.quantity * item.product.price}
              </li>
            ))}
          </ul>
        ) : (
          <p>No items found.</p>
        )}
      </div>

      <h3
        style={{
          color: "#333",
          textAlign: "center",
          marginTop: "20px",
          fontSize: "20px",
          fontWeight: "bold",
        }}
      >
        Total Amount: ₹{total || 0}
      </h3>

      {/* Download Invoice and Back to Home Buttons */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button
          style={{
            padding: "12px 20px",
            fontSize: "16px",
            color: "#fff",
            backgroundColor: "#4CAF50",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            transition: "background-color 0.3s ease",
          }}
          onClick={generateInvoice}
        >
          <FaFilePdf style={{ marginRight: "5px" }} />Download Invoice
        </button>&nbsp;&nbsp;
        <button
          style={{
            padding: "12px 20px",
            fontSize: "16px",
            color: "#fff",
            backgroundColor: "#4CAF50",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            transition: "background-color 0.3s ease",
          }}
          onClick={() => navigate("/")}
        >
          <FaArrowLeft style={{ marginRight: "5px" }} /> Back to Home
        </button>
      </div>
    </div>
  );
};

export default BillingPage;
