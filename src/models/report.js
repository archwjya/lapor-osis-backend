const mongoose = require('mongoose');

const AnswerSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: mongoose.Schema.Types.Mixed, required: true }
});

const ReportSchema = new mongoose.Schema({
  type: { type: String, required: true },
  answers: [AnswerSchema],
  status: { type: String, enum: ['open', 'assigned', 'resolved'], default: 'open' },
  assignedTo: { type: String }, // teacher/investigator username or id
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Report', ReportSchema);
