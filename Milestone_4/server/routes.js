const mysql = require('mysql')
const config = require('./config.json')

// Creates MySQL connection using database credential provided in config.json
// Do not edit. If the connection fails, make sure to check that config.json is filled out correctly
const connection = mysql.createConnection({
  host: config.rds_host,
  user: config.rds_user,
  password: config.rds_password,
  port: config.rds_port,
  database: config.rds_db
});
connection.connect((err) => err && console.log(err));

/*****************************
 * ROUTES BY PAGES -- Books *
 *****************************/

// Route 1: GET /genre/:genre_name
const genre = async function(req, res) {
  // TODO (TASK 1): replace the values of name and pennKey with your own
  const genre = req.param.genre_name;
  const pg = req.query.page ;
  const pageSize = req.query.page_size ?? 10;
  const offset = (pg - 1)*pageSize;

  // TODO: change ORDER BY to be a dynamic attribute
  // const clicked_attr = re.query.attr
  // How do we persist the genre name to stay on the same page but reorder on a different attribute?


  // checks the value of type the request parameters
  
  connection.query(`
    SELECT g.genre_name, b.image_url, b.Title, b.book_id, b.average_rating
    FROM Genres g
      INNER JOIN Book_Genres bg on g.genre_id = bg.genre_id
      INNER JOIN Books b ON bg.book_id = b.book_id
    WHERE g.genre_name = ${genre}
    ORDER BY b.average_rating 
    LIMIT ${pageSize} OFFSET ${offset}

  `, (err, data) => {
    if (err || data.length === 0) {
      // if there is an error for some reason, or if the query is empty (this should not be possible)
      // print the error message and return an empty object instead
      console.log(err);
      res.json({});
    } else {
      // Here, we return results of the query as an object, keeping only relevant data
      // being song_id and title which you will add. In this case, there is only one song
      // so we just directly access the first element of the query results array (data)
      // TODO (TASK 3): also return the song title in the response
      res.json(data);
    }
  });
}

/*****************************
 * ROUTES BY PAGES -- Books *
 *****************************/

// Route 2: GET /book/:book_id
const book = async function(req, res) {
  // Get book information for the book that was clicked
  const curr_id = req.params.book_id

  // Return the book information for the clicked book
  connection.query(`
  SELECT *
  FROM Books  
  WHERE book_id = ${curr_id}
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json({
        book_title: data[0].title,
        book_isbn: data[0].isbn,
        book_language_code: data[0].language_code,
        is_ebook: data[0].is_ebook,
        average_rating: data[0].average_rating,
        description: data[0].description,
        format: data[0].format,
        publisher: data[0].publisher,
        num_pages: data[0].num_pages,
        publication_year: data[0].publication_year
      });
    }
  });
}


// Route 3: GET /reviews/:book_id
const reviews = async function(req, res) {
  // Get book information for the book that was clicked
  const curr_id = req.params.book_id
  const pg = req.query.page ;
  const pageSize = req.query.page_size ?? 10;
  const offset = (pg - 1)*pageSize;

  // Return the reviews for the clicked book

  if (!pg) {
    connection.query(`
    SELECT r.*
    FROM Reviews r 
    WHERE r.book_id = ${curr_id}
    ORDER BY r.n_votes
    `, (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        res.json(data);
      }
    });
  } else {
    connection.query(`
      SELECT r.*
      FROM Reviews r 
      WHERE r.book_id = ${curr_id}
      ORDER BY r.n_votes
      LIMIT ${pageSize} OFFSET ${offset} 
      `, (err, data) => {
        if (err || data.length === 0) {
          console.log(err);
          res.json({});
        } else {
          res.json(data);
        }
    });
  }
}
// Route 4: GET /rating_history/:book_id
const rating_history = async function(req, res) {
  // Get book information for the book that was clicked
  const curr_id = req.params.book_id

  // Return the average rating and rating count for each year
  // in which a book has been rated
  connection.query(`
  SELECT r.year, AVG(r.rating), COUNT(*)
  FROM Books JOIN Reviews r ON r.book_id = ${curr_id}
  GROUP BY r.year
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}

// Route 5: GET /book_series/:book_id
const book_series = async function(req, res) {
  // Get book information for the book that was clicked
  const curr_id = req.params.book_id

  // Return the average rating and rating count for each year
  // in which a book has been rated
  connection.query(`
  SELECT bk.book_id, bk.title, bk.image_url, bs.*
  FROM Books b
    JOIN Book_Series bs ON b.series = bs.series_id
    JOIN Books bk ON bs.book_id = bk.book_id
  WHERE b.book_id = ${curr_id}
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}

// Route 6: GET /book_author_series/:book_id
const book_author_series = async function(req, res) {
  // Gets book information (author name, role, book series title) for the book that was clicked 
  const curr_id = req.params.book_id

  // Return the author name, role, book series title
  // of the book in question.
  connection.query(`
  SELECT a.name, a.role, bs.title
  FROM Books b
    INNER JOIN Written_By w ON w.book_id = b.book_id
    INNER JOIN Authors a ON w.author_id = a.author_id
    INNER JOIN Book_Series bs ON b.series_id = bs.series_id
  WHERE b.book_id = '${curr_id}'
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}

// Route 7: GET /book_genres/:book_id
const book_genres = async function(req, res) {
  // Get book information (genre name)for the book that was clicked
  const curr_id = req.params.book_id

  // Return the genre name
  // of the book in question.
  connection.query(`
  SELECT g.genre_name 
  FROM Books b
    INNER JOIN Book_Genres bg ON bg.book_id = b.book_id
    INNER JOIN Genres g ON g.genre_id = bg.genre_id
  WHERE b.book_id = '${curr_id}'
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}

// Route 8: Get /similar_books/:book_id
const similar_books = async function(req, res) {
  // Get similar book information based on the book in question
  const curr_id = req.params.book_id

  // Return the information of the similar books
  connection.query(`
    SELECT s.similar_book_id, b2.title, b2.image_url
    FROM Books b
      INNER JOIN Similar_Books s ON s.book_id = b.book_id
      INNER JOIN Books b2 ON s.similar_book_id = b2.book_id
    WHERE b.book_id = '${curr_id}'
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}


module.exports = {
  genre,
  book,
  reviews,
  rating_history,
  book_series,
  book_author_series,
  book_genres,
  similar_books
}
