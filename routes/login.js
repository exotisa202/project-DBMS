const path = require('path');

const express = require('express');

const rootDir = require('../util/path');

const router = express.Router();

const products = [];

// /admin/add-product => GET
router.get('/login', (req, res, next) => {
  res.sendFile(path.join(rootDir, 'views', 'login.html'));
});
router.post('/login', (req, res, next) => {
  res.sendFile(path.join(rootDir, 'views', 'home.html'));
  res.redirect('/home');
});
module.exports = router;