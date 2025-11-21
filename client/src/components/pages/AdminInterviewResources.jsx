import React, { useState, useEffect, useCallback } from 'react';
import { API_BASE_URL } from '../../config/constants';
import { useAuth } from '../../context/AuthContext';
import ReactMarkdown from 'react-markdown';

const defaultForm = {
  title: '',
  type: 'tip',
  category: '',
  content: '',
  tags: '',
  download_url: '',
  difficulty: 1,
  is_published: true,
};

const typeOptions = [
  { value: 'tip', label: 'Tip' },
  { value: 'question', label: 'Question' },
  { value: 'cheatsheet', label: 'Cheatsheet' },
];

const AdminInterviewResources = () => {
  const token = localStorage.getItem('token');
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchResources = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/interview-resources`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error('Failed to fetch resources');
      const data = await res.json();
      setResources(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  const openModal = (resource = null) => {
    if (resource) {
      setForm({ ...resource });
      setEditingId(resource.id);
    } else {
      setForm(defaultForm);
      setEditingId(null);
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setForm(defaultForm);
    setEditingId(null);
  };

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({
      ...f,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSave = async e => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `${API_BASE_URL}/admin/interview-resources/${editingId}` : `${API_BASE_URL}/admin/interview-resources`;
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed to save resource');
      closeModal();
      fetchResources();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this resource?')) return;
    setError('');
    try {
              const res = await fetch(`${API_BASE_URL}/api/admin/interview-resources/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to delete resource');
      fetchResources();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-16">
      <div className="max-w-5xl mx-auto p-4 sm:p-6 md:p-8">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Manage Interview Resources</h1>
            <p className="text-gray-400">Add, edit, or remove interview tips, questions, and cheatsheets.</p>
          </div>
          <button
            onClick={() => openModal()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold shadow transition-colors"
          >
            + Add Resource
          </button>
        </div>
        {error && <div className="text-center text-red-400 bg-red-900/50 p-4 rounded-lg mb-4">{error}</div>}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg shadow border border-gray-700/50">
            <table className="min-w-full bg-gray-800/70 text-left">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-300">Title</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-300">Type</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-300">Category</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-300">Published</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {resources.map(resource => (
                  <tr key={resource.id} className="border-t border-gray-700/30 hover:bg-gray-700/30">
                    <td className="px-4 py-3 font-medium text-white max-w-xs truncate">{resource.title}</td>
                    <td className="px-4 py-3 text-xs text-gray-300">{resource.type}</td>
                    <td className="px-4 py-3 text-xs text-gray-300">{resource.category}</td>
                    <td className="px-4 py-3 text-xs">
                      {resource.is_published ? <span className="text-green-400">Yes</span> : <span className="text-red-400">No</span>}
                    </td>
                    <td className="px-4 py-3 flex gap-2">
                      <button
                        onClick={() => openModal(resource)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs"
                      >Edit</button>
                      <button
                        onClick={() => handleDelete(resource.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
                      >Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal for Add/Edit */}
        {showModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-gray-900 rounded-xl p-8 w-full max-w-lg border border-gray-700/50 shadow-2xl">
              <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit' : 'Add'} Resource</h2>
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-1">Type</label>
                    <select
                      name="type"
                      value={form.type}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      {typeOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-1">Category</label>
                    <input
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Content</label>
                  <textarea
                    name="content"
                    value={form.content}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <div className="mt-2 bg-gray-800 border border-gray-700 rounded-lg p-3">
                    <div className="text-xs text-gray-400 mb-1">Live Preview:</div>
                    <div className="prose prose-invert max-w-none text-sm">
                      <ReactMarkdown>{form.content || '_Nothing to preview yet._'}</ReactMarkdown>
                    </div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-1">Tags (comma separated)</label>
                    <input
                      name="tags"
                      value={form.tags}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-1">Download URL (for cheatsheets)</label>
                    <input
                      name="download_url"
                      value={form.download_url}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-1">Difficulty</label>
                    <select
                      name="difficulty"
                      value={form.difficulty}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value={1}>Easy</option>
                      <option value={2}>Medium</option>
                      <option value={3}>Hard</option>
                    </select>
                  </div>
                  <div className="flex-1 flex items-center gap-2 mt-6">
                    <input
                      type="checkbox"
                      name="is_published"
                      checked={form.is_published}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="block text-sm">Published</label>
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
                  >
                    {saving ? 'Saving...' : (editingId ? 'Update' : 'Create')}
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminInterviewResources; 