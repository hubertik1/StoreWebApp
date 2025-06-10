import React, { useState } from 'react';

const API_URL = 'http://localhost:5042/';

const LoginForm = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const handleSubmit = e => {
    e.preventDefault();
    fetch(`${API_URL}api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
      .then(async res => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text);
        }
        return res.json();
      })
      .then(data => {
        setIsError(false);
        setMessage('Logged in');
        onLogin(data.token, data.role, data.username);
      })
      .catch(err => {
        setIsError(true);
        if (err.message.includes('User not found')) {
          setMessage('This account does not exist. Please register');
        } else if (err.message.includes('Wrong password')) {
          setMessage('Incorrect password');
        } else {
          setMessage('Login failed');
        }
      });
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <input
        type="text"
        placeholder="Login"
        value={username}
        onChange={e => setUsername(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Hasło"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      <button type="submit">Zaloguj</button>
      {message && (
        <div className={`notification ${isError ? 'error' : ''}`}>{message}</div>
      )}
    </form>
  );
};

export default LoginForm;
