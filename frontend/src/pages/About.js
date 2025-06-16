import React from "react";
import { Link } from "react-router-dom";

function AboutPage() {
  return (
    <>
      {/* Navbar Inline */}
      <nav style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "15px 30px",
        backgroundColor: "#e74c3c",
        color: "white",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        position: "sticky",
        top: 0,
        zIndex: 1000,
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
      }}>
        <div style={{ fontWeight: "700", fontSize: "1.5rem" }}>
          <Link to="/" style={{ color: "white", textDecoration: "none" }}>
            Teach Gadgets
          </Link>
        </div>

        <div style={{ display: "flex", gap: "20px", fontWeight: "600" }}>
          <Link to="/" style={{ color: "white", textDecoration: "none" }}>
            Home
          </Link>
          <Link to="/about" style={{ color: "white", textDecoration: "underline" }}>
            About
          </Link>
          <Link to="/products" style={{ color: "white", textDecoration: "none" }}>
            Products
          </Link>
          <Link to="/contact" style={{ color: "white", textDecoration: "none" }}>
            Contact
          </Link>
        </div>
      </nav>

      {/* About Content */}
      <div style={{
        maxWidth: "800px",
        margin: "50px auto",
        padding: "30px",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        backgroundColor: "#f9f9f9",
        borderRadius: "10px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        color: "#333"
      }}>
        <h1 style={{
          textAlign: "center",
          color: "#e74c3c",
          marginBottom: "20px",
          fontWeight: "700",
          fontSize: "2.5rem"
        }}>
          About Us
        </h1>

        <p style={{ fontSize: "1.1rem", lineHeight: "1.6", marginBottom: "20px" }}>
          Welcome to <strong>Teach Gadgets Store</strong>!
        </p>

        <p style={{ fontSize: "1.1rem", lineHeight: "1.6", marginBottom: "20px" }}>
          We are a new and enthusiastic gadgets store started in <strong>2025</strong> with a passion for bringing you the latest and best electronic gadgets. Our goal is to provide high-quality products that make your life easier and more fun.
        </p>

        <p style={{ fontSize: "1.1rem", lineHeight: "1.6", marginBottom: "20px" }}>
          At Teach Gadgets Store, we believe in great value, excellent customer service, and fast delivery. Whether you are looking for smart devices, accessories, or tech essentials, we have got you covered.
        </p>

        <p style={{ fontSize: "1.1rem", lineHeight: "1.6" }}>
          Thank you for choosing us — we’re excited to grow and serve you with the best gadgets this year and beyond!
        </p>
      </div>
    </>
  );
}



export default AboutPage;
