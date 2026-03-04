import { useState } from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../auth/firebase";
import { Alert, Box, Button, CircularProgress, Typography } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import { BarChartOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleGoogleSignIn = () => {
        setIsLoading(true);
        setError(null);
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
            .then(() => navigate("/traffic-stats-table"))
            .catch(() => setError("Sign-in failed. Please try again."))
            .finally(() => setIsLoading(false));
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, #0d47a1 0%, #1565c0 40%, #1e88e5 75%, #64b5f6 100%)",
                p: 2,
            }}
        >
            <Box
                sx={{
                    width: "100%",
                    maxWidth: { xs: 400, sm: 480, md: 520 },
                    bgcolor: "white",
                    borderRadius: 4,
                    overflow: "hidden",
                    boxShadow: "0 24px 64px rgba(0,0,0,0.25)",
                }}
            >
                <Box sx={{ height: 5, background: "linear-gradient(90deg, #1565c0, #42a5f5)" }} />

                <Box sx={{ px: { xs: 4, sm: 5, md: 6 }, pt: 4, pb: 4.5, textAlign: "center" }}>
                    {/* Icon */}
                    <Box
                        sx={{
                            width: 56,
                            height: 56,
                            borderRadius: "50%",
                            background: "linear-gradient(135deg, #1565c0, #42a5f5)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            mx: "auto",
                            mb: 2.5,
                            boxShadow: "0 8px 20px rgba(21,101,192,0.35)",
                        }}
                    >
                        <BarChartOutlined sx={{ color: "white", fontSize: 28 }} />
                    </Box>

                    <Typography variant="h5" fontWeight={700} color="text.primary" mb={0.75}>
                        Traffic Statistics
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mb={3.5}>
                        Please sign in to access the website
                    </Typography>

                    <Button
                        fullWidth
                        variant="outlined"
                        onClick={handleGoogleSignIn}
                        disabled={isLoading}
                        startIcon={isLoading ? <CircularProgress size={18} /> : <GoogleIcon />}
                        sx={{
                            py: 1.3,
                            borderRadius: 2.5,
                            borderColor: "#dadce0",
                            color: "text.primary",
                            fontWeight: 600,
                            fontSize: "0.9rem",
                            textTransform: "none",
                            boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                            "&:hover": {
                                borderColor: "#1565c0",
                                bgcolor: "rgba(21,101,192,0.04)",
                                boxShadow: "0 2px 8px rgba(21,101,192,0.15)",
                            },
                            "&.Mui-disabled": {
                                borderColor: "#dadce0",
                            },
                        }}
                    >
                        {isLoading ? "Signing in…" : "Sign in with Google"}
                    </Button>

                    {error && (
                        <Alert severity="error" sx={{ mt: 2, borderRadius: 2, textAlign: "left" }}>
                            {error}
                        </Alert>
                    )}
                </Box>
            </Box>
        </Box>
    );
}