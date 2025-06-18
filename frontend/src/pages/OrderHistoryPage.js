import React, { useEffect, useState } from "react";

function MyOrdersPage() {
    const [orders, setOrders] = useState([]);
    const userId = 1; // Replace with logged-in user's ID

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/orders/${userId}`);
                if (!response.ok) throw new Error("Failed to fetch orders");

                const data = await response.json();
                console.log("Fetched Orders:", data); // Debugging
                setOrders(data);
            } catch (err) {
                console.error("Error fetching orders:", err);
            }
        };

        fetchOrders();
    }, [userId]);

    return (
        <div>
            <h1>My Orders</h1>
            {orders.length === 0 ? (
                <p>No orders found.</p>
            ) : (
                orders.map((order) => (
                    <div key={order.id} style={{ marginBottom: "20px", padding: "10px", border: "1px solid #ddd" }}>
                        <h2>Order ID: {order.id}</h2>
                        <p><strong>Total Amount:</strong> ₹{order.total_amount}</p>
                        <p><strong>Payment Method:</strong> {order.payment_method}</p>
                        <p><strong>Status:</strong> {order.status}</p>
                        <p><strong>Order Date:</strong> {new Date(order.created_at).toLocaleString()}</p>
                        <p><strong>Items:</strong></p>
                        <ul>
                            {order.items.map((item, idx) => (
                                <li key={idx}>
                                    Product ID: {item.product_id}, Quantity: {item.quantity}, Price: ₹{item.price}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))
            )}
        </div>
    );
}

export default MyOrdersPage;
