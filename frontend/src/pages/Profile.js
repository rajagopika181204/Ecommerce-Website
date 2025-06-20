import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../context/UserContext';

const Profile = () => {
  const { user } = useContext(UserContext);
  const [userData, setUserData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user && user.email) {
      console.log('Fetching orders for:', user.email); // Debugging log
      fetch(`/api/orders/${user.email}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to fetch data');
          }
          return response.json();
        })
        .then((data) => {
          console.log('API Response:', data); // Debugging log
          if (data.success) {
            setUserData(data.user);
            setOrders(data.orders);
          } else {
            setError('Failed to load data');
          }
        })
        .catch((err) => {
          console.error('Error:', err.message);
          setError('Failed to load user or orders. Please try again later.');
        })
        .finally(() => setLoading(false));
    }
  }, [user]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!userData) {
    return <p>No user data found. Please log in again.</p>;
  }

  return (
    <div>
      <h1>Welcome, {userData.username}!</h1>
      <p>Email: {userData.email}</p>
      <h2>Your Orders</h2>
      {orders.length > 0 ? (
        <ul>
          {orders.map((order) => (
            <li key={order.id}>
              <p>Order ID: {order.id}</p>
              <p>Address: {order.address}, {order.city}</p>
              <p>Total: ₹{order.total_amount}</p>
              <p>Payment Method: {order.payment_method}</p>
              <p>Tracking ID: {order.tracking_id}</p>
              <p>Order Date: {new Date(order.created_at).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No orders found.</p>
      )}
    </div>
  );
};

export default Profile;
