const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// --- Database Schema (Directly inside server.js) ---
const DocumentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  department: { type: String, required: true },
  category: { type: String, required: true },
  fileData: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['Pending', 'Verified', 'Archived'], 
    default: 'Pending' 
  },
  uploadedAt: { type: Date, default: Date.now }
});

const Document = mongoose.model('Document', DocumentSchema);

// --- MongoDB Compass Connection ---
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/gov_doc_system';

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB Connected successfully!'))
  .catch((err) => console.log('DB Connection Error:', err));

// --- API Routes ---
// 1. Document Save
app.post('/api/documents', async (req, res) => {
  try {
    const { title, department, category, fileData } = req.body;
    const newDoc = new Document({ title, department, category, fileData });
    await newDoc.save();
    res.status(201).json({ message: 'Document saved successfully!', newDoc });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Document Search & Get
app.get('/api/documents', async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    if (search) {
      query = {
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { department: { $regex: search, $options: 'i' } }
        ]
      };
    }
    const docs = await Document.find(query).sort({ uploadedAt: -1 });
    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Status Update
app.patch('/api/documents/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await Document.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));