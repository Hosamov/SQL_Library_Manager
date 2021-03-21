const express = require('express');
const router = express.Router();
const Book = require('../models').Book; //import Book model from ../models folder

/* Handler function to wrap each route. */
function asyncHandler(cb){
  return async(req, res, next) => {
    try {
      await cb(req, res, next)
    } catch(error){
      // Forward error to the global error handler
      next(error);
    }
  }
}

/* GET home page. */
router.get('/', asyncHandler(async (req, res) => {
  const books = await Book.findAll();
  res.json(books);
  console.log('books: ' + books);
}));

/* GET books page.
** Shows full list of books
*/
router.get('/books', asyncHandler(async (req, res) => {
  const books = await Book.findAll();
  res.render("index", { books, title: "Library Books" });
}));

/* GET books/new page.
** Shows the create new book form
*/
router.get('/books/new', async (req, res) => {

});

/* POST books/new
** post a new book to the database
*/
router.post('/books/new', async (req, res) => {

});

/* GET books/:id
** show book detail form
*/
router.get('/books/:id', async (req, res) => {

});

/* POST books/:id
** update book info in the database
*/
router.post('/books/:id', async (req, res) => {

});

/* POST books/:id/delete
** deletes a book
** Note: deleting can't be undone.
*/
router.post('/books/:id/delete', async (req, res) => {

});

//custom error handler for 500 Server error
router.get('/error', (req, res, next) => {
  const err = errorHandler(500, 'There appears to be a problem with the server.');
  next(err);
});



module.exports = router;
