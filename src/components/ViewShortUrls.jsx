import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaRegCopy } from 'react-icons/fa';

const ViewShortUrls = ({ token }) => {
  const [results, setResults] = useState([]);
  const [searchType, setSearchType] = useState('name');
  const [searchValue, setSearchValue] = useState('');
  const [debouncedSearchValue, setDebouncedSearchValue] = useState('');
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [copiedId, setCopiedId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchValue(searchValue);
      setPage(1);
    }, 650);
    return () => clearTimeout(handler);
  }, [searchValue]);

  const fetchUrls = async () => {
    setLoading(true);
    try {
      let url = `https://pre-prod.leanagri.com/deeplink/api/v1/deeplinks/?page=${page}`;
      if (debouncedSearchValue) {
        url += `&${searchType}__icontains=${debouncedSearchValue}`;
      }
      const res = await axios.get(url, {
        headers: { Authorization: `Token ${token}` },
      });
      setResults(res.data.results);
      setCount(res.data.count);
    } catch (err) {
      alert('Failed to fetch URLs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUrls();
  }, [page, debouncedSearchValue, searchType]);

  const handleCopy = async (id, shortUrl) => {
    await navigator.clipboard.writeText(shortUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 mb-6">
        <select
          className="w-full sm:w-1/4 p-3 border border-gray-300 rounded-md"
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
        >
          <option value="name">Name</option>
          <option value="short_url">Short URL</option>
        </select>
        <input
          className="w-full sm:w-3/4 p-3 border border-gray-300 rounded-md mt-2 sm:mt-0"
          placeholder="Search"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </div>

      {/* Loader (above the table only) */}
      {loading && (
        <div className="flex justify-center my-4">
          <div className="w-8 h-8 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse shadow-sm rounded-lg overflow-hidden">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Long URL</th>
              <th className="p-3 text-left">Short URL</th>
              <th className="p-3 text-left">Fallback URL</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {results.length > 0 ? (
              results.map((r) => {
                const fullShortUrl = `https://app.bharatagri.co/${r.short_url}`;
                return (
                  <tr key={r.id}>
                    <td className="p-3 text-sm">{r.name}</td>
                    <td className="p-3 break-all text-sm">{r.long_url}</td>
                    <td className="p-3 break-all text-sm text-blue-600">
                      <div className="flex items-center gap-2">
                        <span>{fullShortUrl}</span>
                        <button
                          onClick={() => handleCopy(r.id, fullShortUrl)}
                          className="text-gray-600 hover:text-blue-600"
                          title="Copy to clipboard"
                        >
                          <FaRegCopy />
                        </button>
                        {copiedId === r.id && (
                          <span className="text-green-500 text-xs">Copied!</span>
                        )}
                      </div>
                    </td>
                    <td className="p-3 break-all text-sm">{r.fallback_url || '-'}</td>
                  </tr>
                );
              })
            ) : (
              !loading && (
                <tr>
                  <td colSpan="4" className="p-4 text-center text-gray-500">
                    No results found
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6 text-gray-700">
        <button
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          disabled={page === 1 || loading}
          onClick={() => setPage(page - 1)}
        >
          {'< Prev'}
        </button>
        <span>
          Page {page} of {Math.ceil(count / 10)}
        </span>
        <button
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          disabled={page >= Math.ceil(count / 10) || loading}
          onClick={() => setPage(page + 1)}
        >
          {'Next >'}
        </button>
      </div>
    </div>
  );
};

export default ViewShortUrls;
