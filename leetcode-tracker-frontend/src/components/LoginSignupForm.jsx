// src/components/LoginSignupForm.jsx
import { useState } from 'react';
import api from '../api';

export default function LoginSignupForm({ onAuth, onClose }) {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pwConfirm, setPwConfirm] = useState('');
  const [error, setError] = useState(null);

  const submit = async e => {
    e.preventDefault();
    setError(null);
    try {
      const payload = { user: { email, password } };
      if (mode==='signup') payload.user.password_confirmation = pwConfirm;

      const url = mode==='login'
        ? '/users/sign_in.json'
        : '/users.json';
      const res = await api.post(url, payload);
      onAuth(res.data);
    } catch (e) {
      setError(mode==='login' ? 'Login failed' : 'Signup failed');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <form onSubmit={submit}
        className="bg-gray-800 p-6 rounded shadow-lg w-80"
      >
        <button
          type="button"
          className="absolute top-2 right-2 text-gray-400"
          onClick={onClose}
        >✕</button>

        <div className="flex justify-center mb-4 space-x-4">
          <button
            type="button"
            className={mode==='login'? 'font-bold':''}
            onClick={()=>setMode('login')}
          >Login</button>
          <button
            type="button"
            className={mode==='signup'? 'font-bold':''}
            onClick={()=>setMode('signup')}
          >Sign Up</button>
        </div>

        {error && <div className="text-red-400 mb-2">{error}</div>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e=>setEmail(e.target.value)}
          className="w-full mb-3 p-2 rounded bg-gray-700"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e=>setPassword(e.target.value)}
          className="w-full mb-3 p-2 rounded bg-gray-700"
          required
        />
        {mode==='signup' && (
          <input
            type="password"
            placeholder="Confirm Password"
            value={pwConfirm}
            onChange={e=>setPwConfirm(e.target.value)}
            className="w-full mb-3 p-2 rounded bg-gray-700"
            required
          />
        )}
        <button
          type="submit"
          className="w-full py-2 bg-blue-600 rounded text-white"
        >
          {mode==='login'? 'Sign In' : 'Create Account'}
        </button>
      </form>
    </div>
  );
}
