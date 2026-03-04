import { useState } from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../auth/firebase";
import { Box, Button, Card, CardContent, CircularProgress, Typography, Alert } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import {useNavigate} from "react-router-dom";

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate= useNavigate();

    const handleGoogleSignIn = () => {
        setIsLoading(true);
        setError(null);
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
            .then(() => navigate('/traffic-stats-table'))
            .catch(() => setError("Sign-in failed. Please try again."))
            .finally(() => setIsLoading(false));
    };

    return (
        <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            minHeight="100vh"
            bgcolor="#f5f5f5"
            p={2}
        >
            <Card sx={{ width: "100%", maxWidth: 400 }}>
                <CardContent sx={{ p: 4, textAlign: "center" }}>
                    <Typography variant="h5" fontWeight={600} mb={1}>
                        Welcome to Traffic Statistics
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mb={4}>
                        Please sign in to continue
                    </Typography>

                    <Button
                        fullWidth
                        variant="outlined"
                        onClick={handleGoogleSignIn}
                        disabled={isLoading}
                        startIcon={
                            isLoading ? (
                                <CircularProgress size={18} />
                            ) : <GoogleIcon />
                        }
                    >
                        {isLoading ? "Signing in…" : "Sign in with Google"}
                    </Button>

                    {error && (
                        <Alert severity="error" sx={{ mt: 2, textAlign: "left" }}>
                            {error}
                        </Alert>
                    )}
                </CardContent>
            </Card>
        </Box>
    );
}
