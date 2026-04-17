const express = require('express');
const router = express.Router();
const { submitFeedback, getFeedback, deleteFeedback } = require('../controllers/feedbackController');
const { protect } = require('../middleware/auth');

router.route('/')
  .post(protect, submitFeedback)
  .get(protect, getFeedback);

router.route('/:id')
  .delete(protect, deleteFeedback);

module.exports = router;
