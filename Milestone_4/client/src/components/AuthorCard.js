import { useEffect, useState } from 'react';
import { Box, Button, Container, Modal } from '@mui/material';
//import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { NavLink } from 'react-router-dom';

// import { formatDuration } from '../helpers/formatter';
const config = require('../config.json');

export default function AuthorCard({ authorID, handleClose }) {
  const [authorData, setAuthorData] = useState({});
  const [authorsBooksData, setAuthorsBooksData] = useState([{}]);
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
      console.log(authorData);
      console.log(authorsBooksData);
    });
  }, [authorID]);

  const flexFormat = { display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-evenly' };

  if (loading) {
    return (
      <Modal open={true} onClose={handleClose} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Box>
          <h2>Loading info for {authorData.name}...</h2>
        </Box>
      </Modal>
    );
  }

  return (
    <Modal open={true} onClose={handleClose}>
      <Container style={flexFormat} > 
        <Box
        p={3}
        style={{ background: 'white', borderRadius: '16px', border: '2px solid #000', width: 600 }}
        >
          <h1>{authorData.name}</h1>
          <Button onClick={handleClose} style={{ left: '50%', transform: 'translateX(-50%)' }} >
            Close
          </Button>
        </Box>
      </Container>
    </Modal>
  );
}
