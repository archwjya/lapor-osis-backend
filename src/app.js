require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');

const reportRoutes = require('./routes/reportRoutes');
const whatsappRoutes = require('./routes/whatsappRoutes');
const { requestLogger, errorLogger } = require('./middleware/logger');

const app = express();
app.use(express.json());
app.use(morgan('dev'));
app.use(requestLogger);

app.use('/reports', reportRoutes);
app.use('/whatsapp', whatsappRoutes);

app.use(errorLogger);

const PORT = process.env.PORT || 3000;
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });
