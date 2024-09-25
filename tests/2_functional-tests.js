/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  // test('#example Test GET /api/books', function(done){
  //    chai.request(server)
  //     .get('/api/books')
  //     .end(function(err, res){
  //       assert.equal(res.status, 200);
  //       assert.isArray(res.body, 'response should be an array');
  //       assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
  //       assert.property(res.body[0], 'title', 'Books in array should contain title');
  //       assert.property(res.body[0], '_id', 'Books in array should contain _id');
  //       done();
  //     });
  // });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        const book = { title: "Colombo" };
        chai
        .request(server)
        .post('/api/books')
        .send(book)
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.isTrue(typeof res.body._id === 'string' && res.body._id.trim().length > 0);
          assert.equal(res.body.title,book.title);
          done();
        });
      });
      
      test('Test POST /api/books with no title given', function(done) {
        const book = {};
        chai
        .request(server)
        .post('/api/books')
        .send(book)
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text,'missing required field title');
          done();
        });
      });
      
    });

    async function addBook(book){
       const res  = await chai
        .request(server)
        .post('/api/books')
        .send(book);
        assert.equal(res.status, 200);
        assert.isTrue(typeof res.body._id === 'string' && res.body._id.trim().length > 0);
        return res.body
    }

    async function getBookById(id){
      const res = await chai.request(server)
      .get(`/api/books/${id}`);
       assert.equal(res.status, 200);
       return res;
    }

    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  async function(){
        const book = { title: "Colombo" };
        await addBook(book);
        const res = await chai.request(server)
       .get('/api/books');
         assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
      });      
      
    });

    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  async function(){
        const book = { title: "Colombo" };
        const bookRes = await addBook(book);
        const res = await chai.request(server)
       .get(`/api/books/${bookRes._id + 'xxx'}`);
        assert.equal(res.status, 200);
        assert.equal(res.text,'no book exists');
      });
      
      test('Test GET /api/books/[id] with valid id in db',async function(){
        const book = { title: "Colombo" };
        const bookRes = await addBook(book);
        const res = await chai.request(server)
       .get(`/api/books/${bookRes._id}`);
        assert.equal(res.status, 200);
        assert.property(res.body, 'comments', 'Book  should contain comments');
        assert.property(res.body, 'title', 'Book should contain title');
        assert.property(res.body, '_id', 'Book should contain _id');
        assert.isArray(res.body.comments, 'response should be an array');
      });
      
    });





    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', async function(){
        const book = { title: "Colombo" };
        const bookRes = await addBook(book);
        const comment = {comment:'game'};
        const res = await chai.request(server)
       .post(`/api/books/${bookRes._id}`).send(comment);
        assert.equal(res.status, 200);
        assert.property(res.body, 'comments', 'Book  should contain comments');
        assert.property(res.body, 'title', 'Book should contain title');
        assert.property(res.body, '_id', 'Book should contain _id');
        assert.isArray(res.body.comments, 'response should be an array');
        assert.equal(res.body.comments.length, 1);
        assert.equal(res.body.comments[0],comment.comment);
      });

      test('Test POST /api/books/[id] without comment field', async function(){
        const book = { title: "Colombo" };
        const bookRes = await addBook(book);
        const comment = {};
        const res = await chai.request(server)
       .post(`/api/books/${bookRes._id}`).send(comment);
        assert.equal(res.status, 200);
        assert.equal(res.text,'missing required field comment');
      });

      test('Test POST /api/books/[id] with comment, id not in db', async function(){
        const book = { title: "Colombo" };
        const bookRes = await addBook(book);
        const comment = {comment:'game'};
        const res = await chai.request(server)
       .post(`/api/books/${bookRes._id + 'xxx'}`).send(comment);
        assert.equal(res.status, 200);
        assert.equal(res.text,'no book exists');
      });
      
    });

    suite('DELETE /api/books/[id] => delete book object id', function() {

      test('Test DELETE /api/books/[id] with valid id in db', async function(){
        const book = { title: "Colombo" };
        const bookRes = await addBook(book);
        const res = await chai
        .request(server)
        .delete(`/api/books/${bookRes._id}`)
        .send({});
        assert.equal(res.status, 200);
        assert.equal(res.text,'delete successful');
        const deleteBook = await getBookById(bookRes._id);
        assert.equal(deleteBook.text,'no book exists');
      });

      test('Test DELETE /api/books/[id] with  id not in db', async function(){
        const book = { title: "Colombo" };
        const bookRes = await addBook(book);
        const res = await chai
        .request(server)
        .delete(`/api/books/${bookRes._id + 'xxx'}`)
        .send({});
        assert.equal(res.status, 200);
        assert.equal(res.text,'no book exists');
      });

    });
  });
  
});
