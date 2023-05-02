import { useEffect, useState } from 'react';
import { Container, Divider, Box, Grid } from '@mui/material';
import { NavLink } from 'react-router-dom';
import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import backGroundImage from '../helpers/images/pennlib.png'
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { Button } from '@mui/material';
import { teal } from '@mui/material/colors';


const config = require('../config.json');

export default function HomePage() {
  // We use the setState hook to persist information across renders (such as the result of our API calls)
  const [recommendedBooks, setRecommendedBooks] = useState([]);
  const [topBooksMonth, setTopBooksMonth] = useState([]);
  const [userLiked, setUserLiked] = useState([]);
  const [surpriseMe, setSurpriseMe] = useState([]);
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
      .then(resJson => {setTopBooksMonth(resJson); console.log(resJson)});       

    fetch(`http://${config.server_host}:${config.server_port}/surprise_me/${user_id}`)
      .then(res => res.json())
      .then(resJson => {
        console.log('Surprise me book ID is:'); 
        console.log(resJson); 
        setSurpriseMe(resJson)});
  }, []);

  // const flexFormat = { 
  //  display: 'flex',
  //  flexDirection: 'row', 
  //  flexWrap: 'wrap', 
  //  justifyContent: 'space-evenly' };

  return (
    // <h1> test</h1>
    <Box mt={11} maxHeight = '100%' maxWidth = '100%' top = {2} left = {0} right = {0} style={{ backgroundColor: teal[50]}}>

    <Container top = {2} left = {0} right = {0} maxWidth = '2000px'>

    <Grid container spacing={10} maxWidth='xl' style={{ 
      backgroundImage: `url(${backGroundImage})`, 
      width: '100%', 
      height: '750px', 
      marginTop: '-80px', 
      marginLeft: '0px', 
      position: 'relative',
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5))'
      }} />
      <Grid item xs={12} sm={12} style={{ 
        width: '100%', 
        height: '100%', 
        paddingTop: '5px', 
        paddingBottom: '50px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div style={{
          position: 'absolute',
          top: '40%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center'
        }}>
          <h2 style={{ fontSize: '75px', color:  '#a2095f', marginTop: '10px', marginBottom: '10px', fontFamily: 'Georgia, serif'}}>Let's Get Reading!</h2>   
          <p style={{ fontSize: '17px', color: '#542603' }}><b><i>Frederick Douglass said, “Once you learn to read, you will be forever free." Cheers to the beginning of what I am sure will be a wonderful journey across gazillions of worlds ...</i></b> </p>

          <div style={{ 
            marginTop: '50px'
          }}>
            <NavLink to={`/book/${surpriseMe.book_id}`} style={{ textDecoration: 'none' }}>
              <Button variant="contained" style={{ color: 'white', fontWeight: 'bold', border: '2px solid #036154', borderRadius: '5px'}} >
                Surprise Me</Button>
            </NavLink>
          </div>
        </div>
      </Grid>
    </Grid>


          {/* backgroundImage: `url(${backGroundImage})`, */}
            <Divider />

            <Divider />
            
            <Grid container spacing={10} maxWidth = 'xl' style={{ backgroundColor: teal[50], width: '100%', margin: 'auto'}}>
              <Grid item xs={12} sm={12} style={{width: '100%', height: '100%', paddingTop : '5px',  paddingBottom : '75px', paddingRight : '80px'}} >
                <h2 style={{ 
                  fontFamily: 'Georgia, serif',
                  fontSize: '36px',
                  fontWeight: 'bold',
                  lineHeight: '1.2',
                  color: '#a2095f',
                  textAlign: 'center',
                }}>Recommended for you</h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
                {recommendedBooks.map((book) => (
                  <NavLink key={book.book_id} to={`/book/${book.book_id}`} style={{ margin: 10 }}>
                    <img src={book.image_url} alt={book.title} style={{ width: 200, height: 300 }} />
                  </NavLink>
                ))}
                </div>
             </Grid>
            </Grid>
            <Divider />

            <Divider />
            <Grid container spacing={10} maxWidth = 'xl' style={{ backgroundColor: 'white', width: '100%', margin: 'auto'}}>
              <Grid item xs={12} sm={12} style={{width: '100%', height: '100%', paddingTop : '5px', paddingRight : '80px',  paddingBottom : '75px'}} >
                <h2 style={{ 
                  fontFamily: 'Georgia, serif',
                  fontSize: '36px',
                  fontWeight: 'bold',
                  lineHeight: '1.2',
                  color: '#a2095f',
                  textAlign: 'center',
                }}><i>Books of the Month</i></h2>
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
                          height: 'auto',
                          display: 'block',
                          maxWidth: '100%',
                          maxHeight: '100%',
                          overflow: 'hidden',
                          width: '100%',
                        }}
                      />
                      <NavLink key={book.book_id} to={`/book/${book.book_id}`} style={{ margin: 10 }}>
                      <img src={book.image_url} alt={book.title} />                      
                      </NavLink>
                    </div>
                  ))}
                </Carousel>
 
              </Grid>
            </Grid>
         <Divider />

         <Divider />
         <Grid container spacing={10} maxWidth='xl' style={{ backgroundColor: teal[50], margin: 'auto'}}>
              <Grid item xs={12} sm={12} style={{width: '100%', height: '100%', paddingTop : '5px',  paddingBottom : '75px', paddingRight : '80px'}} >
                <h2 style={{ 
                  fontFamily: 'Georgia, serif',
                  fontSize: '36px',
                  fontWeight: 'bold',
                  lineHeight: '1.2',
                  color: '#a2095f',
                  textAlign: 'center',
                  width : '1304px'
                }}>Here's what you liked</h2>
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
                          height: 'auto',
                          display: 'block',
                          maxWidth: '100%',
                          overflow: 'hidden',
                          width: '100%',
                        }}
                      />
                      <NavLink key={book.book_id} to={`/book/${book.book_id}`} style={{ margin: 10 }}>
                      <img src={book.image_url} alt={book.title} /> 
                      </NavLink>                     
                    </div>
                  ))}
                </Carousel>
 
              </Grid>
            </Grid>
         <Divider />         
        
    </Container>
    </Box>

  );
};