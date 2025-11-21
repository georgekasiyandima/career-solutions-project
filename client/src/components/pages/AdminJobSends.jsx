import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL, STORAGE_KEYS } from '../../config/constants';
import Select from 'react-select';

const PAGE_SIZE = 20;

function toCSV(rows) {
  if (!rows.length) return '';
  const headers = [
    'Date',
    'Job Title',
    'Client Name',
    'Email',
    'Phone',
    'Channel'
  ];
  const escape = (str) => `"${String(str).replace(/"/g, '""')}"`;
  const csvRows = [headers.join(',')];
  for (const row of rows) {
    csvRows.push([
      new Date(row.sent_at).toLocaleString(),
      row.job_title,
      row.client_name,
      row.email,
      row.phone,
      row.channel
    ].map(escape).join(','));
  }
  return csvRows.join('\n');
}

// Custom styles for react-select to ensure visible text
const selectStyles = {
  input: (provided) => ({ ...provided, color: '#1f2937' }),
  singleValue: (provided) => ({ ...provided, color: '#1f2937' }),
  placeholder: (provided) => ({ ...provided, color: '#1f2937' }),
  menu: (provided) => ({ ...provided, color: '#1f2937' }),
  option: (provided, state) => ({
    ...provided,
    color: '#1f2937',
    backgroundColor: state.isFocused ? '#e5e7eb' : 'white',
  }),
};

const AdminJobSends = () => {
  const [logs, setLogs] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ client_id: '', job_id: '', channel: '', date: '' });
  const [clients, setClients] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/clients`);
        setClients(res.data);
      } catch (err) {
        setClients([]);
      }
    };
    const fetchJobs = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/jobs`);
        setJobs(res.data);
      } catch (err) {
        setJobs([]);
      }
    };
    fetchClients();
    fetchJobs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { limit: PAGE_SIZE, offset: (page - 1) * PAGE_SIZE };
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params[key] = value;
      });
      const res = await axios.get(`${API_BASE_URL}/job-sends`, { params });
      setLogs(res.data.logs);
      setTotal(res.data.total);
    } catch (err) {
      setError('Failed to fetch job send logs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    // eslint-disable-next-line
  }, [JSON.stringify(filters), page]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setPage(1);
  };

  // For react-select
  const clientOptions = clients.map(c => ({ value: c.id, label: `${c.name} (${c.email})` }));
  const jobOptions = jobs.map(j => ({ value: j.id, label: `${j.title} (${j.company})` }));

  const handleClientSelect = (selected) => {
    setFilters(f => ({ ...f, client_id: selected ? selected.value : '' }));
    setPage(1);
  };
  const handleJobSelect = (selected) => {
    setFilters(f => ({ ...f, job_id: selected ? selected.value : '' }));
    setPage(1);
  };

  const totalPages = Math.ceil(total / PAGE_SIZE);

  const handleExportCSV = () => {
    const csv = toCSV(logs);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `job_send_log_page${page}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto p-4 mt-24 max-w-4xl">
      <h1 className="text-2xl font-bold mb-4">Job Send Log</h1>
      <div className="flex flex-wrap gap-4 mb-4 items-center">
        <div className="min-w-[220px]">
          <Select
            options={clientOptions}
            value={clientOptions.find(opt => opt.value === filters.client_id) || null}
            onChange={handleClientSelect}
            isClearable
            placeholder="All Clients"
            classNamePrefix="react-select"
            styles={selectStyles}
          />
        </div>
        <div className="min-w-[220px]">
          <Select
            options={jobOptions}
            value={jobOptions.find(opt => opt.value === filters.job_id) || null}
            onChange={handleJobSelect}
            isClearable
            placeholder="All Jobs"
            classNamePrefix="react-select"
            styles={selectStyles}
          />
        </div>
        <select
          name="channel"
          value={filters.channel}
          onChange={handleFilterChange}
          className="p-2 border rounded text-gray-800"
        >
          <option value="">All Channels</option>
          <option value="email">Email</option>
          <option value="whatsapp">WhatsApp</option>
        </select>
        <input
          type="date"
          name="date"
          value={filters.date}
          onChange={handleFilterChange}
          className="p-2 border rounded text-gray-800"
        />
        <button
          onClick={fetchLogs}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Filter
        </button>
        <button
          onClick={handleExportCSV}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Export CSV
        </button>
      </div>
      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : error ? (
        <div className="text-red-500 bg-red-100 p-4 rounded">{error}</div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border rounded shadow">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 border-b text-gray-800">Date</th>
                  <th className="py-2 px-4 border-b text-gray-800">Job Title</th>
                  <th className="py-2 px-4 border-b text-gray-800">Client Name</th>
                  <th className="py-2 px-4 border-b text-gray-800">Email</th>
                  <th className="py-2 px-4 border-b text-gray-800">Phone</th>
                  <th className="py-2 px-4 border-b text-gray-800">Channel</th>
                </tr>
              </thead>
              <tbody>
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-4 text-gray-500">No logs found.</td>
                  </tr>
                ) : (
                  logs.map(log => (
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="py-2 px-4 border-b text-gray-800">{new Date(log.sent_at).toLocaleString()}</td>
                      <td className="py-2 px-4 border-b text-gray-800">{log.job_title}</td>
                      <td className="py-2 px-4 border-b text-gray-800">{log.client_name}</td>
                      <td className="py-2 px-4 border-b text-gray-800">{log.email}</td>
                      <td className="py-2 px-4 border-b text-gray-800">{log.phone}</td>
                      <td className="py-2 px-4 border-b capitalize text-gray-800">
                        <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${log.channel === 'email' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                          {log.channel}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
              >
                Prev
              </button>
              <span className="font-semibold">Page {page} of {totalPages}</span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
                className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminJobSends; 