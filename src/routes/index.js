const router = require('express').Router();

// Import the route modules
const simple_csrf = require('./simple_csrf_user');

router.use('/', simple_csrf)

/** 
 *  Export the API server and the route modules
*/
module.exports = router;