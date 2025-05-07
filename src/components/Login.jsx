import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = ({ setToken }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const navigate = useNavigate();

  const handleLogin = async () => {
    setErrorMsg('');
    const errors = {};

    if (!username) errors.username = 'Username is required';
    if (!password) errors.password = 'Password is required';

    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) return;

    try {
      setLoading(true);
      const response = await axios.post('https://lcrks.leanagri.com/rest-auth/login/', {
        username,
        password,
      });
      const token = response.data.key;
      localStorage.setItem('authToken', token);
      setToken(token);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setErrorMsg('Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md space-y-6">
        <h2 className="text-2xl font-bold text-center">Login</h2>

        <div className="space-y-1">
          <input
            type="text"
            placeholder="Username"
            className={`w-full p-3 border rounded ${fieldErrors.username ? 'border-red-500' : 'border-gray-300'}`}
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              if (fieldErrors.username) setFieldErrors({ ...fieldErrors, username: '' });
            }}
          />
          {fieldErrors.username && (
            <p className="text-sm text-red-500">{fieldErrors.username}</p>
          )}
        </div>

        <div className="space-y-1">
          <input
            type="password"
            placeholder="Password"
            className={`w-full p-3 border rounded ${fieldErrors.password ? 'border-red-500' : 'border-gray-300'}`}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (fieldErrors.password) setFieldErrors({ ...fieldErrors, password: '' });
            }}
          />
          {fieldErrors.password && (
            <p className="text-sm text-red-500">{fieldErrors.password}</p>
          )}
        </div>

        {errorMsg && (
          <div className="text-sm text-red-600 text-center">{errorMsg}</div>
        )}

        <button
          onClick={handleLogin}
          disabled={loading}
          className={`w-full flex items-center justify-center gap-2 bg-blue-500 text-white font-medium py-2 rounded hover:bg-blue-600 transition ${
            loading ? 'cursor-not-allowed blur-sm opacity-80' : ''
          }`}
        >
          {loading && (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          )}
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
