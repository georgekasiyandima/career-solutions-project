import React, { useState, useEffect, useCallback } from 'react';
import { contentService } from '../../services/contentService';
import { STORAGE_KEYS } from '../../config/constants';

const getScoreColor = (score) => {
  if (score >= 80) return 'bg-green-600 text-white';
  if (score >= 50) return 'bg-yellow-500 text-gray-900';
  return 'bg-red-600 text-white';
};

const AdminContent = () => {
  const [seoScores, setSeoScores] = useState({});
  const [content, setContent] = useState([]);
  const [token, setToken] = useState('');
  const [report, setReport] = useState(null);
  const [contentItem, setContentItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  // Get token from localStorage if not set
  useEffect(() => {
    if (!token) {
      const stored = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      if (stored) setToken(stored);
    }
  }, [token]);

  const fetchContent = useCallback(() => {
    setLoading(true);
    setError('');
    contentService.getAll()
      .then(res => setContent(Array.isArray(res.data) ? res.data : []))
      .catch(() => setError('Failed to load content.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  // Fetch SEO scores for all content items
  const fetchSeoScores = () => {
    if (Array.isArray(content)) {
      setRefreshing(true);
      const promises = content.map(item =>
        contentService.getSeoReport(item.id)
          .then(res => ({ id: item.id, score: res.data.score }))
          .catch(() => ({ id: item.id, score: null }))
      );
      Promise.all(promises).then(results => {
        const scores = {};
        results.forEach(({ id, score }) => { if (score !== null) scores[id] = score; });
        setSeoScores(scores);
        setRefreshing(false);
      });
    }
  };

  useEffect(() => {
    fetchSeoScores();
    // eslint-disable-next-line
  }, [content]);

  // Open modal and fetch full SEO report
  const handleShowReport = (item) => {
    setContentItem(item);
    contentService.getSeoReport(item.id)
      .then(res => {
        setReport(res.data);
        setShowModal(true);
      })
      .catch(() => setReport(null));
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setReport(null);
    setContentItem(null);
  };

  const handleEditClick = (item) => {
    setSelectedItem(item);
    setEditFormData({ ...item });
    setShowEditModal(true);
  };

  const handleDeleteClick = (item) => {
    setSelectedItem(item);
    setShowDeleteModal(true);
  };

  const handleModalClose = () => {
    setShowEditModal(false);
    setShowDeleteModal(false);
    setSelectedItem(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    if (!selectedItem) return;
    contentService.update(selectedItem.id, editFormData)
      .then(() => {
        handleModalClose();
        fetchContent(); // Refetch content
      })
      .catch(err => {
        console.error('Update failed:', err);
        setError('Failed to update content.');
      });
  };

  const handleDeleteConfirm = () => {
    if (!selectedItem) return;
    contentService.delete(selectedItem.id)
      .then(() => {
        handleModalClose();
        fetchContent(); // Refetch content
      })
      .catch(err => {
        console.error('Delete failed:', err);
        setError('Failed to delete content.');
      });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Content Manager</h1>
      <div className="flex items-center gap-4 mb-4">
        <button
          className="px-3 py-1 bg-blue-700 text-white rounded hover:bg-blue-800 transition"
          onClick={fetchSeoScores}
          disabled={refreshing}
        >
          {refreshing ? 'Refreshing...' : 'Refresh SEO Scores'}
        </button>
        {loading && <span className="text-gray-400">Loading content...</span>}
        {error && <span className="text-red-500">{error}</span>}
      </div>
      <table className="min-w-full bg-gray-900 rounded-lg overflow-hidden">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-300">Title</th>
            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-300">SEO Score</th>
            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-300">Actions</th>
          </tr>
        </thead>
        <tbody>
          {content.map(item => (
            <tr key={item.id} className="border-b border-gray-800 hover:bg-gray-800">
              <td className="px-4 py-2 text-gray-100">{item.title}</td>
              <td className="px-4 py-2">
                {seoScores[item.id] !== undefined ? (
                  <button
                    className={`px-2 py-1 rounded font-bold text-xs focus:outline-none ${getScoreColor(seoScores[item.id])}`}
                    onClick={() => handleShowReport(item)}
                    title="View SEO Report"
                  >
                    {seoScores[item.id]}
                  </button>
                ) : (
                  <span className="text-gray-500 text-xs">N/A</span>
                )}
              </td>
              <td className="px-4 py-2 flex gap-2">
                <button
                  onClick={() => handleEditClick(item)}
                  className="px-2 py-1 bg-yellow-600 text-white rounded text-xs hover:bg-yellow-700 transition"
                  title="Edit">Edit</button>
                <button
                  onClick={() => handleDeleteClick(item)}
                  className="px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700 transition"
                  title="Delete">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* SEO Report Modal */}
      {showModal && report && contentItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-gray-900 rounded-lg shadow-lg p-6 w-full max-w-lg relative animate-fade-in">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-white text-2xl font-bold"
              onClick={handleCloseModal}
              aria-label="Close"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-2 text-white">SEO Report</h2>
            <div className="flex items-center gap-3 mb-4">
              <span className={`px-3 py-1 rounded font-bold text-lg ${getScoreColor(report.score)}`}>{report.score}</span>
              <span className="text-gray-400 text-sm">SEO Score</span>
            </div>
            {/* SERP Preview */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 mb-4">
              <div className="text-xs text-gray-400 mb-1">SERP Preview:</div>
              <div className="bg-white text-gray-900 rounded p-3 shadow">
                <div className="font-bold text-blue-800 text-base truncate">{contentItem.seo_title || contentItem.title || 'Title'}</div>
                <div className="text-green-700 text-xs mb-1">careersolutions.com/your-page</div>
                <div className="text-gray-700 text-sm truncate">{contentItem.seo_description || 'Meta description will appear here.'}</div>
              </div>
            </div>
            {/* SEO Details */}
            <div className="mb-2">
              <div className="text-gray-300 text-sm mb-1">Title Length: <span className={report.titleOk ? 'text-green-400' : 'text-red-400'}>{report.titleLength}</span></div>
              <div className="text-gray-300 text-sm mb-1">SEO Title Length: <span className={report.seoTitleOk ? 'text-green-400' : 'text-red-400'}>{report.seoTitleLength}</span></div>
              <div className="text-gray-300 text-sm mb-1">Meta Description Length: <span className={report.seoDescriptionOk ? 'text-green-400' : 'text-red-400'}>{report.seoDescriptionLength}</span></div>
              <div className="text-gray-300 text-sm mb-1">Body Word Count: <span className={report.bodyWordCount >= 300 ? 'text-green-400' : 'text-yellow-400'}>{report.bodyWordCount}</span></div>
              <div className="text-gray-300 text-sm mb-1">Keywords: <span className="text-blue-400">{report.keywords.join(', ') || 'None'}</span></div>
            </div>
            <div className="mb-2">
              <div className="text-gray-300 text-sm font-semibold mb-1">Keyword Density:</div>
              <ul className="text-gray-400 text-xs ml-4">
                {Object.entries(report.keywordDensity).map(([k, v]) => (
                  <li key={k}>{k}: {v}%</li>
                ))}
              </ul>
            </div>
            <div className="mb-2">
              <div className="text-gray-300 text-sm font-semibold mb-1">Suggestions:</div>
              <ul className="text-yellow-400 text-xs ml-4">
                {report.suggestions.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-gray-900 rounded-lg shadow-lg p-6 w-full max-w-2xl relative">
            <h2 className="text-xl font-bold mb-4 text-white">Edit Content</h2>
            <form onSubmit={handleUpdateSubmit}>
              {/* Form fields for title, body, tags, etc. */}
              <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium text-gray-300">Title</label>
                <input type="text" name="title" id="title" value={editFormData.title || ''} onChange={handleFormChange} className="mt-1 block w-full bg-gray-800 border-gray-700 rounded-md shadow-sm text-white p-2" />
              </div>
              <div className="mb-4">
                <label htmlFor="body" className="block text-sm font-medium text-gray-300">Body</label>
                <textarea name="body" id="body" rows="6" value={editFormData.body || ''} onChange={handleFormChange} className="mt-1 block w-full bg-gray-800 border-gray-700 rounded-md shadow-sm text-white p-2"></textarea>
              </div>
              {/* Add other fields like seo_title, seo_description, tags as needed */}
              <div className="flex justify-end gap-4">
                <button type="button" onClick={handleModalClose} className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-gray-900 rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <h2 className="text-xl font-bold mb-4 text-white">Confirm Deletion</h2>
            <p className="text-gray-300 mb-6">Are you sure you want to delete "{selectedItem.title}"? This action cannot be undone.</p>
            <div className="flex justify-end gap-4">
              <button onClick={handleModalClose} className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600">Cancel</button>
              <button onClick={handleDeleteConfirm} className="px-4 py-2 bg-red-700 text-white rounded hover:bg-red-800">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminContent; 