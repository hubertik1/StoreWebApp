import React, { useEffect, useState } from 'react';

const ProductCard = ({ product, apiUrl, onDelete, isAdmin, token }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    fetch(`${apiUrl}api/storewebapp/GetComments/${product.id}`)
      .then(res => res.json())
      .then(data => setComments(data))
      .catch(() => {});
  }, [product.id]);

  const handleAdd = e => {
    e.preventDefault();
    fetch(`${apiUrl}api/storewebapp/AddComment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ description: newComment, productId: product.id })
    })
      .then(res => res.json())
      .then(data => {
        setComments(prev => [...prev, data]);
        setNewComment('');
      })
      .catch(() => {});
  };

  const handleDelete = id => {
    fetch(`${apiUrl}api/storewebapp/DeleteComment/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => setComments(prev => prev.filter(c => c.id !== id)))
      .catch(() => {});
  };
  return (
    <div className="product-card" data-testid="product-card">
      <div className="product-main">
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
      <div className="comments">
        {comments.map(c => (
          <div key={c.id} className="comment">
            <span>{c.description}</span>
            {isAdmin && (
              <button onClick={() => handleDelete(c.id)} className="comment-delete-button">Usuń</button>
            )}
          </div>
        ))}
        {token && (
          <form onSubmit={handleAdd} className="comment-form">
            <input
              type="text"
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              placeholder="Dodaj komentarz"
              required
            />
            <button type="submit">Dodaj</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
