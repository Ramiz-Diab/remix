import React from 'react';
import { Link } from 'react-router-dom';
import './Checkout.css';

function Checkout() {
  return (
    <div className="page checkout-page">
      <h1>💳 Checkout</h1>

      <div className="checkout-container">
        <div className="checkout-form">
          <h2>User Information</h2>
          
          <form>
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" placeholder="Enter your name" required />
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input type="email" placeholder="your@email.com" required />
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input type="tel" placeholder="+966 50 XXXX XXXX" required />
            </div>

            <div className="form-group">
              <label>Payment Method</label>
              <select required>
                <option>Select Payment Method</option>
                <option>Credit Card</option>
                <option>Bank Transfer</option>
                <option>Digital Wallet</option>
              </select>
            </div>

            <div className="order-summary">
              <h3>Order Summary</h3>
              <p><strong>Remixes (2):</strong> 64.98 $</p>
              <p><strong>Fees:</strong> 5.00 $</p>
              <p className="total"><strong>Total:</strong> 69.98 SAR</p>
            </div>

            <Link to="/order-success" className="btn btn-primary btn-large">
              ✅ Confirm Order
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
