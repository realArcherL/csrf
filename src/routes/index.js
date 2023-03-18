const router = require('express').Router();

// Import the route modules
const login = require("./user");

router.use('/', login)

/** 
 *  Export the API server and the route modules
*/
module.exports = router;