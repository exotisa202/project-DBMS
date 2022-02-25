const router = require('express').Router();
router.get('/', (req,res)=>res.redirect('/login'));
// The historical implementation stored plaintext passwords. Do not write new ones.
router.post('/', (req,res)=>res.status(501).send('Registration is disabled pending secure authentication. Use the separate read-only demo.'));
module.exports = router;
