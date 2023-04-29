import { useEffect, useState } from 'react';
import { Box, Button, ButtonGroup, Link, Modal } from '@mui/material';
// import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { NavLink } from 'react-router-dom';

import { formatDuration } from '../helpers/formatter';
const config = require('../config.json');

// SongCard is a modal (a common example of a modal is a dialog window).
// Typically, modals will conditionally appear (specified by the Modal's open property)
// but in our implementation whether the Modal is open is handled by the parent component
// (see HomePage.js for example), since it depends on the state (selectedSongId) of the parent
export default function BookCard({ book_id, handleClose }) {
  const [bookData, setbookData] = useState({});
  // const [genreData, setgenreData] = useState({});

  // TODO (TASK 20): fetch the song specified in songId and based on the fetched album_id also fetch the album data
  // Hint: you need to both fill in the callback and the dependency array (what variable determines the information you need to fetch?)
  // Hint: since the second fetch depends on the information from the first, try nesting the second fetch within the then block of the first (pseudocode is provided)
  useEffect(() => {
  //  Hint: here is some pseudocode to guide you
    fetch(`http://${config.server_host}:${config.server_port}/book/${book_id}`)
      .then(res => res.json())
      .then(bookData => { 
        setbookData(bookData)
       // set state variable with song dta
        // fetch(`http://${config.server_host}:${config.server_port}/genre/${bookData.genre_id}`)
        //   .then(res => res.json())
        //   .then(genreData => setgenreData(genreData))
        });
  }, [book_id]);


  return (
    <Modal
      open={true}
      onClose={handleClose}
      style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
    >
      <Box
        p={3}
        style={{ background: 'white', borderRadius: '16px', border: '2px solid #000', width: 600 }}
      >
        <h1>{bookData.title}</h1>
        <h2>Album:&nbsp;
          <NavLink to={`/book/${book_id}`}>{bookData.title}</NavLink>
        </h2>
        <p>Duration: </p>
        
        <Button onClick={handleClose} style={{ left: '50%', transform: 'translateX(-50%)' }} >
          Close
        </Button>
      </Box>
    </Modal>
  );
}