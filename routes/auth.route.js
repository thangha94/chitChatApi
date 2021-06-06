const express = require('express');
const router = express.Router();

router.post('/', (req, res, next) => {
  console.log('1', req.query, req.body);
  res.send('data');
});
router.get('/', (req, res, next) => {
  res.cookie('room', '123213');
  res.send({ some: 'json' });
});

module.exports = router;
