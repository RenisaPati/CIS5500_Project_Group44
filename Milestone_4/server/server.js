const express = require('express');
const cors = require('cors');
const config = require('./config');
const routes = require('./routes');

const app = express();
app.use(cors({
  origin: '*',
}));

// We use express to define our various API endpoints and
// provide their handlers that we implemented in routes.js
app.get('/genre/:genre_name', routes.genre);
app.get('/book/:book_id', routes.book);
app.get('/reviews/:book_id', routes.reviews);
app.get('/rating_history/:book_id', routes.rating_history);
app.get('/book_series/:book_id', routes.book_series);
app.get('/book_author_series/:book_id', routes.book_author_series);
app.get('/book_genres/:book_id', routes.book_genres);
app.get('/similar_books/:book_id', routes.similar_books);
app.get('/top_ten_books_month',routes.top_ten_books_month);
app.get('/book_recs_rand_genre/:user_id', routes.book_recs_rand_genre);
app.get('/author_details/:author_id', routes.author_details);
app.get('/user_liked/:user_id', routes.user_liked);
app.get('/authors_ordered', routes.authors_ordered);
app.get('/surprise_me/:user_id', routes.surprise_me);
app.get('/books_by_author/:author_id', routes.books_by_author);
app.get('/get_user_credential_info', routes.user_info);
app.post('/signup', routes.add_user);

//login authentication possible server side implementation
// app.post('/api/login', (req, res) => {
//   const { username, password } = req.body;

//   // Query the user information database to retrieve the user's record by their username
//   const user = users.find(user => user.username === username);

//   // Compare the password hash stored in the user's record with the password entered by the user in the login form
//   if (user && bcrypt.compareSync(password, user.passwordHash)) {
//     // If the passwords match, authenticate the user by setting a session variable or JWT token
//     req.session.user = { username: user.username };
//     res.status(200).json({ success: true });
//   } else {
//     // If the passwords don't match, send an error response to the client
//     res.status(401).json({ success: false, message: 'Invalid username or password' });
//   }
// });

app.listen(config.server_port, () => {
  console.log(`Server running at http://${config.server_host}:${config.server_port}/`)
});

module.exports = app;
