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
  const genre = req.params.genre_name;
  
  console.log('The passed genre is:');
  console.log(genre);
  const pg = req.query.page;
  const pageSize = req.query.page_size ?? 10;
  const offset = (pg - 1)*pageSize;

  // TODO: change ORDER BY to be a dynamic attribute
  // const clicked_attr = re.query.attr
  // How do we persist the genre name to stay on the same page but reorder on a different attribute?

  if (!pg) {
    connection.query( `   
    SELECT g.genre_name, b.image_url, b.title, b.book_id, b.average_rating, b.publication_year
    FROM Genres g
      INNER JOIN Book_Genres bg on g.genre_id = bg.genre_id
      INNER JOIN (SELECT book_id, image_url, title, average_rating, ratings_count, publication_year
                      FROM Book) b ON bg.book_id = b.book_id
    WHERE g.genre_name = '${genre}'
    ORDER BY average_rating * ratings_count DESC
    LIMIT 50;
    `
    , (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json([]);
        console.log('Failed to retrieve genre');
      } else {
        res.json(data);
        console.log('Successfully got books in genre');
      }
    });
  } else {
    connection.query(`  
    SELECT g.genre_name, b.image_url, b.title, b.book_id, b.average_rating, b.publication_year
    FROM Genres g
      INNER JOIN Book_Genres bg on g.genre_id = bg.genre_id
      INNER JOIN (SELECT book_id, image_url, title, average_rating, ratings_count, publication_year
                      FROM Book) b ON bg.book_id = b.book_id
    WHERE g.genre_name = '${genre}'
    ORDER BY average_rating * ratings_count DESC
    LIMIT ${pageSize} OFFSET ${offset}
      `, (err, data) => {
        if (err || data.length === 0) {
          console.log(err);
          res.json([]);
        } else {
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
  console.log('The book ID passed to /book/:book_id is:');
  console.log(curr_id);
  console.log('-------------');

  // Return the book information for the clicked book
  connection.query(`
  SELECT b.book_id, title, image_url, isbn, language_code, is_ebook, b.average_rating,
          description, format, publisher, num_pages, publication_year, series_id, a.*
  FROM (SELECT book_id, title, image_url, isbn, language_code, is_ebook, average_rating,
        description, format, publisher, num_pages, publication_year, series_id
        FROM Book
        WHERE book_id = ${curr_id}) b
    INNER JOIN (SELECT * FROM Written_By WHERE book_id = ${curr_id}) wb ON wb.book_id = b.book_id
    INNER JOIN Authors a ON a.author_id = wb.author_id
  LIMIT 1;
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data[0]);
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
  // in which a book has been rated as well as a boolean indicator 
  // denoting if its average rating is higher or lower than 
  // other books in the same genre for each year in which it has been rated
  connection.query(`
  WITH ya_filtered AS (SELECT *
    FROM yearly_average ya
    WHERE genre_id = (SELECT genre_id
                       FROM Book_Genres
                       WHERE book_id = ${curr_id}
                       LIMIT 1)
    )
  SELECT ya2.genre_id, r.year_added, 
          ROUND(AVG(r.rating), 2) AS average_rating, 
          COUNT(*) AS review_count,
          ROUND(ya2.yearly_average, 2) AS yearly_average, 
          (AVG(r.rating) > yearly_average) AS gt_yearly_avg
  FROM (SELECT * FROM Reviews WHERE book_id = ${curr_id}) r
    JOIN ya_filtered ya2 ON ya2.year_added = r.year_added
  GROUP BY r.year_added, ya2.genre_id
  ORDER BY ya2.genre_id, year_added;
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
  FROM (SELECT book_id, series_id FROM Book WHERE book_id = ${curr_id}) b
    JOIN Book_Series bs ON b.series_id = bs.series_id
    JOIN Book bk ON bs.series_id = bk.series_id
  GROUP BY bk.title;
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
  SELECT a.name AS author, w.role, bs.title AS series_title
  FROM (SELECT book_id, series_id FROM Book WHERE book_id = ${curr_id}) b
    INNER JOIN Written_By w ON w.book_id = b.book_id
    INNER JOIN Authors a ON w.author_id = a.author_id
    INNER JOIN Book_Series bs ON b.series_id = bs.series_id;
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data[0]);
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
    FROM (SELECT genre_id FROM Book_Genres WHERE book_id = ${curr_id}) bg
    INNER JOIN Genres g ON g.genre_id = bg.genre_id;
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
  WHERE b.book_id = ${curr_id};
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
   WITH month_top_reviewed AS (

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
    JOIN (SELECT book_id, title, image_url
        FROM Book
    ) b ON tt.book_id = b.book_id
    ORDER BY RAND()
    LIMIT 10

  )
  SELECT btt.*,
         GROUP_CONCAT(DISTINCT A.name ORDER BY A.name DESC SEPARATOR ', ') AS authors
  FROM b_top_ten btt
    JOIN Written_By wb ON btt.book_id = wb.book_id
    JOIN (SELECT author_id, name FROM Authors) A ON A.author_id = wb.author_id
  GROUP BY btt.book_id
  ORDER BY btt.wt_avg DESC;
  
   `, (err, data) => {
     if (err || data.length === 0) {
       console.log(err);
       res.json({});
       console.log('Failing to return top 10 books info');
     } else { 
       res.json(data);
       console.log('Successfully return top 10 books info');
     }
   });
 }
 
 // Route 10: GET /book_recs_rand_genre/:user_id
 const book_recs_rand_genre = async function(req, res) {
   // Find two random genres and the select the top 2 rated books within those genres and return these as recommended books for the the user
   const user_id = req.params.user_id;
   connection.query(`
   WITH genre_random AS (
    SELECT bg.genre_id AS genre_id
    FROM Users_Liked u
    JOIN Book_Genres bg ON u.book_id = bg.book_id
    WHERE user_id = 1
    ORDER BY RAND()
    LIMIT 2
      )
  (SELECT g.genre_name, b.title, b.image_url
      FROM Genres g
          NATURAL JOIN Book_Genres bg
        JOIN
          (SELECT * FROM genre_random
           LIMIT 1) g_user ON bg.genre_id = g_user.genre_id
          JOIN Book b ON bg.book_id = b.book_id
      ORDER BY b.average_rating
      LIMIT 2)
      UNION
      (SELECT g.genre_name, b.title,b.image_url
      FROM Genres g
          NATURAL JOIN Book_Genres bg
        JOIN
          (SELECT * FROM genre_random
           LIMIT 1,1) g_user ON bg.genre_id= g_user.genre_id
          JOIN Book b ON bg.book_id = b.book_id
      ORDER BY b.average_rating
      LIMIT 2);
   `, (err, data) => {
     if (err || data.length === 0) {
       console.log(err);
       res.json({});
     } else {
       res.json(data);
     }
   });
 }

// Route 11: GET /surprise_me/:user_id
const surprise_me = async function(req, res) {
   // 
   const user_id = req.params.user_id;
   connection.query(`
   SELECT book_id
    FROM Book b
    WHERE b.average_rating <
          (SELECT AVG(average_rating) AS avg_genre_rating
            FROM
            (SELECT MIN(genre_id) AS genre_id
            FROM (SELECT genre_id, COUNT(genre_id)
                  FROM (SELECT ul.book_id, bg.genre_id
                        FROM (SELECT book_id FROM Users_Liked WHERE user_id = ${user_id}) ul
                            JOIN Book_Genres bg ON ul.book_id = bg.book_id) t1
                            NATURAL JOIN Genres g
                        GROUP BY genre_id) t2) t3
    INNER JOIN Book_Genres bg ON bg.genre_id = t3.genre_id
    INNER JOIN Book B on bg.book_id = B.book_id)
    ORDER BY RAND()
    LIMIT 1; 
   `, (err, data) => {
     if (err || data.length === 0) {
       console.log(err);
       res.json({});
     } else { 
       res.json(data[0]);
     }
   });
 }
 
 /*****************************
  * ROUTES BY PAGES -- Authors *
  *****************************/
 
 // Route 12: GET /author_details/:author_id
 const author_details = async function(req, res) {
   // Return author details for the selected author
   const author_id = req.params.author_id;
   connection.query(`
   SELECT A.*, COUNT(*) AS num_books
   FROM Authors A
      NATURAL JOIN Written_By
   WHERE A.author_id = ${author_id}
   GROUP BY A.author_id
   `,
   (err, data) => {
     if (err || data.length === 0) {
       console.log(err);
       res.json({});
     } else {
       res.json(data[0]);
     }
   });
 }
 
 // Route 13: GET /books_by_author/:author_id
const books_by_author = async function(req, res) {
  const author_id = req.params.author_id;

  connection.query(`
  SELECT B.book_id, B.title, B.image_url, B.average_rating, 
          B.num_pages, B.ratings_count, B.publication_year
  FROM (SELECT author_id, name FROM Authors WHERE Authors.author_id = ${author_id}) a
      INNER JOIN Written_By wb ON a.author_id = wb.author_id
      INNER JOIN Book B on wb.book_id = B.book_id
  ORDER BY B.average_rating * B.ratings_count DESC
  LIMIT 20
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
      console.log('Failed to return books by author ')
    } else {
      console.log('Successfully returned books by author info')
      res.json(data);
    }
  });
}


 // Route 14: GET /user_liked/:user_id
 const user_liked = async function(req, res) {
   const user_id = req.params.user_id;
   connection.query(`
   SELECT *
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
 
 // Route 15: GET /authors_ordered
 const authors_ordered = async function(req, res) {
   // Return author details for the All authors page

    connection.query(`
    SELECT * FROM Authors
    WHERE author_id IN (SELECT author_id FROM Written_By)
    ORDER BY average_rating * ratings_count DESC;
    `, (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json([]);
        console.log('Error retrieving authors');
      } else {
       console.log('Successfully returned authors');
        res.json(data);
      }
    });
 }

  // Route 14: POST /signup
  const add_user = async function(req, res) {
    const { username, password } = req.body; // assuming these are the fields you want to store in the user_info table
    
    try {
      // Insert new row into user_info table
      const insertQuery = 'INSERT INTO Users (username, password) VALUES (?, ?)';
      await connection.query(insertQuery, [username, password]);
  
      res.status(200).send('User info updated successfully');
    } catch (err) {
      console.error(err);
      res.status(500).send('Error updating user info');
    }
  }
  
  //Route 15: GET /user_info
  const user_info = async function(req, res) {
    // Return author details for the All authors page
  
     connection.query(`
     SELECT * FROM Users;
     `, (err, data) => {
       if (err || data.length === 0) {
         console.log(err);
         res.json([]);
         console.log('Error retrieving user credentials');
       } else {
        console.log('Successful');
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
   surprise_me,
   books_by_author,
   add_user,
   user_info,
 }
 
 