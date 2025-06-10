import React from 'react';

const ProductCard = ({ product, apiUrl, onDelete, isAdmin }) => {
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
        <div>
          <button className="buy-button">Do koszyka</button>
          {isAdmin && (
            <button className="delete-button" onClick={() => onDelete(product.id)}>Usuń</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
