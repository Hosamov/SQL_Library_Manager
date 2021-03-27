const express = require('express');
const router = express.Router();

/* GET home page.
** redirect to /books route
*/
router.get('/', async (req, res, next) => {
  res.redirect('/books'); //redirect to /books route
});

//custom error handler for 500 Server error
router.get('/error', (req, res, next) => { // '/error' route
  //send a 500 error
  const err = errorHandler(500, 'There appears to be a problem with the server.');
  next(err);
});

module.exports = router;
