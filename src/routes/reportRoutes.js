const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const authenticate = require('../middleware/auth');

router.post('/', reportController.createReport);
router.get('/', reportController.getReports);
router.get('/questions', reportController.getQuestions);
router.get('/:id', reportController.getReport);
router.put('/:id', authenticate, reportController.updateReport);
router.delete('/:id', authenticate, reportController.deleteReport);
router.post('/:id/assign', authenticate, reportController.assignReport);
router.post('/:id/resolve', authenticate, reportController.resolveReport);

module.exports = router;
