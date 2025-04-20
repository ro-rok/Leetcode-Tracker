import { useState } from 'react';
import api from '../api';

export default function AuthForm({ onAuth }) {
  const [mode, setMode] = useState('login'); // or 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pwConfirm, setPwConfirm] = useState('');

  const submit = e => {
    e.preventDefault();
    if (mode === 'login') {
      api.post('/users/sign_in.json', { user: { email, password } })
        .then(r => onAuth(r.data))
        .catch(() => alert('Login failed'));
    } else {
      api.post('/users.json', {
        user: { email, password, password_confirmation: pwConfirm }
      })
        .then(r => onAuth(r.data))
        .catch(() => alert('Signup failed'));
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={submit}
        className="bg-white p-6 rounded shadow w-80"
      >
        <div className="mb-4 text-center">
          <button
            type="button"
            className={mode==='login' ? 'font-bold mr-4':'mr-4'}
            onClick={() => setMode('login')}
          >Login</button>
          <button
            type="button"
            className={mode==='signup' ? 'font-bold':' '}
            onClick={() => setMode('signup')}
          >Sign Up</button>
        </div>

        <input
          className="w-full mb-3 p-2 border"
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />

        <input
          className="w-full mb-3 p-2 border"
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />

        {mode === 'signup' && (
          <input
            className="w-full mb-3 p-2 border"
            type="password"
            placeholder="Confirm Password"
            value={pwConfirm}
            onChange={e => setPwConfirm(e.target.value)}
            required
          />
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          {mode === 'login' ? 'Sign In' : 'Create Account'}
        </button>
      </form>
    </div>
  );
}
