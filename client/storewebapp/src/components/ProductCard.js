import React from 'react';

const ProductCard = ({ product, apiUrl }) => {
  return (
    <div className="product-card" data-testid="product-card">
      {product.imageUrl && (
        <div className="product-image">
          <img src={`${apiUrl}${product.imageUrl}`} alt={product.title} />
        </div>
      )}
      <div className="product-details">
        <div className="details-text">
          <h3>{product.title}</h3>
          <p>{product.description}</p>
        </div>
        <button className="buy-button">Do koszyka</button>
      </div>
    </div>
  );
};

export default ProductCard;
