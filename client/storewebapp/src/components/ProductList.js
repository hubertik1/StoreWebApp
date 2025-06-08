import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';

const API_URL = 'http://localhost:5042/';

const ProductList = ({ search }) => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [search]);

  useEffect(() => {
    loadProducts(search, page);
  }, [search, page]);

  const loadProducts = (term, pageNum) => {
    const params = new URLSearchParams();
    if (term) params.append('search', term);
    params.append('page', pageNum);
    fetch(`${API_URL}api/storewebapp/GetProducts?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        setProducts(data.items);
        setTotalPages(data.totalPages);
      })
      .catch(() => {});
  };

  const handleDelete = id => {
    fetch(`${API_URL}api/storewebapp/DeleteProduct/${id}`, { method: 'DELETE' })
      .then(() => setProducts(prev => prev.filter(p => p.id !== id)))
      .catch(() => {});
  };

  const handlePrev = () => setPage(p => Math.max(1, p - 1));
  const handleNext = () => setPage(p => Math.min(totalPages, p + 1));

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
      <div className="pagination">
        <button onClick={handlePrev} disabled={page === 1}>Prev</button>
        <span>{page} / {totalPages}</span>
        <button onClick={handleNext} disabled={page === totalPages}>Next</button>
      </div>
    </div>
  );
};

export default ProductList;
