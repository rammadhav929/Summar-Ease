import React, { useState } from 'react';
import axios from 'axios';

const SummarizerApp = () => {
  const [text, setText] = useState('');
  const [summary, setSummary] = useState('');
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);

 
  const summarizeFile = async () => {
    try {
      if (!file) return alert('Select a file!');
      const formData = new FormData();
      formData.append('file', file);

      setLoading(true);
      const res = await axios.post('http://localhost:5000/summarize-file', formData);
      setSummary(res.data.summary);
    } catch (err) {
      setSummary('❌ Error summarizing file');
    } finally {
      setLoading(false);
    }
  };

  const summarizeUrl = async () => {
    try {
      setLoading(true);
      const res = await axios.post('http://localhost:5000/summarize-url', { url });
      setSummary(res.data.summary);
    } catch (err) {
      setSummary('❌ Error summarizing URL');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: 'auto' }}>
      <h1>🔍Summarizer System</h1>

      
      <hr />

      <input
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={(e) => setFile(e.target.files[0])}
        style={{ marginBottom: '1rem' }}
      />
      <button onClick={summarizeFile} disabled={loading}>Summarize File</button>

      <hr />

      <input
        type="text"
        placeholder="Enter a URL to summarize"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        style={{ width: '100%', marginBottom: '1rem' }}
      />
      <button onClick={summarizeUrl} disabled={loading}>Summarize URL</button>

      <hr />

      <h3>📄 Summary Output:</h3>
      <pre>{loading ? '⏳ Loading...' : summary}</pre>
    </div>
  );
};

export default SummarizerApp;
