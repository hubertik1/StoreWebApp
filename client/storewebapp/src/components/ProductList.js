import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';

const API_URL = 'http://localhost:5042/';

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}api/storewebapp/GetProducts`)
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(() => {});
  }, []);

  return (
    <div className="container">
      <div className="products-list">
        {products.map(product => (
          <ProductCard key={product.id || product.title} product={product} apiUrl={API_URL} />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
