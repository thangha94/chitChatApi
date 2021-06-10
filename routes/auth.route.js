const express = require('express');
const {
  signup,
  signin,
  verifyToken,
} = require('../controllers/auth.controller');
const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/checkToken', verifyToken);
router.get('/', (req, res, next) => {
  res.cookie('room', '123213');
  res.send({ some: 'json' });
});

module.exports = router;
