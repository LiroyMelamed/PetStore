// src/theme.js
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
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
        fontFamily: "Rubik, Arial, sans-serif",
        h1: { fontWeight: 700 },
        h2: { fontWeight: 600 },
        button: { textTransform: "none" },
    },
});

export default theme;
