import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../contexts/CartContext';
import '../styles/Navigation.css';

function Navigation({ language, setLanguage }) {
  const { cartItems } = useContext(CartContext);
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const isRTL = language === 'ar';

  const labels = isRTL
    ? {
        brand: 'Arabic Remix',
        home: 'الرئيسية',
        shop: 'المتجر',
        about: 'من نحن',
        contact: 'تواصل معنا',
        cart: 'السلة',
        toggle: 'EN'
      }
    : {
        brand: 'Arabic Remix',
        home: 'Home',
        shop: 'Shop',
        about: 'About Us',
        contact: 'Contact Us',
        cart: 'Cart',
        toggle: 'AR'
      };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          {labels.brand}
        </Link>
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className="nav-link">
              {labels.home}
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/shop" className="nav-link">
              {labels.shop}
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/about" className="nav-link">
              {labels.about}
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/contact" className="nav-link">
              {labels.contact}
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/cart" className="nav-link cart-link">
              {labels.cart} {totalQuantity > 0 ? `(${totalQuantity})` : ''}
            </Link>
          </li>
          <li className="nav-item">
            <button
              type="button"
              className="lang-toggle"
              onClick={() => setLanguage(isRTL ? 'en' : 'ar')}
            >
              {labels.toggle}
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navigation;
