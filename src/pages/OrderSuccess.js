import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/OrderSuccess.css';

function OrderSuccess() {
  const orderNumber = Math.floor(Math.random() * 100000);

  return (
    <div className="page order-success-page">
      <div className="success-container">
        <div className="success-icon">✅</div>
        
        <h1>Thank You! 🎉</h1>
        
        <p className="success-message">
          Your order has been received successfully!
        </p>

        <div className="order-info">
          <p><strong>Order Number:</strong> #{orderNumber}</p>
          <p><strong>Status:</strong> Processing</p>
          <p><strong>Remixes will be sent</strong> to your email shortly</p>
        </div>

        <Link to="/" className="btn btn-primary btn-large">
          🏠 Back to Home
        </Link>
      </div>
    </div>
  );
}

export default OrderSuccess;
