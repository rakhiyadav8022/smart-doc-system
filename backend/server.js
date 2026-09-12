const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/smart-doc-system';
mongoose
  .connect(MONGO_URI)
  .then(() => console.log('MongoDB Connected successfully!'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Document Schema & Model
const documentSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  department: {
    type: String,
    default: 'General'
  },
  category: {
    type: String,
    default: 'General'
  },
  fileData: {
    type: String,
    required: true
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

const Document = mongoose.model('Document', documentSchema);

// Root Health Check Route
app.get('/', (req, res) => {
  res.send('Smart Document System API is Running.');
});

// GET: Fetch documents for a specific user with search filter
app.get('/api/documents', async (req, res) => {
  try {
    const { userId, search } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const query = { userId };

    if (search && search.trim() !== '') {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { department: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }

    const docs = await Document.find(query).sort({ uploadedAt: -1 });
    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST: Save a new document
app.post('/api/documents', async (req, res) => {
  try {
    const { userId, title, department, category, fileData } = req.body;

    if (!userId || !title || !fileData) {
      return res.status(400).json({ error: 'userId, title, and fileData are required' });
    }

    const newDoc = new Document({
      userId,
      title,
      department,
      category,
      fileData
    });

    const savedDoc = await newDoc.save();
    res.status(201).json(savedDoc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE: Delete a document by ID
app.delete('/api/documents/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedDoc = await Document.findByIdAndDelete(id);

    if (!deletedDoc) {
      return res.status(404).json({ error: 'Document not found' });
    }

    res.json({ message: 'Document deleted successfully!', id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});