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
      const url = mode === 'login'
        ? '/users/sign_in.json'
        : '/users.json';

      const payload = {
        user: {
          email,
          password,
          ...(mode === 'signup' && { password_confirmation: pwConfirm })
        }
      };
      const res = await api.post(url, payload);
      onAuth(res.data);
    } catch (err) {
      const msg = err.response?.data?.errors?.join(', ')
        || err.response?.data?.error
        || (mode === 'login' ? 'Login failed' : 'Signup failed');
      setError(msg);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur">
      <div className="relative w-full max-w-sm p-6 bg-zinc-900 rounded-xl shadow-xl text-white">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-400 hover:text-red-500 text-xl"
        >✕</button>

        <div className="flex justify-center mb-6 space-x-6">
          <button
            type="button"
            className={`pb-1 border-b-2 ${mode === 'login' ? 'border-blue-500 text-blue-400 font-bold' : 'border-transparent text-gray-400 hover:text-white'}`}
            onClick={() => setMode('login')}
          >
            Login
          </button>
          <button
            type="button"
            className={`pb-1 border-b-2 ${mode === 'signup' ? 'border-green-500 text-green-400 font-bold' : 'border-transparent text-gray-400 hover:text-white'}`}
            onClick={() => setMode('signup')}
          >
            Sign Up
          </button>
        </div>

        {error && <div className="text-red-400 text-sm mb-3">{error}</div>}

        <form onSubmit={submit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 bg-zinc-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 bg-zinc-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {mode === 'signup' && (
            <input
              type="password"
              placeholder="Confirm Password"
              value={pwConfirm}
              onChange={e => setPwConfirm(e.target.value)}
              required
              className="w-full px-3 py-2 bg-zinc-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          )}
          <button
            type="submit"
            className={`w-full py-2 rounded-md font-semibold transition ${
              mode === 'login'
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
}