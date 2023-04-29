import { useEffect, useState } from 'react';
import { Container, Divider, Link } from '@mui/material';
import { NavLink } from 'react-router-dom';
// import { Grid, Paper, Image, Text, Typography, Chart } from '@material-ui/core';

import LazyTable from '../components/LazyTable';
import SongCard from '../components/SongCard';
import BookCard from '../components/BookCard';
const config = require('../config.json');

export default function HomePage() {
  // We use the setState hook to persist information across renders (such as the result of our API calls)
  const [recommendedBooks, setRecommendedBooks] = useState({});
  const [topBooksMonth, setTopBooksMonth] = useState({});
  const [userLiked, setUserLiked] = useState({});
  const [surpriseMe, setSurpriseMe] = useState({});
  const user_id = 1;

  const [selectedBookId, setSelectedBookId] = useState(null);


  // The useEffect hook by default runs the provided callback after every render
  // The second (optional) argument, [], is the dependency array which signals
  // to the hook to only run the provided callback if the value of the dependency array
  // changes from the previous render. In this case, an empty array means the callback
  // will only run on the very first render.
  useEffect(() => {
    // Fetch request to get the song of the day. Fetch runs asynchronously.
    // The .then() method is called when the fetch request is complete
    // and proceeds to convert the result to a JSON which is finally placed in state.
    
    fetch(`http://${config.server_host}:${config.server_port}/book_recs_rand_genre/${user_id}`)
      .then(res => res.json())
      .then(resJson => setRecommendedBooks(resJson));

    fetch(`http://${config.server_host}:${config.server_port}/user_liked/${user_id}`)
      .then(res => res.json())
      .then(resJson => setUserLiked(resJson));    

    fetch(`http://${config.server_host}:${config.server_port}/top_ten_books_month`)
      .then(res => res.json())
      .then(resJson => setTopBooksMonth(resJson));       

    // TODO (TASK 14): add a fetch call to get the app author (name not pennkey) and store it in the state variable
    fetch(`http://${config.server_host}:${config.server_port}/surprise_me/${user_id}`)
      .then(res => res.text())
      .then(resText => setSurpriseMe(resText));
  }, []);

  // Here, we define the columns of the "Top Songs" table. The songColumns variable is an array (in order)
  // of objects with each object representing a column. Each object has a "field" property representing
  // what data field to display from the raw data, "headerName" property representing the column label,
  // and an optional renderCell property which given a row returns a custom JSX element to display in the cell.
  // const songColumns = [
  //   {
  //     field: 'title',
  //     headerName: 'Song Title',
  //     renderCell: (row) => <Link onClick={() => setSelectedSongId(row.song_id)}>{row.title}</Link> // A Link component is used just for formatting purposes
  //   },
  //   {
  //     field: 'album',
  //     headerName: 'Album',
  //     renderCell: (row) => <NavLink to={`/albums/${row.album_id}`}>{row.album}</NavLink> // A NavLink component is used to create a link to the album page
  //   },
  //   {
  //     field: 'plays',
  //     headerName: 'Plays'
  //   },
  // ];

  // TODO (TASK 15): define the columns for the top albums (schema is Album Title, Plays), where Album Title is a link to the album page
  // Hint: this should be very similar to songColumns defined above, but has 2 columns instead of 3
  // b.book_id, b.title, b.description, b.average_rating, b.publisher,b. image_url, b.num_pages
  const bookColumns = [
    {
      field: 'title',
      headerName: 'Book Title',
      renderCell: (row) => <NavLink to={`/book`}>{row.title}</NavLink> // A NavLink component is used to create a link to the album page
    },
    {
      field: 'description',
      headerName: 'Description',
      renderCell: (row) => <Link onClick={() => setSelectedBookId(row.book_id)}>{row.descripion}</Link> // A Link component is used just for formatting purposes
    },
    {
      field: 'average_rating',
      headerName: 'Average Rating'
    },
  ];

  return (
    // <h1> test</h1>
    <Container>
         {/* SongCard is a custom component that we made. selectedSongId && <SongCard .../> makes use of short-circuit logic to only render the SongCard if a non-null song is selected */}
         {/* {selectedSongId && <SongCard songId={surpriseMe} handleClose={() => setSurpriseMe(null)} />} */}
         <h2>Surprise me!:&nbsp;
         <Link onClick={() => setSurpriseMe(surpriseMe.user_id)}></Link>
         </h2>
         <Divider />
         <h2>Recommended for you</h2>
         
         <Divider />
         {/* TODO (TASK 16): add a h2 heading, LazyTable, and divider for top albums. 
         Set the LazyTable's props for defaultPageSize to 5 and rowsPerPageOptions to [5, 10] */}
         <Divider />
         <h2>Books of the month</h2>
         <LazyTable route={`http://${config.server_host}:${config.server_port}/top_ten_books_month`} columns={bookColumns} />
        
         <Divider />
         {/* TODO (TASK 17): add a paragraph (<p>text</p>) that displays the value of your author state variable from TASK 13 */}
         <Divider />
         <h2>Here's what you liked</h2>
        
    </Container>

  );
};