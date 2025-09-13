const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const Report = require('../models/report');
const upload = require('../middleware/fileUpload');

// Upload evidence file
router.post('/upload/:id', upload.single('file'), async (req, res) => {
  try {
    const report = await Report.findOne({ $or: [{ _id: req.params.id }, { trackingCode: req.params.id }] });
    if (!report) return res.status(404).json({ error: 'Report not found' });
    const file = req.file;
    report.evidenceFiles.push({ name: file.filename, size: file.size, type: file.mimetype });
    await report.save();
    res.json({ message: 'File uploaded', file });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Serve evidence file
router.get('/:filename', async (req, res) => {
  try {
    const { key } = req.query;
    const report = await Report.findOne({ $or: [{ _id: key }, { trackingCode: key }] });
    if (!report) return res.status(404).json({ error: 'Report not found' });
    const file = report.evidenceFiles.find(f => f.name === req.params.filename);
    if (!file) return res.status(404).json({ error: 'File not found' });
    const filePath = path.join(__dirname, '../../uploads', req.params.filename);
    if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'File not found on server' });
    res.type(file.type).sendFile(path.resolve(filePath));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
