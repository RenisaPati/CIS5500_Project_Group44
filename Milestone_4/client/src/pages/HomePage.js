import { useEffect, useState } from 'react';
import { Container, Divider, Box, Grid, Link } from '@mui/material';
import { NavLink } from 'react-router-dom';
import * as React from 'react';
import { useTheme } from '@mui/material/styles';

import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { Button, Card, CardMedia } from '@mui/material';


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

    fetch(`http://${config.server_host}:${config.server_port}/surprise_me/${user_id}`)
      .then(res => res.json())
      .then(resJson => setSurpriseMe(resJson));
  }, []);

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
         <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
            {surpriseMe && (
              <div style={{
                position: 'relative',
                height: '100%',
                width: '100%',
                top: '100px',
                backgroundImage: `url(${surpriseMe.image_url})`,
                backgroundSize: 'cover',
              }}>
                <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)' }}>
                  <NavLink to={`/book/${surpriseMe.book_id}`}>
                    <Button variant="contained" style={{ filter: 'none' }}>Surprise Me</Button>
                  </NavLink>
                </div>
              </div>
            )}
         </div>


         <Divider />
         <h2>Recommended for you</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
          {recommendedBooks.map(book => (
            <NavLink key={book.book_id} to={`/book/${book.book_id}`} style={{ margin: 10 }}>
              <img src={book.image_url} alt={book.title} style={{ width: 200, height: 'auto' }} />
            </NavLink>
          ))}
          </div>
         
         <Divider />
         {/* TODO (TASK 16): add a h2 heading, LazyTable, and divider for top albums. 
         Set the LazyTable's props for defaultPageSize to 5 and rowsPerPageOptions to [5, 10] */}
         <Divider />
            <Grid container spacing={2} style={{...flexFormat, width: '100%', height: '100%'}} >
              <Grid item xs={12} sm={12} style={{height: 'auto'}} >
                <h2>Books of the month</h2>
                <Carousel
                  additionalTransfrom={0}
                  arrows
                  autoPlaySpeed={3000}
                  centerMode={false}
                  autoHeight={true}
                  className=""
                  containerClass="container-padding-bottom"
                  dotListClass=""
                  draggable
                  focusOnSelect={false}
                  infinite
                  itemClass=""
                  keyBoardControl
                  minimumTouchDrag={80}
                  renderButtonGroupOutside={false}
                  renderDotsOutside={false}
                  responsive={{
                    desktop: {
                      breakpoint: { max: 3000, min: 1024 },
                      items: 5,
                      slidesToSlide: 5, // optional, default to 1.
                    },
                    tablet: {
                      breakpoint: { max: 1024, min: 464 },
                      items: 3,
                      slidesToSlide: 3, // optional, default to 1.
                    },
                    mobile: {
                      breakpoint: { max: 464, min: 0 },
                      items: 1,
                      slidesToSlide: 1, // optional, default to 1.
                    },
                  }}
                  showDots={false}
                  sliderClass=""
                  slidesToSlide={1}
                  swipeable
                >
                  {topBooksMonth.map((book) => (
                    <div key={book.book_id}>
                      <Box
                        component="img"
                        sx={{
                          height: 150,
                          display: 'block',
                          maxWidth: 75,
                          overflow: 'hidden',
                          width: '100%',
                        }}
                      />
                      <img src={book.image_url} alt={book.title} />                      
                    </div>
                  ))}
                </Carousel>
 
              </Grid>
              <Grid item xs={12} sm={6} >
                {/* <h3>This is some text</h3>           */}
              </Grid> 
            </Grid>
         <Divider />

         <Divider />
            <Grid container spacing={2} style={{...flexFormat, width: '100%', height: '100%'}} >
              <Grid item xs={12} sm={12} style={{height: '100%'}} >
                <h2>Here's what you liked</h2>
                <Carousel
                  additionalTransfrom={0}
                  arrows
                  autoPlaySpeed={3000}
                  centerMode={false}
                  autoHeight={true}
                  className=""
                  containerClass="container-padding-bottom"
                  dotListClass=""
                  draggable
                  focusOnSelect={false}
                  infinite
                  itemClass=""
                  keyBoardControl
                  minimumTouchDrag={80}
                  renderButtonGroupOutside={false}
                  renderDotsOutside={false}
                  responsive={{
                    desktop: {
                      breakpoint: { max: 3000, min: 1024 },
                      items: 5,
                      slidesToSlide: 5, // optional, default to 1.
                    },
                    tablet: {
                      breakpoint: { max: 1024, min: 464 },
                      items: 3,
                      slidesToSlide: 3, // optional, default to 1.
                    },
                    mobile: {
                      breakpoint: { max: 464, min: 0 },
                      items: 1,
                      slidesToSlide: 1, // optional, default to 1.
                    },
                  }}
                  showDots={false}
                  sliderClass=""
                  slidesToSlide={1}
                  swipeable
                >
                  {userLiked.map((book) => (
                    <div key={book.book_id}>
                      <Box
                        component="img"
                        sx={{
                          height: 150,
                          display: 'block',
                          maxWidth: 75,
                          overflow: 'hidden',
                          width: '100%',
                        }}
                      />
                      <img src={book.image_url} alt={book.title} />                      
                    </div>
                  ))}
                </Carousel>
 
              </Grid>
              <Grid item xs={12} sm={6} >
                {/* <h3>This is some text</h3>           */}
              </Grid> 
            </Grid>
         <Divider />         
        
    </Container>

  );
};