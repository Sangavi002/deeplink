import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('authToken'));

  return (
    <Routes>
      <Route path="/" element={<Login setToken={setToken} />} />
      <Route path="/dashboard" element={token ? <Dashboard token={token} /> : <Login setToken={setToken} />} />
    </Routes>
  );
};

export default App;
