import { useEffect, useState } from 'react';
import { Container, Box } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { useParams } from 'react-router-dom';

const config = require('../config.json');

export default function SingleGenre() {
  const { genreName } = useParams();

  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/genre/${genreName}`)
      .then(res => res.json())
      .then(resJson => setBooks(resJson));
  }, [genreName]);

  // flexFormat provides the formatting options for a "flexbox" layout that enables the album cards to
  // be displayed side-by-side and wrap to the next line when the screen is too narrow. Flexboxes are
  // incredibly powerful. You can learn more on MDN web docs linked below (or many other online resources)
  // https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Flexbox
  const flexFormat = { display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-evenly' };

  return (
    <Container style={flexFormat}>
      {books.map(book => 
        <Box
          key={book.book_id}
          p={3}
          m={2}
          style={{ background: 'white', borderRadius: '16px', border: '2px solid #000' }}
        >
      
          <img
            src={book.image_url}
            alt={`${book.title} album art`}
          />
    
      <h6><NavLink to={`/book/${book.book_id}`}>{book.title}</NavLink></h6>
      </Box>
    )}
    </Container>
    
  );
}

