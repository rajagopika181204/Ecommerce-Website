import React, { useState } from 'react';
import { useLocation} from 'react-router-dom';
import './Payment.css'; // Create this file

function PaymentPage() {
  const { state } = useLocation();
  const [paymentMethod, setPaymentMethod] = useState('phonepe');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePayment = async () => {
    setLoading(true);
    setError('');

    try {
      // 1. Create order in backend
      const response = await fetch('http://localhost:5000/api/create-phonepe-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: state.calculatedTotal,
          userId: localStorage.getItem('userId'), // Get from your auth system
          orderId: `ORD${Date.now()}`
        })
      });

      if (!response.ok) throw new Error('Payment initiation failed');

      // 2. Redirect to PhonePe
      const { paymentLink } = await response.json();
      window.location.href = paymentLink;

    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="payment-container">
      <h2>Complete Payment</h2>
      
      <div className="payment-methods">
        <button 
          className={`method-btn ${paymentMethod === 'phonepe' ? 'active' : ''}`}
          onClick={() => setPaymentMethod('phonepe')}
        >
          <img src="/phonepe-icon.png" alt="PhonePe" width="80" />
        </button>

        <div className="order-summary">
          <h3>Total: ₹{state.calculatedTotal}</h3>
          {error && <p className="error-msg">{error}</p>}
          <button 
            onClick={handlePayment}
            disabled={loading}
            className="pay-now-btn"
          >
            {loading ? 'Redirecting...' : 'Pay via PhonePe'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaymentPage;