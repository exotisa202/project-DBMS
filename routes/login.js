const router = require('express').Router();
const path = require('path');
router.get('/login', (req,res)=>res.sendFile(path.join(__dirname,'../views/login.html')));
router.post('/login', (req,res)=>res.status(501).send('Authentication is not implemented. Use the separate read-only demo; do not enter real credentials.'));
module.exports = router;
