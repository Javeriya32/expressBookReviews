const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

/* ---------------- TASK 6 ---------------- */
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({ message: "Username or password missing" });

  if (isValid(username))
    return res.status(409).json({ message: "User already exists" });

  users.push({ username, password });
  return res.status(200).json({ message: "User successfully registered" });
});

/* ---------------- TASK 1 ---------------- */
public_users.get('/', (req, res) => {
  res.status(200).json(JSON.stringify(books, null, 2));
});

/* ---------------- TASK 2 ---------------- */
public_users.get('/isbn/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  res.status(200).json(books[isbn]);
});

/* ---------------- TASK 3 ---------------- */
public_users.get('/author/:author', (req, res) => {
  const author = req.params.author.toLowerCase();
  let result = [];

  Object.keys(books).forEach(key => {
    if (books[key].author.toLowerCase() === author) {
      result.push(books[key]);
    }
  });

  res.status(200).json(result);
});

/* ---------------- TASK 4 ---------------- */
public_users.get('/title/:title', (req, res) => {
  const title = req.params.title.toLowerCase();
  let result = [];

  Object.keys(books).forEach(key => {
    if (books[key].title.toLowerCase().includes(title)) {
      result.push(books[key]);
    }
  });

  res.status(200).json(result);
});

/* ---------------- TASK 5 ---------------- */
public_users.get('/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  res.status(200).json(books[isbn].reviews);
});

/* =====================================================
   PART E — ASYNC / AWAIT + AXIOS IMPLEMENTATION
   ===================================================== */

/* -------- TASK 10: Get all books (Async) -------- */
public_users.get('/async/books', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:5000/');
    res.status(200).json(response.data);
  } catch (err) {
    res.status(500).json({ message: "Error fetching books" });
  }
});

/* -------- TASK 11: Get book by ISBN (Promise) -------- */
public_users.get('/async/isbn/:isbn', (req, res) => {
  axios
    .get(`http://localhost:5000/isbn/${req.params.isbn}`)
    .then(response => res.status(200).json(response.data))
    .catch(() => res.status(500).json({ message: "Error fetching ISBN" }));
});

/* -------- TASK 12: Get books by Author (Async) -------- */
public_users.get('/async/author/:author', async (req, res) => {
  try {
    const response = await axios.get(
      `http://localhost:5000/author/${req.params.author}`
    );
    res.status(200).json(response.data);
  } catch {
    res.status(500).json({ message: "Error fetching author" });
  }
});

/* -------- TASK 13: Get books by Title (Promise) -------- */
public_users.get('/async/title/:title', (req, res) => {
  axios
    .get(`http://localhost:5000/title/${req.params.title}`)
    .then(response => res.status(200).json(response.data))
    .catch(() => res.status(500).json({ message: "Error fetching title" }));
});

module.exports.general = public_users;
