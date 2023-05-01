import { useEffect, useState } from 'react';
import { Box, Button, Container, Grid, Modal, Typography } from '@mui/material';
import { NavLink } from 'react-router-dom';
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
          style={{ background: 'white', borderRadius: '5px', border: '2px solid #000', width: 800 }}
        >
          <Grid item xs={12} md={12} style={{ backgroundColor: "#fdb98a" }}>
              <div style={{ 
                background: '#333', 
                color: '#fff', 
                padding: '20px', 
                border: '20px solid #000', 
                borderRadius: '10px', 
                textAlign: 'center', 
                textTransform: 'uppercase', 
                letterSpacing: '2px', 
                marginBottom: '20px',
              
              }}>
                <Typography variant="h4" component="h2" style={{ margin: 0 }}>
                  {authorData.name}
                </Typography>
                <Typography>
                  <p>Average Rating: {authorData.average_rating}</p>
                  <p>Books Published: {authorData.num_books}</p>
                </Typography>
              </div>
              <Grid container spacing={3} style={{ justifyContent: 'space-between'}}>
                {authorsBooksData.map((book) => (
                  <Grid item key={book.book_id} style={{marginRight : "20px", marginLeft: "20px"}} >
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
          <Button onClick={handleClose} style={{ left: '50%', transform: 'translateX(-50%)' }} >
          Close
         </Button>
        </Box>
      </Container>
    </Modal>
  );
}
