const Report = require('../models/report');
const questionsConfig = require('../config/questions');

exports.createReport = async (req, res) => {
  try {
    const { type, answers } = req.body;
    const report = new Report({ type, answers });
    await report.save();
    res.status(201).json(report);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getReports = async (req, res) => {
  try {
    const { status, assignedTo, type } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (assignedTo) filter.assignedTo = assignedTo;
    if (type) filter.type = type;
    const reports = await Report.find(filter);
    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ error: 'Report not found' });
    res.json(report);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateReport = async (req, res) => {
  try {
    const report = await Report.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!report) return res.status(404).json({ error: 'Report not found' });
    res.json(report);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteReport = async (req, res) => {
  try {
    const report = await Report.findByIdAndDelete(req.params.id);
    if (!report) return res.status(404).json({ error: 'Report not found' });
    res.json({ message: 'Report deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.assignReport = async (req, res) => {
  try {
    const { assignedTo } = req.body;
    const report = await Report.findByIdAndUpdate(req.params.id, { assignedTo, status: 'assigned' }, { new: true });
    if (!report) return res.status(404).json({ error: 'Report not found' });
    res.json(report);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.resolveReport = async (req, res) => {
  try {
    const report = await Report.findByIdAndUpdate(req.params.id, { status: 'resolved' }, { new: true });
    if (!report) return res.status(404).json({ error: 'Report not found' });
    res.json(report);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getQuestions = (req, res) => {
  res.json(questionsConfig);
};
