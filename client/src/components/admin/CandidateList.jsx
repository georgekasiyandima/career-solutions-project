import React, { useEffect, useState } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, InputAdornment, IconButton, CircularProgress, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const CandidateList = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState({ position: '', country: '' });
  const [selected, setSelected] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const fetchCandidates = async () => {
    setLoading(true);
    try {
      const res = await fetch('/admin/candidates');
      const data = await res.json();
      setCandidates(data.candidates || []);
    } catch {
      setCandidates([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const filtered = candidates.filter(c => {
    const matchesSearch =
      (c.first_name + ' ' + c.last_name).toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase());
    const matchesPosition = filter.position ? c.position === filter.position : true;
    const matchesCountry = filter.country ? c.country === filter.country : true;
    return matchesSearch && matchesPosition && matchesCountry;
  });

  const uniquePositions = [...new Set(candidates.map(c => c.position).filter(Boolean))];
  const uniqueCountries = [...new Set(candidates.map(c => c.country).filter(Boolean))];

  const handleView = (candidate) => {
    setSelected(candidate);
    setEditMode(false);
    setEditData(candidate);
  };

  const handleEdit = (candidate) => {
    setSelected(candidate);
    setEditMode(true);
    setEditData(candidate);
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleClose = () => {
    setSelected(null);
    setEditMode(false);
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`/admin/candidates/${selected.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData),
      });
      if (res.ok) {
        setSnackbar({ open: true, message: 'Candidate updated successfully!', severity: 'success' });
        setSelected(null);
        setEditMode(false);
        fetchCandidates();
      } else {
        const data = await res.json();
        setSnackbar({ open: true, message: data.error || 'Update failed.', severity: 'error' });
      }
    } catch (err) {
      setSnackbar({ open: true, message: 'Network error.', severity: 'error' });
    }
  };

  const downloadCSV = (rows) => {
    if (!rows.length) return;
    const header = Object.keys(rows[0]);
    const csv = [header.join(',')].concat(
      rows.map(row => header.map(field => '"' + (row[field] || '').toString().replace(/"/g, '""') + '"').join(','))
    ).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'candidates.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>Candidate List</Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          label="Search by name or email"
          value={search}
          onChange={e => setSearch(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton>
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            )
          }}
          size="small"
        />
        <TextField
          label="Position"
          select
          SelectProps={{ native: true }}
          value={filter.position}
          onChange={e => setFilter(f => ({ ...f, position: e.target.value }))}
          size="small"
        >
          <option value="">All Positions</option>
          {uniquePositions.map(pos => (
            <option key={pos} value={pos}>{pos}</option>
          ))}
        </TextField>
        <TextField
          label="Country"
          select
          SelectProps={{ native: true }}
          value={filter.country}
          onChange={e => setFilter(f => ({ ...f, country: e.target.value }))}
          size="small"
        >
          <option value="">All Countries</option>
          {uniqueCountries.map(cntry => (
            <option key={cntry} value={cntry}>{cntry}</option>
          ))}
        </TextField>
        <Button
          variant="outlined"
          startIcon={<FileDownloadIcon />}
          onClick={() => downloadCSV(filtered)}
          disabled={!filtered.length}
        >
          Export CSV
        </Button>
      </Box>
      {loading ? (
        <Box sx={{ textAlign: 'center', mt: 4 }}><CircularProgress /></Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Position</TableCell>
                <TableCell>Country</TableCell>
                <TableCell>Qualifications</TableCell>
                <TableCell>Gender</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map(c => (
                <TableRow key={c.id}>
                  <TableCell>{c.first_name} {c.last_name}</TableCell>
                  <TableCell>{c.email}</TableCell>
                  <TableCell>{c.position}</TableCell>
                  <TableCell>{c.country}</TableCell>
                  <TableCell>{c.qualifications}</TableCell>
                  <TableCell>{c.gender}</TableCell>
                  <TableCell>{new Date(c.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleView(c)} title="View"><VisibilityIcon /></IconButton>
                    <IconButton onClick={() => handleEdit(c)} title="Edit"><EditIcon /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} align="center">No candidates found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {/* View/Edit Modal */}
      <Dialog open={!!selected} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editMode ? 'Edit Candidate' : 'Candidate Details'}</DialogTitle>
        <DialogContent>
          {selected && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <TextField label="First Name" name="first_name" value={editData.first_name || ''} onChange={handleEditChange} disabled={!editMode} fullWidth />
              <TextField label="Last Name" name="last_name" value={editData.last_name || ''} onChange={handleEditChange} disabled={!editMode} fullWidth />
              <TextField label="Email" name="email" value={editData.email || ''} onChange={handleEditChange} disabled fullWidth />
              <TextField label="Position" name="position" value={editData.position || ''} onChange={handleEditChange} disabled={!editMode} fullWidth />
              <TextField label="Country" name="country" value={editData.country || ''} onChange={handleEditChange} disabled={!editMode} fullWidth />
              <TextField label="Qualifications" name="qualifications" value={editData.qualifications || ''} onChange={handleEditChange} disabled={!editMode} fullWidth />
              <TextField label="Gender" name="gender" value={editData.gender || ''} onChange={handleEditChange} disabled={!editMode} fullWidth />
              <TextField label="Age Group" name="age_group" value={editData.age_group || ''} onChange={handleEditChange} disabled={!editMode} fullWidth />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
          {editMode ? (
            <Button variant="contained" color="primary" onClick={handleSave}>Save</Button>
          ) : (
            <Button onClick={() => setEditMode(true)} variant="contained">Edit</Button>
          )}
        </DialogActions>
      </Dialog>
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar(s => ({ ...s, open: false }))}>
        <MuiAlert elevation={6} variant="filled" onClose={() => setSnackbar(s => ({ ...s, open: false }))} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </MuiAlert>
      </Snackbar>
    </Box>
  );
};

export default CandidateList; 