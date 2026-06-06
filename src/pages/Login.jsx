import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    InputAdornment,
    TextField,
    Typography,
} from "@mui/material";
import { authApi } from "../api/dispatchApi";

export default function Login() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: "", password: "" });
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [forgotOpen, setForgotOpen] = useState(false);
    const [forgotEmail, setForgotEmail] = useState("");
    const [forgotPassword, setForgotPassword] = useState("");
    const [forgotPasswordConfirm, setForgotPasswordConfirm] = useState("");
    const [forgotLoading, setForgotLoading] = useState(false);
    const [forgotError, setForgotError] = useState("");
    const [forgotSuccess, setForgotSuccess] = useState("");
    const [termsOpen, setTermsOpen] = useState(false);

    const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

    const getErrorMessage = (err, fallback) =>
        err.response?.data?.detail ||
        err.response?.data?.message ||
        err.message ||
        fallback;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const res = await authApi.login(form);
            const token = res.data?.access_token || res.data?.token || res.data?.accessToken;
            const user = res.data?.user;
            if (!token) {
                throw new Error("No se recibio el token de autenticacion.");
            }
            localStorage.setItem("access_token", token);
            if (user) {
                localStorage.setItem("user", JSON.stringify(user));
            }
            if (user?.role?.toUpperCase() === "OPERADOR") {
                setTermsOpen(true);
            } else {
                navigate("/products");
            }
        } catch (err) {
            setError(getErrorMessage(err, "Credenciales incorrectas. Intenta de nuevo."));
        } finally {
            setLoading(false);
        }
    };

    const continueAfterTerms = () => {
        setTermsOpen(false);
        navigate("/dispatches");
    };

    const openForgotPassword = () => {
        setForgotEmail(form.email);
        setForgotPassword("");
        setForgotPasswordConfirm("");
        setForgotError("");
        setForgotSuccess("");
        setForgotOpen(true);
    };

    const handleForgotSubmit = async (e) => {
        e.preventDefault();
        setForgotError("");
        setForgotSuccess("");

        if (forgotPassword !== forgotPasswordConfirm) {
            setForgotError("Las contrasenas no coinciden.");
            return;
        }

        if (forgotPassword.length < 6) {
            setForgotError("La contrasena debe tener al menos 6 caracteres.");
            return;
        }

        setForgotLoading(true);
        try {
            const res = await authApi.forgotPassword({
                email: forgotEmail,
                new_password: forgotPassword,
                confirm_password: forgotPasswordConfirm,
            });
            setForgotSuccess(
                res.data?.message ||
                "Contrasena actualizada correctamente. Ya puedes iniciar sesion."
            );
            setForm((p) => ({ ...p, email: forgotEmail, password: "" }));
            setForgotPassword("");
            setForgotPasswordConfirm("");
        } catch (err) {
            setForgotError(
                getErrorMessage(err, "No se pudo actualizar la contrasena. Intenta nuevamente.")
            );
        } finally {
            setForgotLoading(false);
        }
    };

    const inputSx = {
        "& .MuiOutlinedInput-root": {
            backgroundColor: "#0D1117",
            borderRadius: "10px",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 14,
            color: "#E2E8F0",
            "& fieldset": { borderColor: "#1E293B" },
            "&:hover fieldset": { borderColor: "#334155" },
            "&.Mui-focused fieldset": { borderColor: "#FF6B35" },
        },
        "& .MuiInputLabel-root": {
            color: "#64748B",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 13,
            "&.Mui-focused": { color: "#FF6B35" },
        },
    };

    const dialogPaperSx = {
        backgroundColor: "#0D1117",
        border: "1px solid #1E293B",
        borderRadius: "14px",
        color: "#E2E8F0",
        width: "100%",
        maxWidth: 420,
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                backgroundColor: "#060A10",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                overflow: "hidden",
            }}
        >
            <Box
                sx={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage:
                        "linear-gradient(rgba(255,107,53,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,107,53,0.04) 1px, transparent 1px)",
                    backgroundSize: "40px 40px",
                }}
            />
            <Box
                sx={{
                    position: "absolute",
                    top: "20%",
                    left: "50%",
                    transform: "translate(-50%,-50%)",
                    width: 500,
                    height: 500,
                    borderRadius: "50%",
                    background:
                        "radial-gradient(circle, rgba(255,107,53,0.08) 0%, transparent 70%)",
                    pointerEvents: "none",
                }}
            />

            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    position: "relative",
                    width: "100%",
                    maxWidth: 420,
                    mx: 2,
                    backgroundColor: "#0D1117",
                    border: "1px solid #1E293B",
                    borderRadius: "16px",
                    p: { xs: 3, sm: 4.5 },
                    boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
                }}
            >
                <Box sx={{ textAlign: "center", mb: 4 }}>
                    <Box
                        sx={{
                            width: 56,
                            height: 56,
                            borderRadius: "14px",
                            background: "linear-gradient(135deg, #FF6B35, #FF8C42)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            mx: "auto",
                            mb: 2,
                            boxShadow: "0 8px 24px rgba(255,107,53,0.35)",
                        }}
                    >
                        <i className="lni lni-delivery" style={{ color: "#fff", fontSize: 26 }} />
                    </Box>
                    <Typography
                        sx={{
                            fontFamily: "'DM Sans', sans-serif",
                            fontWeight: 800,
                            fontSize: 22,
                            color: "#F1F5F9",
                        }}
                    >
                        Gestor de Despachos
                    </Typography>
                    <Typography
                        sx={{
                            fontFamily: "'DM Sans', sans-serif",
                            fontSize: 13,
                            color: "#64748B",
                            mt: 0.5,
                        }}
                    >
                        Ingresa tus credenciales para continuar
                    </Typography>
                </Box>

                {error && (
                    <Alert
                        severity="error"
                        sx={{
                            mb: 2.5,
                            backgroundColor: "rgba(239,68,68,0.1)",
                            border: "1px solid rgba(239,68,68,0.3)",
                            color: "#FCA5A5",
                            borderRadius: "10px",
                            fontSize: 13,
                            fontFamily: "'DM Sans', sans-serif",
                            "& .MuiAlert-icon": { color: "#EF4444" },
                        }}
                    >
                        {error}
                    </Alert>
                )}

                <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                    <TextField
                        label="Correo electronico"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        fullWidth
                        autoComplete="email"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <i className="lni lni-user" style={{ color: "#64748B", fontSize: 16 }} />
                                </InputAdornment>
                            ),
                        }}
                        sx={inputSx}
                    />

                    <TextField
                        label="Contrasena"
                        name="password"
                        type={showPass ? "text" : "password"}
                        value={form.password}
                        onChange={handleChange}
                        required
                        fullWidth
                        autoComplete="current-password"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <i className="lni lni-lock-alt" style={{ color: "#64748B", fontSize: 16 }} />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label={showPass ? "Ocultar contrasena" : "Mostrar contrasena"}
                                        onClick={() => setShowPass((p) => !p)}
                                        onMouseDown={(e) => e.preventDefault()}
                                        edge="end"
                                        sx={{ color: "#64748B", "&:hover": { color: "#FF6B35" } }}
                                    >
                                        <i
                                            className={showPass ? "lni lni-eye-off" : "lni lni-eye"}
                                            style={{ fontSize: 16 }}
                                        />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        sx={inputSx}
                    />

                    <Button
                        type="submit"
                        fullWidth
                        disabled={loading}
                        sx={{
                            mt: 0.5,
                            py: 1.5,
                            borderRadius: "10px",
                            background: "linear-gradient(135deg, #FF6B35, #FF8C42)",
                            color: "#fff",
                            fontFamily: "'DM Sans', sans-serif",
                            fontWeight: 700,
                            fontSize: 14,
                            textTransform: "none",
                            letterSpacing: 0.3,
                            boxShadow: "0 4px 20px rgba(255,107,53,0.35)",
                            "&:hover": {
                                background: "linear-gradient(135deg, #E85A24, #FF6B35)",
                                boxShadow: "0 6px 28px rgba(255,107,53,0.5)",
                            },
                            "&:disabled": { opacity: 0.6 },
                        }}
                    >
                        {loading ? (
                            <CircularProgress size={20} sx={{ color: "#fff" }} />
                        ) : (
                            <>
                                <i className="lni lni-enter" style={{ marginRight: 8, fontSize: 16 }} />
                                Iniciar sesion
                            </>
                        )}
                    </Button>

                    <Button
                        type="button"
                        onClick={openForgotPassword}
                        sx={{
                            alignSelf: "center",
                            color: "#94A3B8",
                            fontFamily: "'DM Sans', sans-serif",
                            fontSize: 13,
                            textTransform: "none",
                            "&:hover": {
                                color: "#FF6B35",
                                backgroundColor: "transparent",
                                textDecoration: "underline",
                            },
                        }}
                    >
                        Olvido su contrasena?
                    </Button>
                </Box>
            </Box>

            <Dialog
                open={forgotOpen}
                onClose={() => setForgotOpen(false)}
                PaperProps={{ sx: dialogPaperSx }}
            >
                <Box component="form" onSubmit={handleForgotSubmit}>
                    <DialogTitle
                        sx={{
                            fontFamily: "'DM Sans', sans-serif",
                            fontWeight: 800,
                            pb: 3,
                        }}
                    >
                        Recuperar contrasena
                    </DialogTitle>
                    <DialogContent
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                            pt: '15px',
                        }}
                    >

                        {forgotError && (
                            <Alert severity="error" sx={{ mb: 2, borderRadius: "10px" }}>
                                {forgotError}
                            </Alert>
                        )}

                        {forgotSuccess && (
                            <Alert severity="success" sx={{ mb: 2, borderRadius: "10px" }}>
                                {forgotSuccess}
                            </Alert>
                        )}

                        <TextField
                            label="Correo electronico"
                            value={forgotEmail}
                            onChange={(e) => setForgotEmail(e.target.value)}
                            type="email"
                            required
                            fullWidth
                            autoComplete="email"
                            sx={inputSx}
                        />

                        <TextField
                            label="Contrasena nueva"
                            value={forgotPassword}
                            onChange={(e) => setForgotPassword(e.target.value)}
                            type="password"
                            required
                            fullWidth
                            autoComplete="new-password"
                            sx={inputSx}
                        />

                        <TextField
                            label="Repetir contrasena"
                            value={forgotPasswordConfirm}
                            onChange={(e) => setForgotPasswordConfirm(e.target.value)}
                            type="password"
                            required
                            fullWidth
                            autoComplete="new-password"
                            sx={inputSx}
                        />
                    </DialogContent>
                    <DialogActions sx={{ px: 3, pb: 3 }}>
                        <Button
                            type="button"
                            onClick={() => setForgotOpen(false)}
                            sx={{ color: "#94A3B8", textTransform: "none" }}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={forgotLoading}
                            sx={{
                                minWidth: 120,
                                borderRadius: "10px",
                                background: "linear-gradient(135deg, #FF6B35, #FF8C42)",
                                color: "#fff",
                                textTransform: "none",
                                "&:hover": { background: "linear-gradient(135deg, #E85A24, #FF6B35)" },
                                "&:disabled": { opacity: 0.6 },
                            }}
                        >
                            {forgotLoading ? <CircularProgress size={18} sx={{ color: "#fff" }} /> : "Enviar"}
                        </Button>
                    </DialogActions>
                </Box>
            </Dialog>

            <Dialog open={termsOpen} onClose={continueAfterTerms} PaperProps={{ sx: dialogPaperSx }}>
                <DialogTitle sx={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 800 }}>
                    Terminos y condiciones
                </DialogTitle>
                <DialogContent>
                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", color: "#CBD5E1", fontSize: 14 }}>
                        Al continuar aceptas usar el sistema solo para registrar informacion veraz de productos, puntos de entrega y despachos, proteger tus credenciales y respetar los estados operativos definidos por la empresa.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3 }}>
                    <Button onClick={continueAfterTerms} sx={{ bgcolor: "#FF6B35", color: "#fff", fontWeight: 700, "&:hover": { bgcolor: "#E85A24" } }}>
                        Siguiente
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
