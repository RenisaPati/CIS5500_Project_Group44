import { useEffect, useState } from 'react';
import { Container, Divider, Box, Grid, Link } from '@mui/material';
import { NavLink } from 'react-router-dom';
// import { Grid, Paper, Image, Text, Typography, Chart } from '@material-ui/core';
//import Carousel from 'react-material-ui-carousel'
//import { Paper, Button } from '@mui/material'
import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import MobileStepper from '@mui/material/MobileStepper';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';

//import LazyTable from '../components/LazyTable';
//import BookCard from '../components/BookCard';
//import { DataGrid } from '@mui/x-data-grid';
const config = require('../config.json');

export default function HomePage() {
  // We use the setState hook to persist information across renders (such as the result of our API calls)
  const [recommendedBooks, setRecommendedBooks] = useState([]);
  const [topBooksMonth, setTopBooksMonth] = useState([]);
  const [userLiked, setUserLiked] = useState([]);
  const [surpriseMe, setSurpriseMe] = useState({});
  const user_id = 1;
  const theme = useTheme();

  const [selectedBookId, setSelectedBookId] = useState(null);

  const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

  const [activeStep, setActiveStep] = React.useState(0);
  const maxSteps = topBooksMonth.length;


  // The useEffect hook by default runs the provided callback after every render
  // The second (optional) argument, [], is the dependency array which signals
  // to the hook to only run the provided callback if the value of the dependency array
  // changes from the previous render. In this case, an empty array means the callback
  // will only run on the very first render.
  useEffect(() => {
    // Fetch request to get the song of the day. Fetch runs asynchronously.
    // The .then() method is called when the fetch request is complete
    // and proceeds to convert the result to a JSON which is finally placed in state.
    
    fetch(`http://${config.server_host}:${config.server_port}/book_recs_rand_genre/${user_id}`)
      .then(res => res.json())
      .then(resJson => setRecommendedBooks(resJson));

    fetch(`http://${config.server_host}:${config.server_port}/user_liked/${user_id}`)
      .then(res => res.json())
      .then(resJson => setUserLiked(resJson));    

    fetch(`http://${config.server_host}:${config.server_port}/top_ten_books_month`)
      .then(res => res.json())
      .then(resJson => {
        setTopBooksMonth(resJson);
        console.log(resJson);
      });       

    // TODO (TASK 14): add a fetch call to get the app author (name not pennkey) and store it in the state variable
    fetch(`http://${config.server_host}:${config.server_port}/surprise_me/${user_id}`)
      .then(res => res.text())
      .then(resText => setSurpriseMe(resText));
  }, []);

  // TODO (TASK 15): define the columns for the top albums (schema is Album Title, Plays), where Album Title is a link to the album page
  // Hint: this should be very similar to songColumns defined above, but has 2 columns instead of 3
  // b.book_id, b.title, b.description, b.average_rating, b.publisher,b. image_url, b.num_pages
  const bookColumns = [
    {
      field: 'title',
      headerName: 'Book Title',
      renderCell: (row) => <NavLink to={`/book`}>{row.title}</NavLink> // A NavLink component is used to create a link to the album page
    },
    {
      field: 'description',
      headerName: 'Description',
      renderCell: (row) => <Link onClick={() => setSelectedBookId(row.book_id)}>{row.descripion}</Link> // A Link component is used just for formatting purposes
    },
    {
      field: 'average_rating',
      headerName: 'Average Rating'
    },
  ];

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStepChange = (step) => {
    setActiveStep(step);
  };

  const flexFormat = { 
   display: 'flex',
   flexDirection: 'row', 
   flexWrap: 'wrap', 
   justifyContent: 'space-evenly' };

  return (
    // <h1> test</h1>
    <Container>
         {/* SongCard is a custom component that we made. selectedSongId && <SongCard .../> makes use of short-circuit logic to only render the SongCard if a non-null song is selected */}
         {/* {selectedSongId && <SongCard songId={surpriseMe} handleClose={() => setSurpriseMe(null)} />} */}
         <h2>Surprise me!:&nbsp;
         <Link onClick={() => setSurpriseMe(surpriseMe.user_id)}></Link>
         </h2>
         <Divider />
         <h2>Recommended for you</h2>
         
         <Divider />
         {/* TODO (TASK 16): add a h2 heading, LazyTable, and divider for top albums. 
         Set the LazyTable's props for defaultPageSize to 5 and rowsPerPageOptions to [5, 10] */}
         <Divider />
            <Grid container spacing={2} style={flexFormat}>
              <Grid item xs={12} sm={6}>
                <h3>Books of the month</h3>
                <Box sx={{ maxWidth: 400, flexGrow: 1 }}>
                    <Paper
                      square
                      elevation={0}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        height: 50,
                        pl: 2,
                        bgcolor: 'background.default',
                      }}
                    >
                      
                      <Typography>Test</Typography>
                    </Paper>
                    <AutoPlaySwipeableViews
                      axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                      index={activeStep}
                      onChangeIndex={handleStepChange}
                      enableMouseEvents
                    >
                      {topBooksMonth.map((step, index) => (
                        <div key={step.book_id}>
                          {Math.abs(activeStep - index) <= 2 ? (
                            <Box
                              component="img"
                              sx={{
                                height: 255,
                                display: 'block',
                                maxWidth: 400,
                                overflow: 'hidden',
                                width: '100%',
                              }}
                              src={step.image_url}
                              alt={step.title}
                            />
                          ) : null}
                        </div>
                      ))}
                    </AutoPlaySwipeableViews>
                    <MobileStepper
                      steps={maxSteps}
                      position="static"
                      activeStep={activeStep}
                      nextButton={
                        <Button
                          size="small"
                          onClick={handleNext}
                          disabled={activeStep === maxSteps - 1}
                        >
                          Next
                          {theme.direction === 'rtl' ? (
                            <KeyboardArrowLeft />
                          ) : (
                            <KeyboardArrowRight />
                          )}
                        </Button>
                      }
                      backButton={
                        <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
                          {theme.direction === 'rtl' ? (
                            <KeyboardArrowRight />
                          ) : (
                            <KeyboardArrowLeft />
                          )}
                          Back
                        </Button>
                      }
                    />
                  </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                {/* Content for the right half */}
              </Grid> 
            </Grid>
         <Divider />
         {/* TODO (TASK 17): add a paragraph (<p>text</p>) that displays the value of your author state variable from TASK 13 */}
         <Divider />
         <h2>Here's what you liked</h2>
        
    </Container>

  );
};

// {albums.map((album) =>
//   {topBooksMonth.map((book) =>())}
//        <LazyTable route={`http://${config.server_host}:${config.server_port}/top_ten_books_month`} 
//        columns={bookColumns} /> 
{/* <Carousel>
                  {topBooksMonth.map( (book, i) => <img key={i} src={book.image_url} /> )}
                
                </Carousel> */}