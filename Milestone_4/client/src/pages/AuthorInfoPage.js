import React from 'react';
import { useEffect, useState } from 'react';
import { Divider, Container, Link } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import AuthorCard from '../components/AuthorCard';
import { teal } from '@mui/material/colors';
import '../helpers/styles.css'
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
      headerClassName: 'sams-awesome-table-header',
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
      headerClassName: 'sams-awesome-table-header', 
      flex: 1
    },
    { 
      field: 'text_reviews_count', 
      headerName: 'Reviews Count', 
      headerClassName: 'sams-awesome-table-header',
      flex: 1
    },
    { 
      field: 'ratings_count', 
      headerName: 'Ratings Count', 
      headerClassName: 'sams-awesome-table-header',
      flex: 1 
    }
  ];
console.log(authorData);
console.log(selectedAuthorID);

  return (
    <Container style={{backgroundColor: teal[50]}}>
      {selectedAuthorID && <AuthorCard authorID={selectedAuthorID} handleClose={() => setSelectedAuthorID(null)} />}
      <Divider />
        <h2>Find you Favorite Authors Here: </h2>
        <div style={{ padding:"10px", margin:"5px", height: 550, width: "100%" }}>
        <DataGrid
            getRowId={(row) => row.author_id}
            rowHeight={50}
            rows={authorData}
            columns={authorColumns}
            pageSize={10}
            getRowClassName={(params, index) =>
              index % 2 === 0 ? 'MuiDataGrid-evenRow' : 'MuiDataGrid-oddRow'
            }
            sx={{
              boxShadow: 2,
              border: 2,
              borderColor: 'primary.light',
              '& .MuiDataGrid-cell:hover': {
                color: 'primary.main',
              },
              '& .sams-awesome-table-header': {
                backgroundColor: 'rgba(245, 101, 39, 0.8)',
                
              }
            }}
          />
          </div> 
      <Divider />
    </Container>
  );
}