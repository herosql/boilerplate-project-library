/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';
function generateUUID() {
  let d = new Date().getTime();
  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = (d + Math.random()*16)%16 | 0;
    d = Math.floor(d/16);
    return (c === 'x'? r : (r&0x3|0x8)).toString(16);
  });
  return uuid.replace(/-/g, '');
}
module.exports = function (app) {
  let books = new Map();

  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      res.json(Array.from(books.values()));
    })
    
    .post(function (req, res){
      //response will contain new book object including atleast _id and title
      const title = req.body.title;
      if(title){
        let book = {_id:generateUUID(),title:title};
        book.comments = [];
        book.commentcount = book.comments.length;
        books.set(book._id,book);
        res.json(book);
      }else{
        res.send('missing required field title');
      }
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
      books.clear();
      res.send('complete delete successful');
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      const book = books.get(bookid);
      if(!book){
        res.send('no book exists');
      }
      res.json(book);


    })
    
    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      if(!comment){
        res.send('missing required field comment');
      }
      const book = books.get(bookid);
      if(!book){
        res.send('no book exists');
      }
      book.comments.push(comment);
      book.commentcount = book.comments.length;
      //json res format same as .get
      res.json(book);
    })
    
    .delete(function(req, res){
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
      const book = books.get(bookid);
      if(!book){
        res.send('no book exists');
      }
      books.delete(bookid);
      res.send('delete successful');
    });
  
};
