import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#4caf50', // A shade of green, for a fresh look
        },
        secondary: {
            main: '#ff9800', // A shade of orange for accents
        },
        background: {
            default: '#f4f6f8', // A light grey background
        },
    },
    typography: {
        fontFamily: [
            'Rubik',
            'sans-serif',
        ].join(','),
        h1: {
            fontSize: '2.5rem',
            fontWeight: 500,
        },
        // ... you can add more typography styles here
    },
});

export default theme;