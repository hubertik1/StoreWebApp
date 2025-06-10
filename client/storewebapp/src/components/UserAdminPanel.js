import React, { useEffect, useState } from 'react';

const API_URL = 'http://localhost:5042/';

const UserAdminPanel = ({ token, show }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (!token) return;
    fetch(`${API_URL}api/auth/users`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(() => {});
  }, [token]);

  const changeRole = (id, role) => {
    fetch(`${API_URL}api/auth/updateRole/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ role })
    })
      .then(res => {
        if (res.ok) {
          setUsers(u => u.map(user => (user.id === id ? { ...user, role } : user)));
        }
      })
      .catch(() => {});
  };

  return (
    <div className={`user-panel ${show ? 'open' : ''}`}>
      {users.map(u => (
        <div key={u.id} className="user-row">
          <span>{u.username}</span>
          <select
            value={u.role}
            onChange={e => changeRole(u.id, e.target.value)}
          >
            <option value="User">User</option>
            <option value="Admin">Admin</option>
          </select>
        </div>
      ))}
    </div>
  );
};

export default UserAdminPanel;