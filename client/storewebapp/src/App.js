import React, { useState } from 'react';
import './App.css';
import ProductList from './components/ProductList';
import ManageProducts from './components/ManageProducts';

const App = () => {
  const [admin, setAdmin] = useState(false);

  return (
    <div className="App">
      <header className="header">
        <h1>Sklep Wszystko i Nic</h1>
        <button onClick={() => setAdmin(a => !a)}>
          {admin ? 'View Store' : 'Manage Products'}
        </button>
      </header>
      {admin ? <ManageProducts /> : <ProductList />}
      <footer className="footer">
        <p>&copy; 2025 Sklep Wszystko i Nic. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;
