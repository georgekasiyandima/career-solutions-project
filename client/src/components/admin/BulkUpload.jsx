import React, { useState } from 'react';
import { Box, Button, Typography, CircularProgress, Alert, Paper } from '@mui/material';

const BulkUpload = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setResult(null);
    setError(null);
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setResult(null);
    setError(null);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('/admin/bulk-upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setResult(data);
      } else {
        setError(data.error || 'Upload failed.');
      }
    } catch (err) {
      setError('Network error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 4, maxWidth: 500, mx: 'auto', mt: 4 }} elevation={3}>
      <Typography variant="h5" gutterBottom>Bulk Data Upload</Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Upload a CSV, Excel, or JSON file to import candidates in bulk.
      </Typography>
      <input
        type="file"
        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, .json"
        onChange={handleFileChange}
        style={{ margin: '16px 0' }}
      />
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mt: 2 }}>
        <Button variant="contained" color="primary" onClick={handleUpload} disabled={!file || loading}>
          Upload
        </Button>
        {loading && <CircularProgress size={24} />}
      </Box>
      {result && (
        <Alert severity="success" sx={{ mt: 3 }}>
          Imported: {result.inserted} records.<br />
          {result.errors && result.errors.length > 0 && (
            <>
              {result.errors.length} errors:<br />
              <ul style={{ margin: 0, paddingLeft: 16 }}>
                {result.errors.slice(0, 3).map((err, i) => (
                  <li key={i}>{err.error}</li>
                ))}
              </ul>
              {result.errors.length > 3 && <span>...and more</span>}
            </>
          )}
        </Alert>
      )}
      {error && <Alert severity="error" sx={{ mt: 3 }}>{error}</Alert>}
    </Paper>
  );
};

export default BulkUpload; 