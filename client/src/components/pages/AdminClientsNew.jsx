import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../config/constants';
import { motion } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaUsers } from 'react-icons/fa';

const initialForm = { name: '', email: '', phone: '' };

const AdminClients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [editingClient, setEditingClient] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchClients = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_BASE_URL}/clients`);
      setClients(res.data);
    } catch (err) {
      setError('Failed to fetch clients.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const openAddModal = () => {
    setForm(initialForm);
    setEditingClient(null);
    setModalOpen(true);
  };

  const openEditModal = (client) => {
    setForm({ name: client.name, email: client.email, phone: client.phone || '' });
    setEditingClient(client);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingClient(null);
    setForm(initialForm);
  };

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      if (editingClient) {
        await axios.put(`${API_BASE_URL}/clients/${editingClient.id}`, form);
      } else {
        await axios.post(`${API_BASE_URL}/clients`, form);
      }
      closeModal();
      fetchClients();
    } catch (err) {
      alert('Failed to save client.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setActionLoading(true);
    try {
      await axios.delete(`${API_BASE_URL}/clients/${deleteId}`);
      setDeleteId(null);
      fetchClients();
    } catch (err) {
      alert('Failed to delete client.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brandDarkTeal to-brandGreen-default py-16 px-4">
      <div className="container mx-auto max-w-7xl">
        
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold text-white font-poppins mb-6">
            Client Management
          </h1>
          <p className="text-xl text-white/90 font-poppins max-w-3xl mx-auto leading-relaxed">
            Manage your client database and track client relationships
          </p>
        </motion.div>

        {/* Add Client Button */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <button
            className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-6 py-3 text-white font-poppins hover:bg-white/15 transition-all duration-300 flex items-center space-x-2 group"
            onClick={openAddModal}
          >
            <FaPlus className="text-lg group-hover:scale-110 transition-transform duration-300" />
            <span>Add New Client</span>
          </button>
        </motion.div>

        {/* Content */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {loading ? (
            <div className="text-center py-16">
              <div className="text-white font-poppins text-xl">Loading clients...</div>
            </div>
          ) : error ? (
            <div className="bg-red-500/20 border border-red-500/30 text-red-100 p-6 rounded-2xl">
              <p className="font-poppins">{error}</p>
            </div>
          ) : (
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl overflow-hidden">
              {clients.length === 0 ? (
                <div className="text-center py-16">
                  <FaUsers className="text-6xl text-white/50 mx-auto mb-4" />
                  <p className="text-white/70 font-poppins text-lg">No clients found.</p>
                  <p className="text-white/50 font-poppins">Add your first client to get started.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-white/5 border-b border-white/10">
                        <th className="py-4 px-6 text-left text-white font-poppins font-semibold">Name</th>
                        <th className="py-4 px-6 text-left text-white font-poppins font-semibold">Email</th>
                        <th className="py-4 px-6 text-left text-white font-poppins font-semibold">Phone</th>
                        <th className="py-4 px-6 text-left text-white font-poppins font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {clients.map((client, index) => (
                        <motion.tr 
                          key={client.id} 
                          className="border-b border-white/5 hover:bg-white/5 transition-all duration-300"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                          <td className="py-4 px-6 text-white font-poppins">{client.name}</td>
                          <td className="py-4 px-6 text-white/90 font-poppins">{client.email}</td>
                          <td className="py-4 px-6 text-white/80 font-poppins">{client.phone || 'N/A'}</td>
                          <td className="py-4 px-6">
                            <div className="flex space-x-2">
                              <button
                                className="bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 px-3 py-1 rounded-lg hover:bg-yellow-500/30 transition-all duration-300 flex items-center space-x-1"
                                onClick={() => openEditModal(client)}
                              >
                                <FaEdit className="text-sm" />
                                <span>Edit</span>
                              </button>
                              <button
                                className="bg-red-500/20 border border-red-500/30 text-red-400 px-3 py-1 rounded-lg hover:bg-red-500/30 transition-all duration-300 flex items-center space-x-1"
                                onClick={() => setDeleteId(client.id)}
                              >
                                <FaTrash className="text-sm" />
                                <span>Delete</span>
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div 
            className="bg-gradient-to-br from-brandDarkTeal to-brandGreen-default border border-white/20 rounded-2xl p-8 w-full max-w-md relative"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <button 
              onClick={closeModal} 
              className="absolute top-4 right-4 text-white/70 hover:text-white text-2xl transition-colors duration-300"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold text-white font-poppins mb-6">
              {editingClient ? 'Edit Client' : 'Add New Client'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-white/90 font-poppins mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleFormChange}
                  placeholder="Enter client name"
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white font-poppins placeholder-white/50 focus:outline-none focus:border-white/40 transition-all duration-300"
                  required
                />
              </div>
              <div>
                <label className="block text-white/90 font-poppins mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleFormChange}
                  placeholder="Enter client email"
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white font-poppins placeholder-white/50 focus:outline-none focus:border-white/40 transition-all duration-300"
                  required
                />
              </div>
              <div>
                <label className="block text-white/90 font-poppins mb-2">Phone (Optional)</label>
                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleFormChange}
                  placeholder="Enter phone number"
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white font-poppins placeholder-white/50 focus:outline-none focus:border-white/40 transition-all duration-300"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-white/10 border border-white/20 text-white font-poppins px-6 py-2 rounded-lg hover:bg-white/20 transition-all duration-300"
                  disabled={actionLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-white/20 border border-white/30 text-white font-poppins px-6 py-2 rounded-lg hover:bg-white/30 transition-all duration-300"
                  disabled={actionLoading}
                >
                  {actionLoading ? 'Saving...' : (editingClient ? 'Update' : 'Add')}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div 
            className="bg-gradient-to-br from-brandDarkTeal to-brandGreen-default border border-white/20 rounded-2xl p-8 w-full max-w-sm relative"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <h2 className="text-xl font-bold text-white font-poppins mb-4">Delete Client</h2>
            <p className="text-white/90 font-poppins mb-6">Are you sure you want to delete this client? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="bg-white/10 border border-white/20 text-white font-poppins px-4 py-2 rounded-lg hover:bg-white/20 transition-all duration-300"
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500/20 border border-red-500/30 text-red-400 font-poppins px-4 py-2 rounded-lg hover:bg-red-500/30 transition-all duration-300"
                disabled={actionLoading}
              >
                {actionLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminClients; 