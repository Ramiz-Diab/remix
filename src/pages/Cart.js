import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../contexts/CartContext';
import '../styles/Cart.css';

function Cart() {
  const { cartItems, removeFromCart } = useContext(CartContext);

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="page cart-page">
      <h1>🛒 Shopping Cart</h1>

      {cartItems.length > 0 ? (
        <>
          <table className="cart-table">
            <thead>
              <tr>
                <th>Remix</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.price} SAR</td>
                  <td>{item.quantity}</td>
                  <td>{item.price * item.quantity} SAR</td>
                  <td>
                    <button className="btn-small" onClick={() => removeFromCart(item.id)}>
                      ❌ Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="cart-summary">
            <h3>Total: {total} SAR</h3>
            
            <div className="cart-actions">
              <Link to="/checkout" className="btn btn-primary btn-large">
                ✅ Proceed to Checkout
              </Link>
              <Link to="/shop" className="btn btn-secondary">
                ← Continue Shopping
              </Link>
            </div>
          </div>
        </>
      ) : (
        <>
          <p>Cart is empty! 😢</p>
          <Link to="/shop" className="btn btn-primary">
            🛍️ Browse Shop
          </Link>
        </>
      )}
    </div>
  );
}

export default Cart;
