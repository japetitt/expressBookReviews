
const axios = require('axios');
const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


const doesExist = (username) => {

    let userswithsamename = users.filter((user) => {

        return user.username === username;
    });

    if (userswithsamename.length > 0) {

        return true;
    } else {

        return false;
    }

}


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {


    if(!doesExist(username)) {


        users.push({'username': username, 'password': password});
        return res.status(200).json({message: "User successfully registered :)!"});
    } else {

        return res.status(404).json({message: 'User already exists!'});
    }

  }

  return res.status(404).json({message: "Registration Failed :("});
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
    try {
      const fetchBooks = async () => {
        if (books) {
          return books;
        } else {
          throw new Error("Books not found");
        }
      };
  
      const bookList = await fetchBooks();
      res.status(200).json(bookList);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });


// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;
  
    try {
      if (!isbn) {
        return res.status(400).json({ message: "Bad Request Home dawg" });
      }
  
      // Simulate an async fetch for book details
      const fetchBook = async (isbn) => {
        return books[isbn] || null; // Return the book if it exists, otherwise null
      };
  
      const book = await fetchBook(isbn);
  
      if (book) {
        return res.send(JSON.stringify(book, null, 4));
      } else {
        return res.status(404).json({ message: `Book with ISBN ${isbn} does not exist in our database` });
      }
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  });
  
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
   
    const author = req.params.author;

    if(author) {
      const booksByAuthor = Object.values(books).filter(book => book.author.toLowerCase() === author.toLowerCase());
      
      if(booksByAuthor.length > 0) {
         
        return res.json({message: "Here are the books by "+ author + " ", books: booksByAuthor});
          
      } else {
  
          return res.status(404).send({ message: "No book by the author " + author + " exists in our db"});
  
      }
  
    } 
    
    return res.status(404).json({message: "Bad Request Home dawg"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;

    if(title) {
      const bookByTitle = Object.values(books).filter(book => book.title.toLowerCase() === title.toLowerCase());
      
      if(bookByTitle.length > 0) {
         
        return res.json({message: "Here is the book titled "+ title + " ", book: bookByTitle});
          
      } else {
  
          return res.status(404).send({ message: "No book entitled " + title + " exists in our db"});
  
      }
  
    } 
    
    return res.status(404).json({message: "Bad Request Home dawg"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;

    if(isbn) {
      const bookReviews = books[isbn].reviews;
      if(bookReviews) {
          return res.json({reviews: bookReviews});
          
      } else {
  
          return res.status(404).send({ message: "Book of ISBN " + isbn + " does not exist in our db"});
  
      }
  
    } 
    
    return res.status(404).json({message: "Bad Request Home dawg"});
});

module.exports.general = public_users;
