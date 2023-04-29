import { useState } from 'react';
//import { useParams } from 'react-router-dom';
//import { DataGrid } from '@mui/x-data-grid';
import { Container, Divider, Link } from '@mui/material';
import AuthorCard from '../components/AuthorCard';
import LazyTable from '../components/LazyTable';

const config = require('../config.json');

export default function AuthorInfoPage() {
  const [selectedAuthorID, setSelectedAuthorID] = useState(null);

  const authorColumns = [
    { field: 'name', headerName: 'Name' , flex: 1 ,
    // A Link component is used just for formatting purposes
    renderCell: (params) => (
      <Link onClick={() => setSelectedAuthorID(params.author_id)}>{params.name}</Link> )
    },
    { field: 'average_rating', headerName: 'Average_rating' , flex: 1},
    { field: 'text_reviews_count', headerName: 'Reviews Count' , flex: 1},
    { field: 'ratings_count', headerName: 'Ratings Count', flex: 1 }
  ]

  return (
    <Container>
      {selectedAuthorID && <AuthorCard authorID={selectedAuthorID} handleClose={() => 
        setSelectedAuthorID(null)} />}
      <Divider />
        <h2>Find you Favorite Authors Here: </h2>
      <LazyTable 
        route={`http://${config.server_host}:${config.server_port}/authors_ordered`} 
        columns={authorColumns}
        defaultPageSize={25}
        rowsPerPageOptions={[5, 10, 25, 100]} />
      <Divider />
    </Container>
  );
}