require('dotenv').config();
const mongoose = require('mongoose');
const { startBot } = require('./services/baileysService');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    startBot();
    console.log('WhatsApp bot started');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });
