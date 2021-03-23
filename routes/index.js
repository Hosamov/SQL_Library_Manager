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
  res.render("new-book", { book: {}, title: "Add a New Book" });
});

/* POST books/new
** route responsible for creating/adding a new book
*/
router.post('/books/new', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.create(req.body); //create a new article using req.body object
    res.redirect("/books");
  } catch (error) {
    console.log(error);
    if(error.name === 'SequelizeValidationError') { // checking the error
      book = await Book.build(req.body); //return a non-persistent (unsaved) model instance
      res.render("new-book", { book, errors: error.errors, title: "Add a New Book" }) //pass in error message
    } else { //throw other types of errors, handled by catch block in asyncHandler function
      throw error //error caught in asyncHandler's catch block
    }
  }
}));

/* GET books/:id
** show book detail form
*/
router.get('/books/:id', asyncHandler(async (req, res, next) => {
  const book = await Book.findByPk(req.params.id); //use Sequelize's findByPk to locate the id
  if(book) {
    res.render("update-book", { book, title: book.title });
  } else {
    //res.sendStatus(404); //send a 404 error if the route doesn't exist
    const err = errorHandler(404, "Oops! The page you requested doesn't appear to exist...");
    next(err);
  }
}));

/* POST books/:id
** update book info in the database
*/
router.post('/books/:id', asyncHandler(async (req, res, next) => {
  let book;
  try {
    book = await Book.findByPk(req.params.id);
    if(book) {
      await book.update(req.body); //update/change the book
      //res.redirect("/books/" + book.id);
      res.redirect("/books") //redirect to main page
    } else {
      //res.sendStatus(404);
      const err = errorHandler(404, "Oops! The page you requested doesn't appear to exist...");
      next(err);
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
router.post('/books/:id/delete', asyncHandler(async (req, res, next) => {
  const book = await Book.findByPk(req.params.id);
  if(book) {
    await book.destroy(); //destroy/delete the book
    res.redirect("/books"); //redirect to books path
  } else {
    //res.sendStatus(404);
    const err = errorHandler(404, "Oops! The page you requested doesn't appear to exist...");
    next(err);
  }
}));

//custom error handler for 500 Server error
router.get('/error', (req, res, next) => {
  const err = errorHandler(500, 'There appears to be a problem with the server.');
  next(err);
});

module.exports = router;
