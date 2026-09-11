// Update Document Route
app.put('/api/documents/:id', async (req, res) => {
  try {
    const { title, department, category, fileData } = req.body;
    const updatedDoc = await Document.findByIdAndUpdate(
      req.params.id,
      { title, department, category, fileData },
      { new: true }
    );

    if (!updatedDoc) {
      return res.status(404).json({ error: 'Document not found' });
    }

    res.json({ message: 'Document updated successfully!', updatedDoc });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});