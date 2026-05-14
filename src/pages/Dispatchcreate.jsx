import { useNavigate } from "react-router-dom";
import { Box, Typography, Alert } from "@mui/material";
import { useState } from "react";
import { DispatchForm } from "../components/DispatchForm";
import { dispatchApi } from "../api/dispatchApi";

export default function Dispatchcreate() {
    const navigate = useNavigate();
    const [error, setError] = useState("");

    const handleSave = async (data) => {
        try {
            await dispatchApi.create(data);
            navigate("/dispatches");
        } catch (err) {
            setError(err.response?.data?.detail || "Error al crear el despacho.");
        }
    };

    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: 22, color: "#F1F5F9", letterSpacing: "-0.5px" }}>
                    Nuevo Despacho
                </Typography>
                <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#64748B", mt: 0.3 }}>
                    Completa los datos para registrar un despacho
                </Typography>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 3, bgcolor: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#FCA5A5", borderRadius: "10px", fontFamily: "'DM Sans', sans-serif", "& .MuiAlert-icon": { color: "#EF4444" } }}>
                    {error}
                </Alert>
            )}

            <DispatchForm onSave={handleSave} />
        </Box>
    );
}