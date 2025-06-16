
import React, { useState } from "react";
import axios from "axios";

function OrderTracking() {
  const [orderId, setOrderId] = useState('');
  const [orderStatus, setOrderStatus] = useState(null);
  const [error, setError] = useState('');

  const fetchOrderStatus = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/order-status/${orderId}`);
      setOrderStatus(res.data);
      setError('');
    } catch (err) {
      setOrderStatus(null);
      setError('Order not found or error fetching status');
    }
  };

  return (
    <div>
      <h1>Track Your Order</h1>
      <input
        type="text"
        placeholder="Enter your Order ID"
        value={orderId}
        onChange={(e) => setOrderId(e.target.value)}
      />
      <button onClick={fetchOrderStatus}>Check Status</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {orderStatus && (
        <div>
          <h3>Order ID: {orderStatus.order_id}</h3>
          <p>Status: {orderStatus.status}</p>
          <p>Estimated Delivery: {orderStatus.estimated_delivery}</p>
          <p>Total Price: ₹{orderStatus.total_price}</p>
          <h4>Items:</h4>
          <ul>
            {JSON.parse(orderStatus.items).map((item, i) => (
              <li key={i}>
                Product ID: {item.productId}, Quantity: {item.quantity}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
export default OrderTracking;