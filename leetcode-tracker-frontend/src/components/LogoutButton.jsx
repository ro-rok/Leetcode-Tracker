import api from '../api';

export default function LogoutButton({ onLogout }) {
  const logout = async () => {
    try {
      await api.delete('/users/sign_out.json');
    } finally {
      onLogout();
    }
  };
  return (
    <button
      onClick={logout}
      className="w-full mb-4 text-left text-red-500 hover:underline"
    >
      Logout
    </button>
  );
}
