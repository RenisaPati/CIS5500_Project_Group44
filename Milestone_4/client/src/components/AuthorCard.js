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
      fetch(`http://${config.server_host}:${config.server_port}/author_details/${authorID}`).then(res => res.json()),
      fetch(`http://${config.server_host}:${config.server_port}/books_by_author/${authorID}`).then(res => res.json()),
    ]).then(([authorData, booksData]) => {
      setAuthorData(authorData);
      setAuthorsBooksData(booksData);
      setLoading(false);
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
      <Box style={flexFormat} sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
      {loading ? (
        <p>Loading...</p>
      ) : (
        authorsBooksData.map((row, index) => (
          <Box key={index} sx={{ p: 1 }}>
            <img src={row.image_url} alt={`Image ${row.title}`} width="200" height="200" />
          </Box>
        ))
        )}
      </Box>
    </Modal>
  );
}
