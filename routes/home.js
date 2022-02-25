const path = require('path');

const express = require('express');

const rootDir = require('../util/path');
const oracledb = require('oracledb');
const router = express.Router();


// /admin/add-product => GET
router.get('/home', (req, res, next) => {
  res.sendFile(path.join(rootDir, 'views', 'home.html'));
});

router.post('/home', (req, res, next) => {
  res.sendFile(path.join(rootDir, 'views', 'homenew.html'));
});
module.exports = router;