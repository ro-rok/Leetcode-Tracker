import { useState } from 'react';
import api from '../api';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState(''), [password, setPassword] = useState('');

  const submit = e => {
    e.preventDefault();
    api.post('/users/sign_in.json', {
      user: { email, password }
    }).then(r => {
      onLogin(r.data);
    }).catch(() => {
      alert('Login failed');
    });
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <form
        onSubmit={submit}
        className="bg-white dark:bg-gray-800 p-6 rounded shadow"
      >
        <h2 className="text-xl mb-4">Login</h2>
        <input
          type="email"
          placeholder="Email"
          className="w-full mb-2 p-2 bg-gray-100 dark:bg-gray-700"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 p-2 bg-gray-100 dark:bg-gray-700"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button className="w-full py-2 bg-blue-500 text-white rounded">
          Sign In
        </button>
      </form>
    </div>
  );
}
