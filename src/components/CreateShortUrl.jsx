import React, { useState } from 'react';
import axios from 'axios';
import { FaRegCopy } from 'react-icons/fa';

const CreateShortUrl = ({ token }) => {
  const [form, setForm] = useState({ name: '', long_url: '', fallback_url: '', short_url: '' });
  const [generated, setGenerated] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (errors[name] && value.trim()) {
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const urlPattern = /^(https?:\/\/)[^\s/$.?#].[^\s]*$/i;

    if (!form.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (form.name.trim().length > 64) {
      newErrors.name = 'Name should not exceed 64 characters';
    }

    if (!form.long_url.trim()) {
      newErrors.long_url = 'Long URL is required';
    } else if (!urlPattern.test(form.long_url.trim())) {
      newErrors.long_url = 'Enter a valid URL (e.g., https://example.com)';
    }

    if (form.fallback_url && !urlPattern.test(form.fallback_url.trim())) {
      newErrors.fallback_url = 'Enter a valid fallback URL';
    }

    if (form.short_url && form.short_url.trim().length > 8) {
      newErrors.short_url = 'Short link endpoint should not exceed 8 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGenerate = async () => {
    if (!validateForm()) return;
    setLoading(true);

    try {
      const payload = {
        name: form.name.trim(),
        long_url: form.long_url.trim(),
      };
      if (form.short_url.trim()) payload.short_url = form.short_url.trim();
      if (form.fallback_url.trim()) payload.fallback_url = form.fallback_url.trim();

      const response = await axios.post(
        'https://pre-prod.leanagri.com/deeplink/api/v1/create-deeplink/',
        payload,
        { headers: { Authorization: `Token ${token}` } }
      );

      setGenerated(`app.bharatagri.co/${response.data.short_url}`);
      setShowModal(true);
      setForm({ name: '', long_url: '', fallback_url: '', short_url: '' });
    } catch (err) {
      console.error('Error:', err.response?.data || err.message);
      setGenerated(`Something went wrong, Error: ${err.response?.data?.error || err.message}`);
      setShowModal(true);
      setForm({ name: '', long_url: '', fallback_url: '', short_url: '' });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generated);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ backgroundColor: '#252c36' }} className="max-w-xl mx-auto p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-white mb-6">Create Short URL</h2>

      <div className="space-y-3">
        {['long_url', 'name', 'short_url', 'fallback_url'].map((field) => (
          <div key={field} className="space-y-2">
            <label htmlFor={field} className="text-white font-semibold p-1">
              {field === 'long_url'
                ? 'Long URL *'
                : field === 'name'
                ? 'Name *'
                : field === 'short_url'
                ? 'Short Link Endpoint (Optional)'
                : 'Fallback URL (Optional)'}
            </label>
            <input
              name={field}
              type={field.includes('url') ? 'url' : 'text'}
              id={field}
              maxLength={field === 'name' ? 64 : field === 'short_url' ? 8 : undefined}
              pattern={field === 'long_url' || field === 'fallback_url' ? 'https?://.+' : undefined}
              className={`w-full p-4 mt-1 border rounded-xl ${
                errors[field] ? 'border-red-600' : 'border-gray-600'
              } bg-gray-700 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600`}
              placeholder={
                field === 'long_url'
                  ? 'Enter the long URL (e.g., https://...)'
                  : field === 'name'
                  ? 'Enter a name for the URL'
                  : field === 'short_url'
                  ? 'Optional: Custom short URL'
                  : 'Optional: Fallback URL (e.g., https://...)'
              }
              value={form[field]}
              onChange={handleChange}
              required={field === 'name' || field === 'long_url'}
            />
            {errors[field] && <p className="text-red-600 text-sm">{errors[field]}</p>}
          </div>
        ))}
      </div>

      <button
        className={`w-full py-3 rounded-xl mt-6 font-semibold transition duration-300 flex justify-center items-center ${
          loading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
        } text-white`}
        onClick={handleGenerate}
        disabled={loading}
      >
        {loading ? (
          <div className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        ) : (
          'Generate Short URL'
        )}
      </button>

      {/* Success Modal */}
      {showModal && !generated.includes('Error') && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
          <div className="bg-white rounded-xl p-6 w-96 shadow-xl text-center">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Short URL Generated</h3>
            <div className="flex items-center justify-between bg-gray-100 px-4 py-3 rounded-lg">
              <span className="text-blue-600 font-medium truncate">{generated}</span>
              <button onClick={handleCopy} className="text-gray-600 hover:text-blue-600">
                <FaRegCopy />
              </button>
            </div>
            {copied && <p className="text-green-600 text-sm mt-1">Copied!</p>}
            <button
              onClick={() => setShowModal(false)}
              className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {showModal && generated.includes('Error') && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
          <div className="bg-white rounded-xl p-6 w-96 shadow-xl text-center">
            <h3 className="text-xl font-bold mb-4 text-red-600">Failed to Generate</h3>
            <p className="text-gray-700 mb-4">{generated}</p>
            <button
              onClick={() => setShowModal(false)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateShortUrl;
