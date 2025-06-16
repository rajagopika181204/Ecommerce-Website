import React, { useEffect, useState } from "react";

function TrackingPage() {
  const [trackingID, setTrackingID] = useState("");
  const [trackingDetails, setTrackingDetails] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch tracking ID from localStorage
    const storedTrackingID = localStorage.getItem("latestTrackingID");
    if (storedTrackingID) {
      setTrackingID(storedTrackingID);

      // Simulate fetching tracking details (replace this with actual API call)
      fetch(`http://localhost:5000/api/track/${storedTrackingID}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error("Failed to fetch tracking details.");
          }
          return res.json();
        })
        .then((data) => setTrackingDetails(data))
        .catch((err) => setError(err.message));
    } else {
      setError("No tracking ID found. Please check your billing details.");
    }
  }, []);

  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "20px" }}>
        <h1>Track Your Order</h1>
        <p style={{ color: "red" }}>{error}</p>
      </div>
    );
  }

  if (!trackingDetails) {
    return (
      <div style={{ textAlign: "center", padding: "20px" }}>
        <h1>Track Your Order</h1>
        <p>Loading tracking details...</p>
      </div>
    );
  }

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Track Your Order</h1>
      <p><strong>Tracking ID:</strong> {trackingID}</p>
      <p><strong>Status:</strong> {trackingDetails.status}</p>
      <p><strong>Expected Delivery:</strong> {trackingDetails.deliveryDate}</p>
    </div>
  );
}

export default TrackingPage;
