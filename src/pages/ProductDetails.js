import React from 'react';
import { useParams, Link } from 'react-router-dom';
import '../styles/ProductDetails.css';

function ProductDetails() {
  const { id } = useParams();

  // Mock product data
  const product = {
    id: id,
    name: `Remix #${id}`,
    price: 29.99 + (id * 5),
    duration: '3:45',
    description: 'Original remix in very high quality. Includes original music and professional sound effects.',
    artist: 'Famous Artist',
  };

  return (
    <div className="page product-details-page">
      <Link to="/shop" className="back-btn">
        ← Back to Shop
      </Link>

      <div className="product-container">
        <div className="product-image">
          <div className="placeholder-image">
            🎵 {product.name}
          </div>
        </div>

        <div className="product-info">
          <h1>{product.name}</h1>
          <p className="artist">By: {product.artist}</p>
          
          <p className="description">
            {product.description}
          </p>

          <div className="product-details">
            <p><strong>Duration:</strong> {product.duration}</p>
            <p className="price"><strong>Price:</strong> {product.price} SAR</p>
          </div>

          <div className="action-buttons">
            <button className="btn btn-primary">
              🛒 Add to Cart
            </button>
            <Link to="/checkout" className="btn btn-success">
              💳 Buy Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
