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

// --- Schemas & Models ---

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

// Document Schema
const documentSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  department: { type: String, default: 'General' },
  category: { type: String, default: 'General' },
  fileData: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now }
});

const Document = mongoose.model('Document', documentSchema);

// --- Auth Routes ---

// Register Route
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    const newUser = new User({ name, email, password });
    await newUser.save();

    res.status(201).json({
      message: 'User registered successfully!',
      user: { id: newUser._id, name: newUser.name, email: newUser.email }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login Route
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(400).json({ error: 'Invalid email or master password' });
    }

    res.json({
      message: 'Login successful',
      token: 'jwt_mock_token_session',
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Document Routes ---

// Health Check
app.get('/', (req, res) => {
  res.send('Smart Document System API is Running.');
});

// GET Documents
app.get('/api/documents', async (req, res) => {
  try {
    const { userId, search } = req.query;
    if (!userId) return res.status(400).json({ error: 'userId is required' });

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

// POST Document
app.post('/api/documents', async (req, res) => {
  try {
    const { userId, title, department, category, fileData } = req.body;
    if (!userId || !title || !fileData) {
      return res.status(400).json({ error: 'Required fields missing' });
    }

    const newDoc = new Document({ userId, title, department, category, fileData });
    const savedDoc = await newDoc.save();
    res.status(201).json(savedDoc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE Document
app.delete('/api/documents/:id', async (req, res) => {
  try {
    const deletedDoc = await Document.findByIdAndDelete(req.params.id);
    if (!deletedDoc) return res.status(404).json({ error: 'Document not found' });
    res.json({ message: 'Document deleted successfully!', id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});