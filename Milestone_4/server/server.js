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

app.listen(config.server_port, () => {
  console.log(`Server running at http://${config.server_host}:${config.server_port}/`)
});

module.exports = app;
