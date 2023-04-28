import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import { Container } from '@mui/material';

//import SongCard from '../components/SongCard';
//import { formatDuration, formatReleaseDate } from '../helpers/formatter';
const config = require('../config.json');

export default function AuthorInfoPage() {
  const { author_id } = useParams();

  const [authorData, setAuthorData] = useState([{}]); // default should actually just be [], but empty object element added to avoid error in template code
  //const [albumData, setAlbumData] = useState([]);

  const [selectedAuthorID, setSelectedAuthorID] = useState(null);

  const columns = [
    { field: 'author_id', headerName: 'ID' },
    { field: 'name', headerName: 'Name' },
    { field: 'average_rating', headerName: 'Average_rating' },
    { field: 'text_reviews_count', headerName: 'Reviews Count' },
    { field: 'ratings_count', headerName: 'Ratings Count' }
  ]

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/authors_ordered`)
      .then(res => res.json())
      .then(resJson => setAuthorData(resJson));
  }, [author_id]);

  return (
    <Container>
      <DataGrid
        rows={authorData}
        columns={columns}
        rowsPerPageOptions={[5, 10, 25]}

      />
    </Container>
  );
}