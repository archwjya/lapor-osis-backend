const mongoose = require('mongoose');


const EvidenceFileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  size: { type: Number },
  type: { type: String }
});

const ReportSchema = new mongoose.Schema({
  category: { type: String, required: true },
  status: { type: String, enum: ['waiting', 'on process', 'cancel', 'finished'], default: 'waiting' },
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String },
  urgency: { type: String, enum: ['tinggi', 'sedang', 'rendah'] },
  anonymous: { type: Boolean, default: false },
  hasInjuries: { type: String }, // for bullying
  bullyingType: { type: String },
  frequency: { type: String },
  witnesses: { type: String },
  previousReports: { type: String },
  evidenceFiles: [EvidenceFileSchema],
  hasEvidence: { type: Boolean }, // for facility
  name: { type: String },
  class: { type: String },
  contact: { type: String },
  trackingCode: { type: String, unique: true },
  assignedTo: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Report', ReportSchema);
