import { useState } from 'react';
import {
  AppBar,
  Container,
  Toolbar,
  Typography,
  Menu,
  MenuItem,
  Box
} from '@mui/material';
import { NavLink } from 'react-router-dom';

const NavDropdown = ({ options, text, isMain }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };


  return (
    <>
      <Typography
        variant={isMain ? 'h4' : 'h7'}
        noWrap
        style={{
          marginRight: '30px', 
          fontFamily: 'monospace',
          fontWeight: isMain ? 1000 : 700,
          letterSpacing:  isMain ? '.1rem' : '.3rem',
        }}
        onClick={handleClick}
      >
        {text}
      </Typography>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          style: {
            borderRadius: '8px',
            marginTop: '10px',
            minWidth: '150px',
          },
        }}
      >
        {options.map((option) => (
          <MenuItem
            key={option.href}
            onClick={handleClose}
            style={{ backgroundColor: '#f5f5f5' }}
          >
            <NavLink
              to={`${option.href}`}
              style={{
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              {option.text}
            </NavLink>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

const NavText = ({ href, text, isMain, options }) => {
  return options ? (
    <NavDropdown options={options} text={text} isMain={isMain} />
  ) : (
    <Typography
      variant={isMain ? 'h3' : 'h7'}
      noWrap
      style={{
        marginRight: '30px',
        fontFamily: 'monospace',
        fontWeight: isMain ? 1000 : 700,
        letterSpacing:  isMain ? '.1rem' : '.3rem',
      }}
    >
      <NavLink
        to={href}
        style={{
          color: 'inherit',
          textDecoration: 'none',
        }}
      >
        {text}
      </NavLink>
    </Typography>
  );
};

export default function NavBar() {
  const dropdownOptions = [
    { href: '/genre/history', text: 'History' },
    { href: '/genre/historical_fiction', text: 'Historical Fiction' },
    { href: '/genre/biography', text: 'Biography' },
    { href: '/genre/fiction', text: 'Fiction' },
    { href: '/genre/fantasy', text: 'Fantasy' },
    { href: '/genre/paranormal', text: 'Paranormal' },
    { href: '/genre/mystery', text: 'Mystery' },
    { href: '/genre/thriller', text: 'Thriller' },
    { href: '/genre/crime', text: 'Crime' },
    { href: '/genre/poetry', text: 'Poetry' },
    { href: '/genre/non-fiction', text: 'Non Fiction' },
    { href: '/genre/children', text: 'Children' },
    { href: '/genre/young-adult', text: 'Young Adult' },
    { href: '/genre/comics', text: 'Comics' },
    { href: '/genre/graphic', text: 'Graphic' }
  ];

  return (
    <AppBar position='static'>
      <Container maxWidth='xl'>
        <Toolbar disableGutters style={{ display: 'flex', justifyContent: 'space-between'} }>
          <NavText href='/' text='AMAZINGREADS' isMain />
          <Box style={{ display: 'flex', alignItems: 'center' }}>
          <NavText href='/' text='HOME' />
          <NavText options={dropdownOptions} text='GENRES' />
          <NavText href='/authors_ordered' text='AUTHORS' />
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

// import { AppBar, Container, Toolbar, Typography } from '@mui/material'
// import { NavLink } from 'react-router-dom';

// // The hyperlinks in the NavBar contain a lot of repeated formatting code so a
// // helper component NavText local to the file is defined to prevent repeated code.
// const NavText = ({ href, text, isMain }) => {
//   return (
//     <Typography
//       variant={isMain ? 'h5' : 'h7'}
//       noWrap
//       style={{
//         marginRight: '30px',
//         fontFamily: 'monospace',
//         fontWeight: 700,
//         letterSpacing: '.3rem',
//       }}
//     >
//       <NavLink
//         to={href}
//         style={{
//           color: 'inherit',
//           textDecoration: 'none',
//         }}
//       >
//         {text}
//       </NavLink>
//     </Typography>
//   )
// }

// // Here, we define the NavBar. Note that we heavily leverage MUI components
// // to make the component look nice. Feel free to try changing the formatting
// // props to how it changes the look of the component.
// export default function NavBar() {
//   return (
//     <AppBar position='static'>
//       <Container maxWidth='xl'>
//         <Toolbar disableGutters>
//           <NavText href='/' text='AMAZINGREADS' isMain />
//           <NavText href='/albums' text='ALBUMS' />
//           <NavText href='/songs' text='SONGS' />
//         </Toolbar>
//       </Container>
//     </AppBar>
//   );
// }





