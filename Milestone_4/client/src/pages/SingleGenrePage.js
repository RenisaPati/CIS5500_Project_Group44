import { useEffect, useState } from 'react';
import { Container, Box, Grid, Typography } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { useParams } from 'react-router-dom';

const config = require('../config.json');

export default function SingleGenrePage() {
  const { genre_name } = useParams();

  const [booksInGenre, setBooksInGenre] = useState([]);

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/genre/${genre_name}`)
      .then(res => res.json())
      .then(resJson => setBooksInGenre(resJson));
  }, [genre_name]);

  // flexFormat provides the formatting options for a "flexbox" layout that enables the album cards to
  // be displayed side-by-side and wrap to the next line when the screen is too narrow. Flexboxes are
  // incredibly powerful. You can learn more on MDN web docs linked below (or many other online resources)
  // https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Flexbox
  const flexFormat = { display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-evenly' };

  return (
    <Container >
    <Grid item xs={12} md={12} style={{ backgroundColor: "#fdb98a" }}>
              <div style={{ 
                background: '#333', 
                color: '#fff', 
                padding: '20px', 
                border: '2px solid #000', 
                borderRadius: '10px', 
                textAlign: 'center', 
                textTransform: 'uppercase', 
                letterSpacing: '2px', 
                marginBottom: '20px',
                marginRight : '20px'
              }}>
                <Typography variant="h4" component="h2" style={{ margin: 0 }}>
                  Top books in the {genre_name} genre
                </Typography>
              </div>
              <Grid container spacing={3} style={{ justifyContent: 'space-between'}}>
                {booksInGenre.map((book) => (
                  <Grid item key={book.book_id} style={{marginRight : "20px"}} >
                    <Box
                      p={3}
                      style={{ background: '#fff', borderRadius: '10px', border: '2px solid #000' }}
                    >
                      <img
                        src={book.image_url}
                        alt={`${book.title} album art`}
                        style={{ maxWidth: '100%', height: 'auto' }}
                      />
                      
                    </Box>
                    <div style={{ maxWidth: "150px", textAlign: "center"}}>
                                <NavLink to={`/book/${book.book_id}`}>
                                  {book.title}
                                </NavLink>
                              </div>
                  </Grid>
                ))}
              </Grid>
            </Grid>
  
    </Container>
    
    );
}

