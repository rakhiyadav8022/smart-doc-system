const mongoose = require('mongoose');

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

module.exports = mongoose.model('Document', DocumentSchema);