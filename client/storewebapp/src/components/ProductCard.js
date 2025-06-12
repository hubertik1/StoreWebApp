import React, { useEffect, useState } from 'react';
import EditProductForm from './EditProductForm';

const ProductCard = ({ product, apiUrl, onDelete, isAdmin, token }) => {
  const [productData, setProductData] = useState(product);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [productCategories, setProductCategories] = useState(productData.categories || []);
  const [allCategories, setAllCategories] = useState([]);
  const [addCatId, setAddCatId] = useState('');
  const [removeCatId, setRemoveCatId] = useState('');
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    fetch(`${apiUrl}api/storewebapp/GetComments/${productData.id}`,
      token ? { headers: { Authorization: `Bearer ${token}` } } : undefined)
      .then(res => res.json())
      .then(data => setComments(data))
      .catch(() => {});

    fetch(`${apiUrl}api/storewebapp/GetCategories`)
      .then(res => res.json())
      .then(data => setAllCategories(data))
      .catch(() => {});
  }, [productData.id, token, apiUrl]);

  const handleAdd = e => {
    e.preventDefault();
    fetch(`${apiUrl}api/storewebapp/AddComment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ description: newComment, productId: productData.id })
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

  const handleAddCategory = () => {
    if (!addCatId) return;
    fetch(`${apiUrl}api/storewebapp/AddProductCategory?productId=${productData.id}&categoryId=${addCatId}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (res.ok) {
          const cat = allCategories.find(c => c.id === Number(addCatId));
          if (cat) setProductCategories(prev => [...prev, cat]);
          setAddCatId('');
        }
      })
      .catch(() => {});
  };

  const handleRemoveCategory = () => {
    if (!removeCatId) return;
    fetch(`${apiUrl}api/storewebapp/RemoveProductCategory?productId=${productData.id}&categoryId=${removeCatId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (res.ok) {
          setProductCategories(prev => prev.filter(c => c.id !== Number(removeCatId)));
          setRemoveCatId('');
        }
      })
      .catch(() => {});
  };
  return (
    <div className="product-card" data-testid="product-card">
      <div className="product-main">
        {productData.imageUrl && (
          <div className="product-image">
            <img src={`${apiUrl}${productData.imageUrl}`} alt={productData.title} />
          </div>
        )}
        <div className="product-details">
          <div className="details-text">
            <h3>
              {productData.title}
              {isAdmin && productData.isDeleted && (
                <span className="hidden-label"> (niewidoczne)</span>
              )}
            </h3>
            <p>{productData.description}</p>
          </div>
          <div>
            <button className="buy-button">Do koszyka</button>
            {isAdmin && (
              <>
                <button
                  className={productData.isDeleted ? 'add-button' : 'delete-button'}
                  onClick={() => onDelete(productData.id, productData.isDeleted)}
                >
                  {productData.isDeleted ? 'Dodaj' : 'Usuń'}
                </button>
                <button className="edit-button" onClick={() => setEditMode(true)}>
                  Edytuj
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="product-categories">
        <span>Kategorie:</span>
        <ul>
          {productCategories.map(cat => (
            <li key={cat.id}>{cat.name}</li>
          ))}
        </ul>
        {isAdmin && (
          <div className="category-controls">
            <div>
              <select value={removeCatId} onChange={e => setRemoveCatId(e.target.value)}>
                <option value="">Wybierz kategorię</option>
                {productCategories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              <button onClick={handleRemoveCategory}>Usuń</button>
            </div>
            <div>
              <select value={addCatId} onChange={e => setAddCatId(e.target.value)}>
                <option value="">Dodaj kategorię</option>
                {allCategories
                  .filter(cat => !productCategories.some(pc => pc.id === cat.id))
                  .map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
              </select>
              <button onClick={handleAddCategory}>Dodaj</button>
            </div>
          </div>
        )}
      </div>
      <div className="comments">
        <h3>Komentarze:</h3>
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
      {editMode && (
        <EditProductForm
          product={productData}
          token={token}
          onEdited={p => {
            setProductData(p);
            setProductCategories(p.categories || []);
          }}
          onCancel={() => setEditMode(false)}
        />
      )}
    </div>
  );
};

export default ProductCard;
