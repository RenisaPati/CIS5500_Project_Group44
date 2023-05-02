import { useEffect, useState } from 'react';
import React from 'react';
import { Container, Divider, Grid, Paper,Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link, useParams } from 'react-router-dom';
import Rating from 'react-rating-stars-component';
import {teal } from '@mui/material/colors';
import LazyTable from '../components/LazyTable';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,Label,Legend } from 'recharts';
import SeriesCard from '../components/SeriesCard';

import { NavLink } from 'react-router-dom';
// import MyChart from '../components/Chart';


const config = require('../config.json');

export default function BooksPage() {
  const {book_id} = useParams();

  const [selectedSeriesID, setSelectedSeriesID] = useState(null);

  const [authorSeries, setAuthorSeries] = useState([]);

  const [bookInfo, setBookInfo] = useState([]);

  const [similarBooks, setSimilarBooks] = useState([]);

  const [genre, setGenre] = useState([]);

  const [chartData, setChartData] = useState([]);


  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/book_author_series/${book_id}`)
      .then(res => res.json())
      .then(resJson => setAuthorSeries(resJson));

    fetch(`http://${config.server_host}:${config.server_port}/similar_books/${book_id}`)
      .then(res => res.json())
      .then(resJson => setSimilarBooks(resJson));

    fetch(`http://${config.server_host}:${config.server_port}/book/${book_id}`)
      .then(res => res.json())
      .then(resJson => { console.log(resJson)
       setBookInfo(resJson)}
      );

    fetch(`http://${config.server_host}:${config.server_port}/rating_history/${book_id}`)
      .then(res => res.json())
      .then(resJson => setChartData(resJson));

    fetch(`http://${config.server_host}:${config.server_port}/book_genres/${book_id}`)
      .then(res => res.json())
      .then(resJson => setGenre(resJson));

  }, [book_id]);

  const Image = styled('img')({
    width: '100%',
    height: 'auto',
    paddingRight : '10px'
  });

  const reviewColumns = [
    {
      field: 'review_text',
      headerName: 'Review',
    },
    {
      field: 'rating',
      headerName: 'Rating',
    },
    {
      field: 'num_votes',
      headerName: 'Votes'
    },
  ];



  return (
    <Box mt={11}>
    {selectedSeriesID && <SeriesCard seriesID={selectedSeriesID} handleClose={() => setSelectedSeriesID(null)} />}
    <Container  maxWidth='xl' >
      <Grid container spacing={10} maxWidth='xl' style={{ backgroundColor: teal[50] }}>

        <Grid item xs={12} md={4}  maxWidth='xl'>

          <Grid item xs={12} md={12}>
            <Paper sx={{ textAlign: "left" }}>
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
                <Image src={bookInfo.image_url} alt="book_image" style={{ marginTop : "20px", marginBottom: "10px", height : "500px", width : "400px" }} />
                <div style={{ display: "flex", alignItems: "center" }}>
                <Rating
                  initialRating={bookInfo.average_rating}
                  value={bookInfo.average_rating}
                  edit={false}
                  size={24}
                  activeColor="#ffd700"
                />
                <span style={{ marginLeft: 8, fontSize: 16 }}>
                  {bookInfo.average_rating} 
                </span>
              </div>
              <p>({bookInfo.ratings_count} ratings)</p>
              </div>
            </Paper>
          </Grid>

        </Grid>
  
        {/* Four partitions on the remaining page */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={3}>

            <Grid item xs={12} md={12}>
            <h1 style={{ fontSize: '50px', margin: '0' }}>{bookInfo.title}</h1>
            <h2 style={{ margin: '0' }}>{authorSeries.author}</h2>
            <h4 style={{ marginTop: '50px' }}>Description : {<span style={{ fontSize: '16px', fontWeight: 'lighter' }}>{bookInfo.description}</span>}</h4>
            <div>
              <h4>
                Genres:{' '}
                {genre.map((item, index) => (
                  <React.Fragment key={index}>
                    <Link to={`/genre/${item.genre_name}`} style={{ color: teal[800] }}>
                      {item.genre_name}
                    </Link>
                    {index !== genre.length - 1 && ', '}
                  </React.Fragment>
                ))}
              </h4>
            </div>
            {/* <h4>Series Name : {<span style={{ fontSize: '16px', fontWeight: 'lighter' }}>{authorSeries.series_title}</span>}</h4> */}
            <h4>Series Name :  
             <Link component="button" style={{ color: teal[800] }} onClick={() => setSelectedSeriesID(bookInfo.book_id)}>
              {authorSeries.series_title} 
              </Link>
            </h4>
            <h4>ISBN : {<span style={{ fontSize: '16px', fontWeight: 'lighter' }}>{bookInfo.isbn}</span>}</h4>
            <h4>Lannguage : {<span style={{ fontSize: '16px', fontWeight: 'lighter' }}>{bookInfo.language_code}</span>}</h4>
            <h4>E-book : {<span style={{ fontSize: '16px', fontWeight: 'lighter' }}>{bookInfo.is_ebook}</span>}</h4>
            <h4>Format : {<span style={{ fontSize: '16px', fontWeight: 'lighter' }}>{bookInfo.format}</span>}</h4>
            <h4>Publisher : {<span style={{ fontSize: '16px', fontWeight: 'lighter' }}>{bookInfo.publisher}</span>}</h4>
            <h4>Number of pages : {<span style={{ fontSize: '16px', fontWeight: 'lighter' }}>{bookInfo.num_pages}</span>}</h4>
            <h4>Publication Year : {<span style={{ fontSize: '16px', fontWeight: 'lighter' }}>{bookInfo.publication_year}</span>}</h4>
            </Grid>

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
                  You May Also Like
                </Typography>
              </div>
              <Grid container spacing={3} style={{ justifyContent: 'space-between'}}>
                {similarBooks.length > 0 ? (
                  similarBooks.map((similarbook) => (
                    <Grid item key={similarbook.similar_book_id} style={{marginRight : "20px"}} >
                      <Box
                        p={3}
                        style={{ background: '#fff', borderRadius: '10px', border: '2px solid #000' }}
                      >
                        <img
                          src={similarbook.similar_url}
                          alt={`${similarbook.similar_title} album art`}
                          style={{ maxWidth: '100%', height: 'auto' }}
                        />
                      </Box>
                      <div style={{ maxWidth: "150px", textAlign: "center"}}>
                        <NavLink to={`/book/${similarbook.similar_book_id}#top`}>
                          {similarbook.similar_title}
                        </NavLink>
                      </div>
                    </Grid>
                  ))
                ) : (
                  <Grid item xs={12} 
                  style={{ marginTop: "10px", marginBottom: "10px", marginRight: "20px", textAlign: "center" }}>
                    <Box
                      p={3}
                      style={{ background: '#fff', borderRadius: '10px', border: '2px solid #000' }}
                    >
                      <div>No similar books found.</div>
                    </Box>
                  </Grid>
                )}
              </Grid>

            </Grid>


            <Grid xs={12} container justify="center" alignItems="center" >
                {chartData.length > 1 ? (
                  <div style={{ textAlign: 'left'}}>
                    <h2>
                      <i>Over the Years</i>
                    </h2>
                  
                    <AreaChart
                      width={730}
                      height={250}
                      data={chartData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                    <defs>
                    <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#e53f71" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#e53f71" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="year_added">
                      <Label value="year_added" position="bottom" />
                    </XAxis>
                    <YAxis />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="average_rating"
                      stroke="#8884d8"
                      fillOpacity={1}
                      fill="url(#colorUv)"
                    />
                    <Area
                      type="monotone"
                      dataKey="yearly_average"
                      stroke="#e53f71"
                      fillOpacity={1}
                      fill="url(#colorPv)"
                    />
                    <Legend verticalAlign="top" align="right" />
                    </AreaChart>

                    
                  </div>
                ) : (
                  <div style={{ textAlign: 'left'}}>
                    <h2>
                      <i>Over the Years</i>
                    </h2>
                    <Grid item xs={12} 
                      style={{ marginTop: "10px", marginBottom: "10px", marginRight: "20px", textAlign: "center" }}>
                      <Box
                        p={3}
                        style={{ background: '#fff', borderRadius: '10px', border: '2px solid #000' }}
                      >
                        <div>No rating history data available for {bookInfo.title}.</div>
                      </Box>
                    </Grid>
                  </div>
                )}
            </Grid>

          
            <Grid item xs={12} md={12} >
              <Divider />
              <h2><i>What other people said ...</i></h2>
              <LazyTable route={`http://${config.server_host}:${config.server_port}/reviews/${book_id}`} columns={reviewColumns} />
            </Grid>


          </Grid>
        </Grid>
      </Grid>
    </Container>
    </Box>
  );

 }


// : chartData.length === 1 ? (
//   <div style={{ textAlign: 'left' }}>
//     <h2>
//       <i>This book has review data in only one year:</i>
//     </h2>
//     <BarChart width={730} height={250} data={chartData}>
//       <CartesianGrid strokeDasharray="3 3" />
//       <XAxis dataKey="year_added" />
//       <YAxis />
//       <Tooltip />
//       <Legend />
//       <Bar dataKey="average_rating" fill="#8884d8" />
//       <Bar dataKey="yearly_average" fill="#e53f71" />                   
//     </BarChart>
//   </div>
// )
