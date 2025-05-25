const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const axios = require('axios');
const { JSDOM } = require('jsdom');
const { Readability } = require('@mozilla/readability');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

// Initialize app
const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Multer setup
const upload = multer({ storage: multer.memoryStorage() });

// 📄 Summarize File Route
app.post('/summarize-file', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'No file uploaded' });

    let extractedText = '';

    if (file.mimetype === 'application/pdf') {
      const data = await pdfParse(file.buffer);
      extractedText = data.text;
    } else if (
      file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      const result = await mammoth.extractRawText({ buffer: file.buffer });
      extractedText = result.value;
    } else {
      return res.status(400).json({ error: 'Unsupported file type' });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(
      `Please summarize the following content in a clean and readable format. Highlight CGPA, dates, locations, or numbers where present:\n\n${extractedText}`
    );
    const response = await result.response;
    const summary = response.text();

    res.json({ summary });
  } catch (err) {
    console.error('❌ Error summarizing file:', err.message);
    res.status(500).json({ error: 'Failed to summarize file' });
  }
});

// 🌐 Summarize URL Route
app.post('/summarize-url', async (req, res) => {
  const { url } = req.body;

  if (!url) return res.status(400).json({ error: 'No URL provided' });

  try {
    const response = await axios.get(url);
    const dom = new JSDOM(response.data);
    const reader = new Readability(dom.window.document);
    const article = reader.parse();

    if (!article || !article.textContent) {
      return res.status(500).json({ error: 'Unable to extract readable content from the URL' });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(
      `Please provide a concise and clear summary of the following webpage content:\n\n${article.textContent}`
    );
    const summary = (await result.response).text();

    res.json({ summary });
  } catch (err) {
    console.error('❌ Error summarizing URL:', err.message);
    res.status(500).json({ error: 'Failed to summarize URL. Please check the link or try another.' });
  }
});

app.listen(PORT, () => {
  console.log(`🎉 Gemini Summarizer Backend is Running at http://localhost:${PORT}`);
});
