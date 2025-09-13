const express = require('express');
const router = express.Router();
const { getQrCode } = require('../services/baileysService');

router.get('/', async (req, res) => {
  const qr = await getQrCode();
  if (!qr) return res.status(404).send('No QR code available');
  res.type('svg').send(qr);
});

module.exports = router;
