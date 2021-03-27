# SQL Library Manager
A project using SQL to manage a collection of library books

## Technologies & Libraries Used:
- Node.js
- Express
- Sequelize
- SQLite

## Dev Notes:
- Built using Sequelize, this web app allows users to create, retrieve, update, and delete (CRUD) data in a SQLite database.
- Routes:
  - '/' (redirects to '/books/page/1')
  - '/books' - get (project using pagination; redirects to '/books/page/1')
  - '/books/new' - get (renders new-book.pug for user to input new book info)
  - '/books/new' - post (adds (Creates) new book in the library)
  - '/books/:id' - get (renders update-book.pug for user to update the book info or delete)
  - '/books/:id' - post (updates the book in the library)
  - '/books/:id/delete' - post (deletes selected book from library)

## Features:
- User may create, read, update, or delete books in the database
- User may browse a database of books in a SQLite database
- If there are no results to display, the app will notify the user (see index.pug)
- Validation:
  - Users may only create or update books containing a title and author
  - Uses Sequelize Model validation
- Clicking an input's label brings focus to the corresponding input
- Errors:
  - Non-existent book routes use a global error handler to display a friendly 404 "page not found" error message
  - Other non-existent routes also use a global error handler to display a 404 "page not found" error message
  - Routing to '/error' renders a custom 500 server error message

## Extra Features:
- Pagination: To improve the user experience, users may browse the books in the database by clicking the appropriate pagination buttons
  - Users may click through pages using the arrow buttons that are disabled based on whether the current page is the first/last page of books
  - Available only on main book route (/books/page/:page)
- Search: Users may search the database using the included search bar which updates upon form submission:
  - Search works for all the following fields:
    - title
    - author
    - genre
    - year
  - When there are no search results to display, the app will notify the user (see index.pug)
  - Search is case insensitive
  - Search works for partial matches on strings

## Styling:
- Font: Roboto Mono
- Colors:
  - black
  - white
  - #f1c55f
  - #070707
  - gray
  - #E7E7E7

## Tracking Notes:
- Updated: 3/27/2021
