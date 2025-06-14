import React, { useState } from 'react';
import './App.css';
import ProductList from './components/ProductList';
import AddProductForm from './components/AddProductForm';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import UserAdminPanel from './components/UserAdminPanel';
import CategoryFilter from './components/CategoryFilter';

const App = () => {
  const [search, setSearch] = useState('');
  const [refresh, setRefresh] = useState(0);

  const storedToken = localStorage.getItem('token');
  const storedRole = localStorage.getItem('role');
  const storedUser = localStorage.getItem('username');

  const [token, setToken] = useState(
    storedToken && storedToken !== 'undefined' ? storedToken : null
  );
  const [role, setRole] = useState(
    storedRole && storedRole !== 'undefined' ? storedRole : null
  );
  const [username, setUsername] = useState(
    storedUser && storedUser !== 'undefined' ? storedUser : ''
  );
  const [showUsers, setShowUsers] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const handleAdded = () => setRefresh(r => r + 1);

  const handleAuth = (tok, rl, user) => {
    setToken(tok);
    setRole(rl);
    setUsername(user);
    localStorage.setItem('token', tok);
    localStorage.setItem('role', rl);
    localStorage.setItem('username', user);
    window.location.reload();
  };

  const handleLogout = () => {
    setToken(null);
    setRole(null);
    setUsername('');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    window.location.reload();
  };


  return (
    <div className="App">
      <header className="header">
        <h1>Sklep Wszystko i Nic</h1>

        <CategoryFilter
          selected={selectedCategories}
          onChange={setSelectedCategories}
        />

        <div className="search-container">
          <input
            type="text"
            placeholder="Szukaj produktu..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {token && (
          <div className="user-section">
            <span className="user-info">{username}</span>
            <button className="logout-btn" onClick={handleLogout}>
              Wyloguj
            </button>
          </div>
        )}
      </header>

      {token && role === 'Admin' && (
        <>
          <div className="admin-button-container">
            <button
              className="users-button"
              onClick={() => setShowUsers(s => !s)}
            >
              Użytkownicy
            </button>
          </div>

          <UserAdminPanel token={token} show={showUsers} />
        </>
      )}

      <div className="container">
        {token ? (
          <AddProductForm onAdd={handleAdded} token={token} />
        ) : (
          <>
            <LoginForm onLogin={handleAuth} />
            <RegisterForm onRegister={handleAuth} />
          </>
        )}
      </div>

      <ProductList
        search={search}
        refresh={refresh}
        token={token}
        isAdmin={role === 'Admin'}
        categoryIds={selectedCategories}
      />

      <footer className="footer">
        <p>&copy; 2025 Sklep Wszystko i Nic. Wszelkie prawa zastrzeżone.</p>
      </footer>
    </div>
  );
};

export default App;