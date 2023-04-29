import React from 'react';
import { useEffect, useState } from 'react';
import { Divider, Container, Link } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import AuthorCard from '../components/AuthorCard';
//import { Button } from "@mui/material";
const config = require('../config.json');

export default function AuthorInfoPage() {
  const [selectedAuthorID, setSelectedAuthorID] = useState(null);
  const [authorData, setAuthorData] = useState([]);

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/authors_ordered`)
      .then(res => res.json())
      .then(resJson => {
        // Add a unique "id" property to each row of the authorData array
        setAuthorData(resJson);
        console.log(resJson);
      });
  }, []);

  const authorColumns = [
    { 
      field: 'name', 
      headerName: 'Name', 
      flex: 1, 
      renderCell: (params) => (
        <Link component="button" onClick={() => setSelectedAuthorID(params.row.author_id)}>
          {params.value}
        </Link>
      )
    },
    { 
      field: 'average_rating', 
      headerName: 'Average_rating', 
      flex: 1
    },
    { 
      field: 'text_reviews_count', 
      headerName: 'Reviews Count', 
      flex: 1
    },
    { 
      field: 'ratings_count', 
      headerName: 'Ratings Count', 
      flex: 1 
    }
  ];
console.log(authorData);
console.log(selectedAuthorID);

  return (
    <Container>
      {selectedAuthorID && <AuthorCard authorID={selectedAuthorID} handleClose={() => setSelectedAuthorID(null)} />}
      <Divider />
        <h2>Find you Favorite Authors Here: </h2>
        <div style={{ padding:"10px", margin:"5px", height: 550, width: "100%" }}>
            <DataGrid
              getRowId={(row) => row.author_id}
              rowHeight={50}
              // className={classes.root}
              rows={authorData}
              columns={authorColumns}
              pageSize={10}
              //onCellClick={handleCellClick}
              //onRowClick={handleRowClick}
            />  
          </div> 
      <Divider />
    </Container>
  );
}