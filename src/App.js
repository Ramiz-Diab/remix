import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import './components/Navigation/Navigation.css';
import './styles/global.css';
import { CartProvider } from './contexts/CartContext';

// Components
import Navigation from './components/Navigation/Navigation';

// Pages
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';

function App() {
  const [language, setLanguage] = useState(() => localStorage.getItem('site-language') || 'en');

  useEffect(() => {
    const isArabic = language === 'ar';
    document.documentElement.lang = isArabic ? 'ar' : 'en';
    document.documentElement.dir = isArabic ? 'rtl' : 'ltr';
    localStorage.setItem('site-language', language);
  }, [language]);

  return (
    <CartProvider>
      <Router>
        <div className="App">
          <Navigation language={language} setLanguage={setLanguage} />
          <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-success" element={<OrderSuccess />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<ContactUs />} />
          </Routes>
        </main>
        <footer className="app-footer">
          {language === 'ar'
            ? 'جميع الحقوق محفوظة - Arabic Remix'
            : 'All Rights Reserved - Arabic Remix'}
        </footer>
      </div>
    </Router>
    </CartProvider>
  );
}

export default App;
