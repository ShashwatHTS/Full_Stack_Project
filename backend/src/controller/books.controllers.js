require('dotenv').config()
const books = require("../db/books.db")
const { createClient } = require('@supabase/supabase-js');

const { supabaseUrl, supabaseKey } = require('../db/books.db')

const supabase = createClient(supabaseUrl, supabaseKey)

exports.getData = async (req, res) => {
  const { data, error } = await supabase
    .from('todo')
    .select('*');

  if (error) {
    console.error(error);
    return;
  }
  // console.log(data);
  res.send(data)
}

exports.createBook = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('todo')
      .insert(
        req.body,
      )
      .select()
    // console.log(data);
    res.send(data)
  } catch (error) {
    console.error(error);
    res.status(500).send('Error posting data to Supabase');
  }
}

exports.getBookById = async (req, res, next) => {
  // find a book by id
  let data = await supabase.from('todo').select("*")
    .eq('id', req.params.id)
  if (!data) {
    return res.status(404).send("Book not found")
  }
  res.send(data)
}

// function generateRandomID() {
//   const randomNum = Math.random();
//   const randomString = randomNum.toString().substr(2, 4)
//   const result = parseInt(randomString, 10)
//   return result
// }

// exports.createBook = function (req, res, next) {
//   // create a book
//   let newBook = req.body
//   newBook.id = generateRandomID()
//   // newBook.name = req.body.name
//   books.push(newBook)
//   console.log(books)
//   res.send(newBook)
// }

exports.updateBook = async (req, res, next) => {
  // update a book
  // let result = books.find(book => book.id == req.params.id)
  // if (!result) return res.status(404).send("Book not found")
  // result.name = req.body.name
  // res.send(result)

  try {
    let data = await supabase.from('todo').select("*")
      .eq('id', req.params.id)
    // console.log("found data", data)
    if (!data) {
      return res.status(404).send("Book not found")
    }
    data = await supabase
      .from('todo')
      .update(req.body)
      .eq('id', req.params.id)
      .select()
    res.send(data)
  } catch (error) {
    console.error(error);
  }
}

exports.deleteBook = async (req, res, next) => {
  // delete a book
  try {
    let data = await supabase.from('todo').select("*")
      .eq('id', req.params.id)
    if (!data) {
      return res.status(404).send("Book not found")
    }
    const { error } = await supabase
      .from('todo')
      .delete()
      .eq('id', req.params.id)
    res.send("delete successfully")
    if (error) {
      console.log(error)
    }
  } catch (error) {
    console.error(error);
  }

}