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

//function to handle error creation and logging
function errorHandler(status, message) {
  //Create a new the error class object
  const err = new Error()
  err.message = message;
  err.status = status;

  //log out the error code, and stack to the console, including message
  console.log('Error status code: ' + err.status);
  console.log(err.stack);

  return err;
}

/* GET home page.
** redirect to /books route
*/
router.get('/', asyncHandler(async (req, res) => {
  // const books = await Book.findAll();
  // res.json(books);
  // console.log('books: ' + books);
  res.redirect('/books'); //redirect to /books route
}));

/* GET books page.
** Shows full list of books
*/
router.get('/books', asyncHandler(async (req, res) => {
  const books = await Book.findAll();
  res.render("index", { books, title: "Books" });
}));

/* GET books/new page.
** Shows the create new book form
*/
router.get('/books/new', (req, res) => {
  res.render("new-book", { book: {}, title: "New Book" });
});

/* POST books/new
** route responsible for adding a new book
*/
router.post('/books/new', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.create(req.body); //create a new article using req.body object
    res.redirect("/books");
  } catch (error) {
    if(error.name == 'SequelizeValidationError') { // checking the error
      book = await Book.build(req.body); //return a non-persistent (unsaved) model instance
      res.render("books/new", { book, errors: error.errors, title: "Add A Book" })
    } else { //throw other types of errors, handled by catch block in asyncHandler function
      throw error //error cuaght in asyncHandler's catch block
    }
  }
}));

/* GET books/:id
** show book detail form
*/
router.get('/books/:id', asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id); //use Sequelize's findByPk to locate the id
  if(book) {
    res.render("book-detail", { book, title: book.title });
  } else {
    res.sendStatus(404);
  }
}));

/* POST books/:id
** update book info in the database
*/
router.post('/books/:id', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.findByPk(req.params.id);
    if(book) {
      await book.update(req.body); //update/change the book
      //res.redirect("/books/" + book.id);
      res.render("update-book", { book, title: "Update Book" })
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    if(error.name === "SequelizeValidationError") { //checking the error
      book = await Book.build(req.body);
      book.id = req.params.id; //make sure correct book gets updated
      res.render("update-book", { book, errors: error.errors, title: "Update Book" })
    } else {
      throw error;
    }
  }
}));

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
