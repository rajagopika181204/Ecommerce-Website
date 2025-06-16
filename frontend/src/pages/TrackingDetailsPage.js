import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

function TrackingDetailsPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const trackingDetails = location.state?.trackingDetails;

  if (!trackingDetails) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h2>No tracking details found.</h2>
        <button
          style={{
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "white",
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

  const { trackingID, status, estimatedDelivery, courier } = trackingDetails;

  // Map of couriers and their tracking URL templates
  const courierLinks = {
    "FastX Courier": "https://www.fastxcourier.com/track?trackingID=",
    "BlueDart": "https://www.bluedart.com/tracking?trackno=",
    "DHL": "https://www.dhl.com/en/express/tracking.html?AWB=",
    "FedEx": "https://www.fedex.com/fedextrack/?trknbr=",
  };

  const courierWebsite =
    courierLinks[courier] ? courierLinks[courier] + trackingID : "#";

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "auto",
        fontFamily: "'Arial', sans-serif",
        padding: "20px",
        backgroundColor: "#f8f9fa",
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
        Tracking Details
      </h1>
      <section style={{ marginBottom: "20px" }}>
        <p><strong>Tracking ID:</strong> {trackingID}</p>
        <p><strong>Status:</strong> {status}</p>
        <p><strong>Estimated Delivery:</strong> {new Date(estimatedDelivery).toLocaleDateString()}</p>
        <p>
          Check real-time tracking status on the{" "}
          <a
            href={courierWebsite}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#007bff", textDecoration: "none" }}
          >
            {courier} website
          </a>.
        </p>
      </section>
      <button
        style={{
          marginTop: "20px",
          padding: "12px 25px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          display: "block",
          marginLeft: "auto",
        }}
        onClick={() => navigate("/billing")}
      >
        Back to Billing
      </button>
    </div>
  );
}

export default TrackingDetailsPage;