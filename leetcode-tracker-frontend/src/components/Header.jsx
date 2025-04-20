import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

export default function Header() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    api.get('/current_user.json')
      .then(r => setUser(r.data))
      .catch(() => setUser(null));
  }, []);

  const logout = () => {
    api.delete('/users/sign_out.json')
      .then(() => setUser(null));
  };

  return (
    <header className="flex justify-end p-4 bg-gray-200 dark:bg-gray-800 space-x-4">
      {user ? (
        <>
          <span>{user.email}</span>
          <button onClick={logout} className="px-2 py-1 bg-red-500 text-white rounded">
            Logout
          </button>
        </>
      ) : (
        <>
          <Link to="/login" className="px-2 py-1 bg-blue-500 text-white rounded">
            Login
          </Link>
          <Link to="/signup" className="px-2 py-1 bg-green-500 text-white rounded">
            Sign Up
          </Link>
        </>
      )}
    </header>
  );
}