// src/components/Login.jsx
import React, { useState } from "react";
import {
    Box, TextField, Button, Card, CardContent, Typography, Tabs, Tab, Alert, Stack
} from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { loginEmail, requestOtp, verifyOtp } from "../api";

export default function Login() {
    const { login } = useAuth();
    const [tab, setTab] = useState(0);

    // Email+Password
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailLoading, setEmailLoading] = useState(false);
    const [emailErr, setEmailErr] = useState("");

    // Phone OTP
    const [phone, setPhone] = useState("");
    const [code, setCode] = useState("");
    const [otpStage, setOtpStage] = useState("request"); // request | verify
    const [otpLoading, setOtpLoading] = useState(false);
    const [otpMsg, setOtpMsg] = useState("");
    const [otpErr, setOtpErr] = useState("");

    const handleEmailLogin = async (e) => {
        e.preventDefault();
        setEmailErr("");
        try {
            setEmailLoading(true);
            const data = await loginEmail({ email, password });
            if (data?.token) login(data.token);
        } catch (e2) {
            const msg = e2?.message || e2?.error || "שגיאה בהתחברות";
            setEmailErr(String(msg));
        } finally {
            setEmailLoading(false);
        }
    };

    const handleOtpRequest = async () => {
        setOtpErr(""); setOtpMsg("");
        try {
            setOtpLoading(true);
            const data = await requestOtp(phone);
            setOtpMsg(data?.message || "נשלח קוד אימות");
            setOtpStage("verify");
        } catch (e2) {
            const msg = e2?.message || e2?.error || "שגיאה בשליחת קוד";
            setOtpErr(String(msg));
        } finally {
            setOtpLoading(false);
        }
    };

    const handleOtpVerify = async () => {
        setOtpErr(""); setOtpMsg("");
        try {
            setOtpLoading(true);
            const data = await verifyOtp(phone, code);
            if (data?.token) login(data.token);
        } catch (e2) {
            const msg = e2?.message || e2?.error || "קוד לא תקין";
            setOtpErr(String(msg));
        } finally {
            setOtpLoading(false);
        }
    };

    return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
            <Card sx={{ width: 420, p: 1 }}>
                <CardContent>
                    <Typography variant="h5" gutterBottom textAlign="center">התחברות</Typography>

                    <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="fullWidth" sx={{ mb: 2 }}>
                        <Tab label="מייל + סיסמה" />
                        <Tab label="פלאפון (OTP)" />
                    </Tabs>

                    {tab === 0 && (
                        <form onSubmit={handleEmailLogin}>
                            <Stack spacing={2}>
                                {emailErr && <Alert severity="error">{emailErr}</Alert>}
                                <TextField
                                    label="אימייל"
                                    type="email"
                                    fullWidth
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <TextField
                                    label="סיסמה"
                                    type="password"
                                    fullWidth
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <Button type="submit" fullWidth variant="contained" disabled={emailLoading}>
                                    {emailLoading ? "מתחבר..." : "התחבר"}
                                </Button>
                            </Stack>
                        </form>
                    )}

                    {tab === 1 && (
                        <Stack spacing={2}>
                            {otpErr && <Alert severity="error">{otpErr}</Alert>}
                            {otpMsg && <Alert severity="success">{otpMsg}</Alert>}

                            <TextField
                                label="מספר פלאפון (כולל קידומת)"
                                placeholder="05X-XXXXXXX"
                                fullWidth
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />

                            {otpStage === "request" ? (
                                <Button variant="contained" onClick={handleOtpRequest} disabled={otpLoading || !phone}>
                                    {otpLoading ? "שולח..." : "שלח קוד"}
                                </Button>
                            ) : (
                                <>
                                    <TextField
                                        label="קוד שהתקבל ב-SMS"
                                        fullWidth
                                        value={code}
                                        onChange={(e) => setCode(e.target.value)}
                                    />
                                    <Button variant="contained" onClick={handleOtpVerify} disabled={otpLoading || !code}>
                                        {otpLoading ? "מאמת..." : "אמת והתחבר"}
                                    </Button>
                                    <Button variant="text" onClick={() => { setOtpStage("request"); setCode(""); }}>
                                        שליחה מחדש
                                    </Button>
                                </>
                            )}
                        </Stack>
                    )}
                </CardContent>
            </Card>
        </Box>
    );
}
