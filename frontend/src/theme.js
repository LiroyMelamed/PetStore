// src/theme.js
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    direction: localStorage.getItem('i18nextLng') === 'he' ? 'rtl' : 'ltr',
    palette: {
        primary: {
            main: "#1976d2", // כחול מודרני
        },
        secondary: {
            main: "#f50057", // ורוד/אדום מודרני
        },
        background: {
            default: "#f9f9f9", // רקע אפור בהיר
            paper: "#ffffff",
        },
        text: {
            primary: "#212121",
            secondary: "#757575",
        },
    },
    typography: {
        fontFamily: "'Rubik', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        h1: {
            fontWeight: 700,
            fontSize: "2.25rem",
            lineHeight: 1.2,
        },
        h2: {
            fontWeight: 600,
            fontSize: "1.875rem",
            lineHeight: 1.2,
        },
        h3: {
            fontWeight: 600,
            fontSize: "1.5rem",
            lineHeight: 1.2,
        },
        h4: {
            fontWeight: 600,
            fontSize: "1.25rem",
        },
        body1: {
            fontSize: "1rem",
            lineHeight: 1.6,
        },
        body2: {
            fontSize: "0.875rem",
            lineHeight: 1.6,
        },
        button: {
            textTransform: "none",
            fontWeight: 600,
            fontSize: "1rem",
        },
    },
    shape: {
        borderRadius: 0.875 * 16, // 14px
    },
    spacing: (factor) => `${0.25 * factor}rem`, // 4px base unit (rem)
    breakpoints: {
        values: {
            xs: 0,
            sm: 640,
            md: 960,
            lg: 1200,
            xl: 1440,
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    fontWeight: 600,
                    borderRadius: '0.625rem',
                    padding: '0.5rem 0.875rem',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                        transform: 'translateY(-0.125rem)',
                    },
                },
                sizeMedium: {
                    padding: '0.75rem 1rem',
                },
                sizeLarge: {
                    padding: '1rem 1.5rem',
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: '0.625rem',
                        '& fieldset': {
                            borderWidth: '0.0625rem',
                        },
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: '0.875rem',
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: '0.875rem',
                    border: '0.0625rem solid #E5E7EB',
                    boxShadow: '0 0.625rem 1.875rem rgba(17, 24, 39, 0.06)',
                },
            },
        },
    },
});

export default theme;
