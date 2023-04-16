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
  const genre = req.param.genre_name;
  const pg = req.query.page;
  const pageSize = req.query.page_size ?? 80;
  const offset = (pg - 1)*pageSize;

  // TODO: change ORDER BY to be a dynamic attribute
  // const clicked_attr = re.query.attr
  // How do we persist the genre name to stay on the same page but reorder on a different attribute?


  // checks the value of type the request parameters
  if (!pg) {
      connection.query(`
      SELECT g.genre_name, b.image_url, b.title, b.book_id, b.average_rating
      FROM Genres g
        INNER JOIN Book_Genres bg on g.genre_id = bg.genre_id
        INNER JOIN Book b ON bg.book_id = b.book_id
      WHERE g.genre_name = '${genre}'
      ORDER BY b.average_rating 
    `, (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json([]);
      } else {
        res.json(data);
      }
    });
  } else {
      connection.query(`
      SELECT g.genre_name, b.image_url, b.title, b.book_id, b.average_rating
      FROM Genres g
        INNER JOIN Book_Genres bg on g.genre_id = bg.genre_id
        INNER JOIN Book b ON bg.book_id = b.book_id
      WHERE g.genre_name = '${genre}'
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
  SELECT book_id, title, isbn, language_code, is_ebook, average_rating,
         description, format, publisher, num_pages, publication_year
  FROM Book  
  WHERE book_id = ${curr_id}
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json({
        book_id: data[0].book_id,
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
  const pageSize = req.query.page_size ?? 25;
  const offset = (pg - 1)*pageSize;

  // Return the reviews for the clicked book

  if (!pg) {
    connection.query(`
    SELECT book_id, review_id, rating, review_text, 
           year_added, month_added, day_added, num_votes
    FROM Reviews r 
    WHERE r.book_id = ${curr_id}
    ORDER BY r.num_votes DESC, r.rating DESC
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
      ORDER BY r.num_votes DESC, r.rating DESC
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
  SELECT r.year_added, ROUND(AVG(r.rating), 2) AS average_rating, COUNT(*) AS review_count
  FROM Book b JOIN Reviews r ON r.book_id = b.book_id
  WHERE b.book_id = ${curr_id}
  GROUP BY r.year_added
  ORDER BY year_added;  
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

  // Return the other books in the book series
  // of the specified book 
  connection.query(`
  SELECT bk.book_id, bk.title AS book_title, bk.image_url, bs.*
  FROM Book b
    JOIN Book_Series bs ON b.series_id = bs.series_id
    JOIN Book bk ON bs.series_id = bk.series_id
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

  // Return the author name, book series title
  // of the book in question.
  connection.query(`
  SELECT a.name AS author, bs.title AS series_title
  FROM Book b
    INNER JOIN Written_By w ON w.book_id = b.book_id
    INNER JOIN Authors a ON w.author_id = a.author_id
    INNER JOIN Book_Series bs ON b.series_id = bs.series_id
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

// Route 7: GET /book_genres/:book_id
const book_genres = async function(req, res) {
  // Get book information (genre name)for the book that was clicked
  const curr_id = req.params.book_id

  // Return the genre name
  // of the book in question.
  connection.query(`
  SELECT g.genre_name
  FROM Book b
    INNER JOIN Book_Genres bg ON bg.book_id = b.book_id
    INNER JOIN Genres g ON g.genre_id = bg.genre_id
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

// Route 8: Get /similar_books/:book_id
const similar_books = async function(req, res) {
  // Get similar book information based on the book in question
  const curr_id = req.params.book_id

  // Return the information of the similar books
  connection.query(`
    SELECT s.similar_book_id, b2.title AS similar_title, b2.image_url AS similar_url
    FROM Book b
      INNER JOIN Similar_Books s ON s.book_id = b.book_id
      INNER JOIN Book b2 ON s.similar_book_id = b2.book_id
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

/*****************************
 * ROUTES BY PAGES -- HomePage *
 *****************************/

// Route 9: GET /top_ten_books_month
const top_ten_books_month = async function(req, res) {
  // Return the book ID, title, image URL, rating, and authors of 10 (random) out
  // of the top 100 books of the month based on average rating (weighted by review count).
   connection.query(`
  WITH 
  month_top_reviewed AS (

    SELECT r.book_id , ROUND(COUNT(*) * AVG(rating), 2) AS wt_avg
    FROM Reviews r
    WHERE r.month_added = MONTH(CURRENT_TIMESTAMP)
    GROUP BY r.book_id
    ORDER BY wt_avg DESC
    LIMIT 100

  ), 
  b_top_ten AS (

    SELECT tt.book_id, b.title, b.image_url, tt.wt_avg
    FROM month_top_reviewed tt
    JOIN (SELECT title, book_id, image_url
          FROM Book) b ON tt.book_id = b.book_id
    ORDER BY RAND()
    LIMIT 10

  )
  SELECT btt.*, 
         GROUP_CONCAT(DISTINCT A.name ORDER BY A.name DESC SEPARATOR ', ') AS authors
  FROM b_top_ten btt
    JOIN Written_By wb ON btt.book_id = wb.book_id
    JOIN (SELECT author_id, name FROM Authors) A ON A.author_id = wb.author_id
  GROUP BY btt.book_id
  ORDER BY btt.wt_avg DESC
  
   `, (err, data) => {
     if (err || data.length === 0) {
       console.log(err);
       res.json({});
     } else { 
       res.json(data);
     }
   });
 }
 
 // Route 10: GET /book_recs_rand_genre/:user_id
 const book_recs_rand_genre = async function(req, res) {
   // Find two random genres and the select the top 2 rated books within those genres and return these as recommended books for the the user
   const user_id = req.params.user_id;
   connection.query(`
   SELECT g.genre, b.title, b.image_url
   FROM Genres g
       NATURAL JOIN Book_Genres bg
     JOIN
       (SELECT bg.genre_id AS genre_id
         FROM Users_Liked u
         JOIN Book_Genres bg ON u.book_id = bg.book_id
         WHERE user_id = '${user_id}'
         ORDER BY RAND()
         LIMIT 1) g_user ON bg.genre_id = g_user.genre_id
       JOIN Book b ON bg.book_id = b.book_id
   ORDER BY b.average_rating
   LIMIT 2
   UNION 
   SELECT g.genre, b.title,b.image_url
   FROM Genres g
       NATURAL JOIN Book_Genres bg
     JOIN
       (SELECT bg.genre_id AS genre_id
         FROM Users_Liked u
         JOIN Book_Genres bg ON u.book_id = bg.book_id
         WHERE user_id = '${user_id}'
         ORDER BY RAND()
         LIMIT 1) g_user
           ON bg.genre_id = g_user.genre_id
       JOIN Book b ON bg.book_id = b.book_id
   ORDER BY b.average_rating
   LIMIT 2
   `, (err, data) => {
     if (err || data.length === 0) {
       console.log(err);
       res.json({});
     } else {
       res.json(data);
     }
   });
 }

 // 
 
 /*****************************
  * ROUTES BY PAGES -- Authors *
  *****************************/
 
 // Route 11: GET /author_details/:author_id
 const author_details = async function(req, res) {
   // Return author details for the selected author
   const author_id = req.params.author_id;

   connection.query(`
   SELECT * FROM Authors
   WHERE Authors.author_id = '${author_id}'
   `, (err, data) => {
     if (err || data.length === 0) {
       console.log(err);
       res.json({});
     } else {
       res.json(data);
     }
   });
 }
 
 // Route 12: GET /user_liked/:user_id
 const user_liked = async function(req, res) {
   const user_id = req.params.user_id;
   connection.query(`
   SELECT b.title
   FROM Users_Liked u
     JOIN Book b ON u.book_id = b.book_id
   WHERE u.user_id = '${user_id}'
   `, (err, data) => {
     if (err || data.length === 0) {
       console.log(err);
       res.json({});
     } else {
       res.json(data);
     }
   });
 }
 
 // Route 13: GET /authors_ordered/:attribute
 const authors_ordered = async function(req, res) {
   // Return author details for the selected author
   connection.query(`
   SELECT name FROM Authors
   ORDER BY '${attribute}'
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
   similar_books,
   top_ten_books_month,
   book_recs_rand_genre,
   author_details,
   user_liked,
   authors_ordered,
 }
 
 