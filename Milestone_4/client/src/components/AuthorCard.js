import { useEffect, useState } from 'react';
import { Box, Button, ButtonGroup, Link, Modal } from '@mui/material';
//import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { NavLink } from 'react-router-dom';

// import { formatDuration } from '../helpers/formatter';
const config = require('../config.json');

export default function AuthorCard({ authorID, handleClose }) {
  const [authorData, setAuthorData] = useState({});
  const [authorsBooksData, setAuthorsBooksData] = useState(null);
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

  return (
    <Modal
      open={true}
      onClose={handleClose}
      style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
    >
      <Box >
        <Container style={flexFormat}>
        {albums.map((album) =>
          <Box
            key={album.album_id}
            p={3}
            m={2}
            style={{ background: 'white', borderRadius: '16px', border: '2px solid #000' }}
          >
            
            <img
              src={album.thumbnail_url}
              alt={`${album.title} album art`}
            />
          
            <h4><NavLink to={`/albums/${album.album_id}`}>{album.title}</NavLink></h4>
          </Box>
        )}
        </Container>
          <Button onClick={handleClose} style={{ left: '50%', transform: 'translateX(-50%)' }}>
            Close
          </Button>
      </Box>
    </Modal>
  );
}
