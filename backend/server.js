const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// --- 1. User Schema ---
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});
const User = mongoose.model('User', UserSchema);

// --- 2. Document Schema (With userId Link) ---
const DocumentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
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

// --- Database Connection ---
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/gov_doc_system';
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB Connected successfully!'))
  .catch((err) => console.log('DB Connection Error:', err));

// --- Auth Routes ---
// Signup
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'Registered successfully!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid Email or Password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid Email or Password' });

    const token = jwt.sign({ id: user._id, name: user.name }, 'SECRET_KEY_123', { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Document Routes (Filtered by Logged-in User) ---
// Save Document
app.post('/api/documents', async (req, res) => {
  try {
    const { userId, title, department, category, fileData } = req.body;
    if (!userId) return res.status(400).json({ error: 'User ID is required' });

    const newDoc = new Document({ userId, title, department, category, fileData });
    await newDoc.save();
    res.status(201).json({ message: 'Document saved successfully!', newDoc });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Only User's Documents
app.get('/api/documents', async (req, res) => {
  try {
    const { userId, search } = req.query;
    if (!userId) return res.status(400).json({ error: 'User ID missing' });

    let query = { userId };
    if (search) {
      query.$and = [
        { userId },
        {
          $or: [
            { title: { $regex: search, $options: 'i' } },
            { department: { $regex: search, $options: 'i' } }
          ]
        }
      ];
    }

    const docs = await Document.find(query).sort({ uploadedAt: -1 });
    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Status
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