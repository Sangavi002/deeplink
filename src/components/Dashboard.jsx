import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CreateShortUrl from './CreateShortUrl';
import ViewShortUrls from './ViewShortUrls';

const Dashboard = ({ token }) => {
  const [tab, setTab] = useState('create');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/');
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto relative min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
        <div className="absolute right-4 top-4 sm:static">
          <button
            onClick={handleLogout}
            className="py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-300 mb-6 flex flex-col sm:flex-row gap-4 sm:gap-6">
        <button
          onClick={() => setTab('create')}
          className={`pb-2 text-lg font-medium transition-all ${
            tab === 'create'
              ? 'border-b-4 border-blue-500 text-black'
              : 'text-black hover:text-blue-600'
          }`}
        >
          Create Short URL
        </button>
        <button
          onClick={() => setTab('view')}
          className={`pb-2 text-lg font-medium transition-all ${
            tab === 'view'
              ? 'border-b-4 border-blue-500 text-black'
              : 'text-black hover:text-blue-600'
          }`}
        >
          View Short URLs
        </button>
      </div>

      {/* Content */}
      <div className="mt-4">
        {tab === 'create' ? (
          <CreateShortUrl token={token} />
        ) : (
          <ViewShortUrls token={token} />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
