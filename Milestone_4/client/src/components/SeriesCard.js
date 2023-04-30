import { useEffect, useState } from 'react';
import { Box, Button, Container, Modal } from '@mui/material';
import { NavLink } from 'react-router-dom';
//import '../helpers/styles.css'
const config = require('../config.json');

export default function SeriesCard({ seriesID, handleClose }) {
  const [seriesData, setSeriesData] = useState([]);
  const [x, setx] = useState([]);
//   const [authorsBooksData, setAuthorsBooksData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // setLoading(true);
    // Promise.all([
    //   fetch(`http://${config.server_host}:${config.server_port}/book_series/${seriesID}`)
    //     .then(res => res.json())
    // //   ,fetch(`http://${config.server_host}:${config.server_port}/books_series/${book_id}`)
    // //     .then(res => res.json()),
    // ]).then(([seriesData]) => {
    //   setSeriesData(seriesData);
    // //   setAuthorsBooksData(booksData);
    //   setLoading(false);
    //   console.log(`Current series ID: ${seriesID}`);
    //   console.log(seriesData);
    // });
    fetch(`http://${config.server_host}:${config.server_port}/book_series/${seriesID}`)
      .then(res => res.json())
      .then(resJson => {console.log(`Current series ID: ${seriesID}`);
      console.log(resJson[0].title);
      setSeriesData(resJson)
      setx(resJson[0])});
  }, [seriesID]);

  const flexFormat = { display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-evenly' };

  return (
    <Modal open={true} onClose={handleClose} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Container style={{ ...flexFormat, maxHeight: '80vh', overflow: 'auto' }}>
        <Box
          p={3}
          style={{ backgroundColor : "#fdb98a", borderRadius: '16px', border: '2px solid #000', width: 600 }}
        >
          <Box style={{ display: 'flex', flexWrap: 'wrap' }}>
                <h1> {x.title}</h1>
                <h4 style={{ marginTop: '50px' }}>Description : {<span style={{ fontSize: '16px', fontWeight: 'lighter' }}>{x.description}</span>}</h4>
          </Box>
          <h2>Books in this Series :</h2>
          <Box style={{ display: 'flex', flexWrap: 'wrap' }}>
            {seriesData.map(seriesData => (
              <Box key={seriesData.book_id} style={{ margin: 8 }}>
              <img
                src={seriesData.image_url}
                alt={seriesData.book_title}
                style={{ width: 150, height: 225 }}
              />
              <div style={{ maxWidth: "150px", textAlign: "center"}}>
                <NavLink to={`/book/${seriesData.book_id}`}>{seriesData.book_title}
                </NavLink>
              </div> 
            </Box>
            ))}
          </Box>
          <Button onClick={handleClose} >
            Close
          </Button>
        </Box>
      </Container>
    </Modal>
  );
}