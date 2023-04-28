import { useEffect, useState } from 'react';
import { Box, Button, ButtonGroup, Link, Modal } from '@mui/material';
import { NavLink } from 'react-router-dom';

// import { formatDuration } from '../helpers/formatter';
const config = require('../config.json');

export default function SongCard({ songId, handleClose }) {
    const [bookSeriesData, setBookSeriesInfo] = useState({});
    // const [albumData, setAlbumData] = useState({});
  
    // const [barRadar, setBarRadar] = useState(true);

}