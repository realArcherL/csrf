const router = require('express').Router();

// Import the route modules
const home = require('./home')
const simple_csrf = require('./simple_csrf_user');
const lax_defense = require('./cookie_lax_csrf');

router.use('/', home);
router.use('/', simple_csrf);
router.use('/defense1/', lax_defense);

/** 
 *  Export the API server and the route modules
*/
module.exports = router;