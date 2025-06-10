import React, { useEffect, useState } from 'react';

const ProductCard = ({ product, apiUrl, onDelete, isAdmin, token }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    fetch(`${apiUrl}api/storewebapp/GetComments/${product.id}`,
      token ? { headers: { Authorization: `Bearer ${token}` } } : undefined)
      .then(res => res.json())
      .then(data => setComments(data))
      .catch(() => {});
  }, [product.id, token, apiUrl]);

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

  const handleDelete = (id, isDeleted) => {
    const url = `${apiUrl}api/storewebapp/${isDeleted ? 'RestoreComment' : 'DeleteComment'}/${id}`;
    const method = isDeleted ? 'POST' : 'DELETE';
    fetch(url, {
      method,
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() =>
        setComments(prev =>
          prev.map(c =>
            c.id === id ? { ...c, isDeleted: !isDeleted } : c
          )
        )
      )
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
            <h3>
              {product.title}
              {isAdmin && product.isDeleted && (
                <span className="hidden-label"> (niewidoczne)</span>
              )}
            </h3>
            <p>{product.description}</p>
          </div>
          <div>
            <button className="buy-button">Do koszyka</button>
            {isAdmin && (
              <button
                className={product.isDeleted ? 'add-button' : 'delete-button'}
                onClick={() => onDelete(product.id, product.isDeleted)}
              >
                {product.isDeleted ? 'Dodaj' : 'Usuń'}
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="comments">
        {comments.map(c => (
          <div key={c.id} className="comment">
            <span>
              {c.description}
              {isAdmin && c.isDeleted && (
                <span className="hidden-label"> (niewidoczne)</span>
              )}
            </span>
            {isAdmin && (
              <button
                onClick={() => handleDelete(c.id, c.isDeleted)}
                className={
                  c.isDeleted ? 'comment-add-button' : 'comment-delete-button'
                }
              >
                {c.isDeleted ? 'Dodaj' : 'Usuń'}
              </button>
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
