// src/components/Register.jsx
import React, { useState } from "react";
import { Box, TextField, Button, Card, CardContent, Typography, Alert, Stack } from "@mui/material";
import { register as apiRegister, loginEmail } from "../api";
import { useAuth } from "../context/AuthContext";

export default function Register() {
    const { login } = useAuth();
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState("");
    const [ok, setOk] = useState("");

    const onChange = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.value }));

    const onSubmit = async (e) => {
        e.preventDefault();
        setErr(""); setOk("");
        try {
            setLoading(true);
            const res = await apiRegister(form);
            setOk(res?.message || "נרשמת בהצלחה");

            // אם אין טוקן ברישום, ננסה להתחבר אוטומטית
            if (res?.token) {
                login(res.token);
            } else {
                const loginRes = await loginEmail({ email: form.email, password: form.password });
                if (loginRes?.token) login(loginRes.token);
            }
        } catch (e2) {
            const msg = e2?.message || e2?.error || "שגיאה בהרשמה";
            setErr(String(msg));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
            <Card sx={{ width: 420, p: 1 }}>
                <CardContent>
                    <Typography variant="h5" gutterBottom textAlign="center">הרשמה</Typography>
                    <form onSubmit={onSubmit}>
                        <Stack spacing={2}>
                            {err && <Alert severity="error">{err}</Alert>}
                            {ok && <Alert severity="success">{ok}</Alert>}

                            <TextField label="שם מלא" fullWidth value={form.name} onChange={onChange("name")} required />
                            <TextField label="אימייל" type="email" fullWidth value={form.email} onChange={onChange("email")} required />
                            <TextField label="סיסמה" type="password" fullWidth value={form.password} onChange={onChange("password")} required />

                            <Button type="submit" fullWidth variant="contained" disabled={loading}>
                                {loading ? "נרשם..." : "הרשם"}
                            </Button>
                        </Stack>
                    </form>
                </CardContent>
            </Card>
        </Box>
    );
}
