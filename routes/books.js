const express = require('express');
const router = express.Router();
const Book = require('../models').Book; //import Book model from ../models folder
const { Op } = require('sequelize');

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

/* Handle error creation and logging */
function errorHandler(status, message) {
  //Create a new error class object
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
  res.redirect('/books/page/1'); //redirect to /books route
}));

/* GET books/new page.
** Shows the create new book form
*/
router.get('/new', (req, res) => {
  res.render("new-book", { book: {}, title: "Add a New Book" });
});

/* POST books/new
** route responsible for creating/adding a new book
*/
router.post('/new', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.create(req.body); //create a new article using req.body object
    res.redirect("/");
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

/*************************** PAGINATION & SEARCH ******************************/

/* POST books/search
** search using book criteria
** https://sequelize.org/master/manual/model-querying-basics.html
*/
router.post("/search", asyncHandler(async (req, res, next) => {
  let searchQuery; // declare variable to hold search query value
  if(req.body["searchbar"] === '') {
    searchQuery = null; //if there is no query, set to null
  } else {
    searchQuery = req.body["searchbar"]; //if there was a query, set to retrieve the body value of the searchbar
  }
  console.log(searchQuery);


  try {
    const books = await Book.findAll({
      where: {
        [Op.or]: [
          //using Op.substring (example: %hat%), use searchQuery to query the db for whole or partial matches
          {title:  {[Op.substring]: searchQuery}},
          {author: {[Op.substring]: searchQuery}},
          {genre: {[Op.substring]: searchQuery}},
          {year: {[Op.substring]: searchQuery}},
        ]
      },
      //Sort list by title in ascending order/alphabetically
       order: [['title', 'ASC']]
    });
      res.render("index", { books, title: "Library Search Results", canReset: true, mode: "search", searchQuery});
  } catch (error) {
    console.log(error);
    if(error.name === 'SequelizeValidationError') { // checking the error
      book = await Book.build(req.body); //return a non-persistent (unsaved) model instance
      res.render("index", { book, errors: error.errors, title: "Library Manager" }) //pass in error message
    } else { //throw other types of errors, handled by catch block in asyncHandler function
      throw error //error caught in asyncHandler's catch block
    }
  }
}));

/* GET books/page
** Pagination buttons for main book list
*/
router.get('/page/:page', asyncHandler(async (req, res, next) => {
  const page = parseInt(req.params.page); //convert to int
  const maxBooks = 10;

  const books = await Book.findAll({
    limit: maxBooks,
    offset: (maxBooks * (page - 1)), //determine current page
    order: [['title', 'ASC']] //sort in ascending order, by title
  });

  const pages = await Book.findAll();
  let pagesTotal = Math.ceil(pages.length / maxBooks);
  const nextPage = page + 1;
  const prevPage = page - 1;

  if(page > 0 && page < (pagesTotal + 1) ) { //make sure the page exists before rendering
    res.render("index", { books, title: "Library Manager", page, pagesTotal, prevPage, nextPage});
  } else {
    //send 404 error if the page doesn't exist
    const err = errorHandler(404, "Oops! The page you requested doesn't appear to exist...");
    next(err);
  }
}));

/******************************************************************************/

/* GET books/:id
** show book detail form
*/
router.get('/:id', asyncHandler(async (req, res, next) => {
  const book = await Book.findByPk(req.params.id); //use Sequelize's findByPk to locate the id
  if(book) {
    res.render("update-book", { book, title: book.title });
  } else {
    //send a 404 error if the route doesn't exist
    const err = errorHandler(404, "Oops! The page you requested doesn't appear to exist...");
    next(err);
  }
}));

/* POST books/:id
** update book info in the database
*/
router.post('/:id', asyncHandler(async (req, res, next) => {
  let book;
  try {
    book = await Book.findByPk(req.params.id);
    if(book) {
      await book.update(req.body); //update/change the book
      //res.redirect("/books/" + book.id);
      res.redirect("/") //redirect to main page
    } else {
      //send a 404 error if the route doesn't exist
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
** deletes selected book
** Note: deleting can't be undone.
*/
router.post('/:id/delete', asyncHandler(async (req, res, next) => {
  const book = await Book.findByPk(req.params.id);
  if(book) {
    await book.destroy(); //destroy/delete the book
    res.redirect("/"); //redirect to books path
  } else {
    //send a 404 error if the route doesn't exist
    const err = errorHandler(404, "Oops! The page you requested doesn't appear to exist...");
    next(err);
  }
}));

module.exports = router;
