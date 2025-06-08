import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';

const API_URL = 'http://localhost:5042/';

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = () => {
    fetch(`${API_URL}api/storewebapp/GetProducts`)
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(() => {});
  };

  const handleDelete = id => {
    fetch(`${API_URL}api/storewebapp/DeleteProduct/${id}`, { method: 'DELETE' })
      .then(() => setProducts(prev => prev.filter(p => p.id !== id)))
      .catch(() => {});
  };

  return (
    <div className="container">
      <div className="products-list">
        {products.map(product => (
          <ProductCard
            key={product.id || product.title}
            product={product}
            apiUrl={API_URL}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
