import React, { useState } from 'react';

const API_URL = 'http://localhost:5042/';

const RegisterForm = ({ onRegister }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const handleSubmit = e => {
    e.preventDefault();
    fetch(`${API_URL}api/auth/register`, {
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
        setMessage('You have successfully registered');
        onRegister(data.token, data.role, data.username);
      })
      .catch(err => {
        setIsError(true);
        if (err.message.includes('User exists')) {
          setMessage('An account with this username already exists');
        } else {
          setMessage('Registration failed');
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
      <button type="submit">Zarejestruj</button>
      {message && (
        <div className={`notification ${isError ? 'error' : ''}`}>{message}</div>
      )}
    </form>
  );
};

export default RegisterForm;
