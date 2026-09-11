// --- Update Document ---
app.put('/api/documents/:id', async (req, res) => {
  try {
    const { title, department, category, fileData } = req.body;
    const updatedDoc = await Document.findByIdAndUpdate(
      req.params.id,
      { title, department, category, fileData },
      { new: true }
    );
    res.json({ message: 'Document updated successfully!', updatedDoc });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Delete Document ---
app.delete('/api/documents/:id', async (req, res) => {
  try {
    await Document.findByIdAndDelete(req.params.id);
    res.json({ message: 'Document deleted successfully!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});