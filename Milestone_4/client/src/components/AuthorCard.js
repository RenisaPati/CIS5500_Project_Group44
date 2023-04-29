import { useEffect, useState } from 'react';
import { Box, Button, Container, Modal } from '@mui/material';
import { NavLink } from 'react-router-dom';
import '../helpers/styles.css'
const config = require('../config.json');

export default function AuthorCard({ authorID, handleClose }) {
  const [authorData, setAuthorData] = useState([]);
  const [authorsBooksData, setAuthorsBooksData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch(`http://${config.server_host}:${config.server_port}/author_details/${authorID}`)
        .then(res => res.json()),
      fetch(`http://${config.server_host}:${config.server_port}/books_by_author/${authorID}`)
        .then(res => res.json()),
    ]).then(([authorData, booksData]) => {
      setAuthorData(authorData);
      setAuthorsBooksData(booksData);
      setLoading(false);
      console.log(`Current author ID: ${authorID}`);
      console.log(authorData);
      console.log('Below is the books by author data');
      console.log(authorsBooksData);
    });
  }, [authorID]);

  const flexFormat = { display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-evenly' };

  return (
    <Modal open={true} onClose={handleClose} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Container style={{ ...flexFormat, maxHeight: '80vh', overflow: 'auto' }}>
        <Box
          p={3}
          style={{ background: 'white', borderRadius: '16px', border: '2px solid #000', width: 600 }}
        >
          <Box style={{ display: 'flex', flexWrap: 'wrap' }}>
                <h1>{authorData.name}; Average Rating: {authorData.average_rating}</h1>
          </Box>
          <h2>Books:</h2>
          <Box style={{ display: 'flex', flexWrap: 'wrap' }}>
            {authorsBooksData.map(bookData => (
              <Box key={bookData.book_id} style={{ margin: 8 }}>
              <img
                src={bookData.image_url}
                alt={bookData.title}
                style={{ width: 150, height: 225 }}
              />
              <h5> 
                <NavLink to={`/book/${bookData.book_id}`}>{bookData.title}
                </NavLink>
              </h5>
            </Box>
            ))}
          </Box>
        </Box>
      </Container>
    </Modal>
  );
}
