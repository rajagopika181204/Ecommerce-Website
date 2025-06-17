import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  FaTruck,
  FaBarcode,
  FaCreditCard,
  FaCalendarAlt,
  FaFileInvoice,
} from "react-icons/fa";

function BillingPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const orderDetails = location.state?.orderDetails;

  const orderId = `ORD${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  const trackingID = `TRK${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  const transactionID = `TXN${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  const trackingStatus = "In Transit";

  useEffect(() => {
    localStorage.setItem("latestTrackingID", trackingID);
  }, [trackingID]);

  if (!orderDetails) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h2>No billing details found.</h2>
        <button
          style={{
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
          onClick={() => navigate("/")}
        >
          Go to Shop
        </button>
      </div>
    );
  }

  const { items, userDetails, total } = orderDetails;

  const orderDate = new Date();
  const deliveryDate = new Date(orderDate);
  deliveryDate.setDate(orderDate.getDate() + 5);

  const generatePDF = () => {
  const doc = new jsPDF({ format: "a4" });


  // Add Border
  doc.rect(10, 10, 190, 277); // A4 size with 10mm margins

  // Add Logo
  doc.addImage(logoBase64, "PNG", 20, 20, 20, 20); // Adjust the position and size as needed

  // Header
  doc.setFontSize(25);
  doc.text("Tech Gadget Store - Invoice", 110, 30, { align: "center" });

  // Customer Information
  doc.setFontSize(12);
  doc.text(`Order ID: ${orderId}`, 15, 50);
  doc.text(`Tracking ID: ${trackingID}`, 15, 57);
  doc.text(`Transaction ID: ${transactionID}`, 15, 64);
  doc.text(`Order Date: ${orderDate.toLocaleDateString()}`, 15, 71);
  doc.text(`Delivery Date: ${deliveryDate.toLocaleDateString()}`, 15, 78);
  doc.text(`Customer: ${userDetails.name}`, 15, 85);
  doc.text(`Address: ${userDetails.address}`, 15, 92);
  doc.text(`Phone: ${userDetails.phone}`, 15, 99);

  // Product Table
  autoTable(doc, {
    startY: 110,
    head: [["Product", "Quantity", "Price", "Subtotal"]],
    body: items.map((item) => [
      item.product.name,
      item.quantity,
      `₹${Number(item.product.price).toFixed(2)}`,
      `₹${(Number(item.product.price) * item.quantity).toFixed(2)}`,
    ]),
  });

  // Total
  doc.text(`Total: ₹${total.toFixed(2)}`, 15, doc.lastAutoTable.finalY + 10);

  // Footer
  doc.setFontSize(10);
  doc.text("Thank you for shopping with Tech Gadget Store!", 105, 290, {
    align: "center",
  });

  doc.save("Invoice.pdf");
};


  const styles = {
    container: {
      fontFamily: "Arial, sans-serif",
      padding: "20px",
      maxWidth: "800px",
      margin: "auto",
      backgroundColor: "#f9f9f9",
      borderRadius: "10px",
      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    },
    billingBox: {
      padding: "20px",
    },
    header: {
      textAlign: "center",
      marginBottom: "20px",
    },
    heading: {
      fontSize: "24px",
      color: "#333",
    },
    subheading: {
      fontSize: "18px",
      color: "#666",
    },
    section: {
      marginBottom: "20px",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      marginTop: "10px",
    },
    tableHeader: {
      backgroundColor: "#f4f4f4",
      textAlign: "left",
      borderBottom: "2px solid #ddd",
    },
    tableRow: {
      borderBottom: "1px solid #ddd",
    },
    tableCell: {
      padding: "8px",
      textAlign: "center",
      border: "1px solid #ddd",
    },
    total: {
      textAlign: "right",
      marginTop: "10px",
      fontSize: "18px",
      fontWeight: "bold",
    },
    button: {
      padding: "10px 20px",
      backgroundColor: "#007bff",
      color: "#fff",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      marginRight: "10px",
    },
    buttonAlt: {
      padding: "10px 20px",
      backgroundColor: "#28a745",
      color: "#fff",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.billingBox}>
        <div style={styles.header}>
          <h1 style={styles.heading}>
            <FaFileInvoice /> Invoice
          </h1>
          <p style={styles.subheading}>Thank you for your purchase!</p>
        </div>
        <section style={styles.section}>
          <h2>Order Summary</h2>
          <p>
            <FaBarcode /> <strong>Order ID:</strong> {orderId}
          </p>
          <p>
            <FaTruck /> <strong>Tracking ID:</strong> {trackingID}
          </p>
          <p>
            <FaCreditCard /> <strong>Transaction ID:</strong> {transactionID}
          </p>
          <p>
            <FaCalendarAlt /> <strong>Order Date:</strong>{" "}
            {orderDate.toLocaleDateString()}
          </p>
          <p>
            <FaCalendarAlt /> <strong>Delivery Date:</strong>{" "}
            {deliveryDate.toLocaleDateString()}
          </p>
        </section>
        <section style={styles.section}>
          <h2>Customer Details</h2>
          <p>
            <strong>Name:</strong> {userDetails.name}
          </p>
          <p>
            <strong>Address:</strong> {userDetails.address}
          </p>
          <p>
            <strong>Phone:</strong> {userDetails.phone}
          </p>
        </section>
        <section style={styles.section}>
          <h2>Items Purchased</h2>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeader}>
                <th style={styles.tableCell}>Product</th>
                <th style={styles.tableCell}>Quantity</th>
                <th style={styles.tableCell}>Price</th>
                <th style={styles.tableCell}>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {items.length > 0 ? (
                items.map((item, idx) => (
                  <tr key={idx} style={styles.tableRow}>
                    <td style={styles.tableCell}>{item.product.name}</td>
                    <td style={styles.tableCell}>{item.quantity}</td>
                    <td style={styles.tableCell}>
                      ₹{Number(item.product.price).toFixed(2)}
                    </td>
                    <td style={styles.tableCell}>
                      ₹{(Number(item.product.price) * item.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center", padding: "10px" }}>
                    No items found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <h3 style={styles.total}>Total: ₹{total.toFixed(2)}</h3>
        </section>
        <div>
          <center><button style={styles.button} onClick={generatePDF}>
            Download Invoice
          </button>
          <button style={styles.buttonAlt} onClick={() => navigate("/products")}>
            Back to Shopping
          </button></center>
          <section style={{ marginTop: "20px" }}>
        <h2>Tracking Details</h2>
        <p><strong>Tracking ID:</strong> {trackingID}</p>
        <p><strong>Status:</strong> {trackingStatus}</p>
        <p>
          Use the tracking ID to check the real-time status on the{" "}
          <a
            href="https://www.dhl.com/track"
            style={{ color: "#007bff", textDecoration: "none" }}
            target="_blank"
            rel="noopener noreferrer"
          >
            courier's website
          </a>.
        </p>
      </section>
        </div>
      </div>
    </div>
  );
}

export default BillingPage;
