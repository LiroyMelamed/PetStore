// src/components/Login.jsx
import React, { useState } from "react";
import { Box, TextField, Button, Card, CardContent, Typography } from "@mui/material";
import { useAuth } from "../context/AuthContext";

export default function Login() {
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        // קריאה ל-API כאן
        login("FAKE_TOKEN");
    };

    return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
            <Card sx={{ width: 400, p: 2 }}>
                <CardContent>
                    <Typography variant="h5" gutterBottom>התחברות</Typography>
                    <form onSubmit={handleSubmit}>
                        <TextField label="אימייל" fullWidth margin="normal" value={email} onChange={(e) => setEmail(e.target.value)} />
                        <TextField label="סיסמה" type="password" fullWidth margin="normal" value={password} onChange={(e) => setPassword(e.target.value)} />
                        <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>התחבר</Button>
                    </form>
                </CardContent>
            </Card>
        </Box>
    );
}
