import { useEffect, useState } from 'react';
import { Box, Container } from '@mui/material';
import { NavLink } from 'react-router-dom';

const config = require('../config.json');

export default function BookPage() {
    const { book_id } = useParams();

    const [bookData, setBookData] = useState([{}]); // default should actually just be [], but empty object element added to avoid error in template code
    const [reviewsData, setReviewsData] = useState([]);
    const [historyData, setRatingHistory] = useState([]);
    const [bookGenres, setBookGenres] = useState([]);
    const [similarBookData, setSimilarBooks] = useState([]);

    const [selectedBookId, setSelectedBookId] = useState(null);
  
    useEffect(() => {
      fetch(`http://${config.server_host}:${config.server_port}/book/${book_id}`)
        .then(res => res.json())
        .then(resJson => setBookData(resJson));
  
      fetch(`http://${config.server_host}:${config.server_port}/reviews/${book_id}`)
        .then(res => res.json())
        .then(resJson => setReviewsData(resJson));

      fetch(`http://${config.server_host}:${config.server_port}/rating_history/${book_id}`)
        .then(res => res.json())
        .then(resJson => setRatingHistory(resJson)); 

      fetch(`http://${config.server_host}:${config.server_port}/book_genres/${book_id}`)
        .then(res => res.json())
        .then(resJson => setBookGenres(resJson)); 

      fetch(`http://${config.server_host}:${config.server_port}/similar_books/${book_id}`)
        .then(res => res.json())
        .then(resJson => setSimilarBooks(resJson)); 
    }, [book_id]);

    // The start of the container shows how to connect to the modal song card. We should replace this with our
    // book series modal.
  return (
    <Container>
      {selectedBookId && <BookSeriesCard songId={selectedBookId} handleClose={() => setSelectedBookId(null)} />}
      <Stack direction='row' justify='center'>
        <img
          key={bookData.book_id}
          src={bookData.image_url}
          alt={`${bookData.title}`}
          style={{
            marginTop: '40px',
            marginRight: '40px',
            marginBottom: '40px'
          }}
        />
        <Stack>
          <h1 style={{ fontSize: 64 }}>{albumData.title}</h1>
          <h2>Released: {formatReleaseDate(albumData.release_date)}</h2>
        </Stack>
      </Stack>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell key='#'>#</TableCell>
              <TableCell key='Title'>Title</TableCell>
              <TableCell key='Plays'>Plays</TableCell>
              <TableCell key='Duration'>Duration</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              // TODO (TASK 23): render the table content by mapping the songData array to <TableRow> elements
              // Hint: the skeleton code for the very first row is provided for you. Fill out the missing information and then use a map function to render the rest of the rows.
              // Hint: it may be useful to refer back to LazyTable.js
              <TableRow key={songData[0].song_id}>
                <TableCell key='#'>{songData[0].number}</TableCell>
                <TableCell key='Title'>
                  <Link onClick={() => setSelectedSongId(songData[0].song_id)}>
                    Replace me
                  </Link>
                </TableCell>
                <TableCell key='Plays'>Replace me</TableCell>
                <TableCell key='Duration'>Replace me (use the formatDuration helper function, see SongCard.js for an example)</TableCell>
              </TableRow>
            }
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}