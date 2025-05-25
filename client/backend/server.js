// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors()); // Ensure CORS is enabled

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/studentDB/students', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("Connected to MongoDB");
}).catch((err) => {
  console.error("Error connecting to MongoDB", err);
});

// String Schema
const stringSchema = new mongoose.Schema({
  text: String,
});

const StringModel = mongoose.model('String', stringSchema);

// Route to handle form submission
app.post('/api/strings', async (req, res) => {
  const { text } = req.body;

  try {
    const newString = new StringModel({ text });
    await newString.save();
    console.log("String saved:", newString);
    res.status(201).json({ message: 'String saved successfully' });
  } catch (error) {
    console.error("Error saving string:", error);
    res.status(500).json({ message: 'Error saving string' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
