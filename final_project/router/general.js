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
public_users.get('/',function (req, res) {
  
  let booksJsonString = JSON.stringify(books, null, 4);

  res.send(booksJsonString)
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {

  const isbn = req.params.isbn;

  if(isbn) {
    const book = books[isbn];
    if(book) {
        return res.send(JSON.stringify(book, null,4));
        
    } else {

        return res.status(404).send({ message: "Book of ISBN " + isbn + " does not exist in our db"});

    }

  } 
  
  return res.status(404).json({message: "Bad Request Home dawg"});
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
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
