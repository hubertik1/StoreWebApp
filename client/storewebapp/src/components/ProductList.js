import React, { useEffect, useState, useCallback } from 'react';
import ProductCard from './ProductCard';

const API_URL = 'http://localhost:5042/';

const ProductList = ({ search, refresh, token, isAdmin, categoryIds = [] }) => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [search, refresh]);

  const loadProducts = useCallback((term, pageNum, cats) => {
    const params = new URLSearchParams();
    if (term) params.append('search', term);
    params.append('page', pageNum);
    if (cats && cats.length > 0) {
      cats.forEach(id => params.append('categoryIds', id));
    }
    fetch(`${API_URL}api/storewebapp/GetProducts?${params.toString()}`,
      token ? { headers: { Authorization: `Bearer ${token}` } } : undefined)
      .then(res => res.json())
      .then(data => {
        setProducts(data.items);
        setTotalPages(data.totalPages);
      })
      .catch(() => {});
  }, [token]);

  useEffect(() => {
    loadProducts(search, page, categoryIds);
  }, [search, page, refresh, categoryIds, loadProducts]);

  const handleDelete = (id, isDeleted) => {
    const url = `${API_URL}api/storewebapp/${isDeleted ? 'RestoreProduct' : 'DeleteProduct'}/${id}`;
    const method = isDeleted ? 'POST' : 'DELETE';
    fetch(url, {
      method,
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(() => loadProducts(search, page, categoryIds))
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
            isAdmin={isAdmin}
            token={token}
          />
        ))}
      </div>
      <div className="pagination">
        <button onClick={handlePrev} disabled={page === 1}>&lt;</button>
        <span>{page} / {totalPages}</span>
        <button onClick={handleNext} disabled={page === totalPages}>&gt;</button>
      </div>
    </div>
  );
};

export default ProductList;