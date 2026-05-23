import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Box,
    Typography,
    CircularProgress,
    InputAdornment,
} from "@mui/material";
import { useState, useEffect } from "react";

const FIELD_SX = {
    "& .MuiOutlinedInput-root": {
        backgroundColor: "#0D1117",
        borderRadius: "10px",
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 13,
        color: "#F1F5F9",
        "& fieldset": { borderColor: "#334155" },
        "&:hover fieldset": { borderColor: "#64748B" },
        "&.Mui-focused fieldset": { borderColor: "#FF6B35" },
    },
    "& .MuiInputLabel-root": {
        color: "#CBD5E1",
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 13,
        "&.Mui-focused": { color: "#F8FAFC" },
    },
};

const EMPTY = { sku: "", name: "", stock: "", unit: "" };

export default function ProductForm({ open, onClose, onSave, product }) {
    const [form, setForm] = useState(EMPTY);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (product) {
            setForm({
                sku: product.sku || "",
                name: product.name || "",
                stock: product.stock ?? "",
                unit: product.unit || "",
            });
        } else {
            setForm(EMPTY);
        }
        setErrors({});
    }, [product, open]);

    const validate = () => {
        const e = {};
        if (!product && !form.sku.trim()) e.sku = "El SKU es requerido";
        if (!form.name.trim()) e.name = "El nombre es requerido";
        if (form.stock === "" || isNaN(form.stock) || Number(form.stock) < 0) e.stock = "Stock invalido";
        if (!form.unit.trim()) e.unit = "La unidad es requerida";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleChange = (e) => {
        setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
        setErrors((p) => ({ ...p, [e.target.name]: undefined }));
    };

    const handleSubmit = async () => {
        if (!validate()) return;
        setLoading(true);
        const payload = {
            name: form.name.trim(),
            stock: parseInt(form.stock, 10),
            unit: form.unit.trim(),
        };
        if (!product) payload.sku = form.sku.trim();

        try {
            await onSave(payload);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    backgroundColor: "#0D1117",
                    border: "1px solid #1E293B",
                    borderRadius: "16px",
                    boxShadow: "0 24px 64px rgba(0,0,0,0.7)",
                },
            }}
        >
            <DialogTitle sx={{ borderBottom: "1px solid #1E293B", pb: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Box
                        sx={{
                            width: 36,
                            height: 36,
                            borderRadius: "8px",
                            background: "linear-gradient(135deg,#FF6B35,#FF8C42)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <i
                            className={product ? "lni lni-pencil" : "lni lni-circle-plus"}
                            style={{ color: "#fff", fontSize: 16 }}
                        />
                    </Box>
                    <Box>
                        <Typography
                            sx={{
                                fontFamily: "'DM Sans', sans-serif",
                                fontWeight: 700,
                                fontSize: 16,
                                color: "#F1F5F9",
                            }}
                        >
                            {product ? "Editar Producto" : "Nuevo Producto"}
                        </Typography>
                        <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#64748B" }}>
                            {product ? `SKU: ${product.sku}` : "Completa los datos del producto"}
                        </Typography>
                    </Box>
                </Box>
            </DialogTitle>

            <DialogContent sx={{ pt: "24px !important" }}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                    {!product && (
                        <TextField
                            label="SKU"
                            name="sku"
                            value={form.sku}
                            onChange={handleChange}
                            error={!!errors.sku}
                            helperText={errors.sku}
                            fullWidth
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <i className="lni lni-bar-code" style={{ color: "#64748B", fontSize: 15 }} />
                                    </InputAdornment>
                                ),
                            }}
                            sx={FIELD_SX}
                        />
                    )}

                    <TextField
                        label="Nombre del producto"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        error={!!errors.name}
                        helperText={errors.name}
                        fullWidth
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <i className="lni lni-tag" style={{ color: "#64748B", fontSize: 15 }} />
                                </InputAdornment>
                            ),
                        }}
                        sx={FIELD_SX}
                    />

                    <Box sx={{ display: "flex", gap: 2 }}>
                        <TextField
                            label="Stock"
                            name="stock"
                            value={form.stock}
                            onChange={handleChange}
                            error={!!errors.stock}
                            helperText={errors.stock}
                            type="number"
                            fullWidth
                            inputProps={{ min: 0 }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <i className="lni lni-layers" style={{ color: "#64748B", fontSize: 15 }} />
                                    </InputAdornment>
                                ),
                            }}
                            sx={FIELD_SX}
                        />
                        <TextField
                            label="Unidad"
                            name="unit"
                            value={form.unit}
                            onChange={handleChange}
                            error={!!errors.unit}
                            helperText={errors.unit}
                            fullWidth
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <i className="lni lni-ruler" style={{ color: "#64748B", fontSize: 15 }} />
                                    </InputAdornment>
                                ),
                            }}
                            sx={FIELD_SX}
                        />
                    </Box>
                </Box>
            </DialogContent>

            <DialogActions sx={{ borderTop: "1px solid #1E293B", px: 3, py: 2, gap: 1.5 }}>
                <Button
                    onClick={onClose}
                    sx={{
                        color: "#64748B",
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: 13,
                        textTransform: "none",
                        borderRadius: "8px",
                        px: 2,
                        "&:hover": { backgroundColor: "rgba(255,255,255,0.04)", color: "#94A3B8" },
                    }}
                >
                    Cancelar
                </Button>
                <Button
                    onClick={handleSubmit}
                    disabled={loading}
                    sx={{
                        background: "linear-gradient(135deg,#FF6B35,#FF8C42)",
                        color: "#fff",
                        fontFamily: "'DM Sans', sans-serif",
                        fontWeight: 700,
                        fontSize: 13,
                        textTransform: "none",
                        borderRadius: "8px",
                        px: 3,
                        boxShadow: "0 4px 16px rgba(255,107,53,0.35)",
                        "&:hover": { background: "linear-gradient(135deg,#E85A24,#FF6B35)" },
                        "&:disabled": { opacity: 0.6 },
                    }}
                >
                    {loading ? <CircularProgress size={16} sx={{ color: "#fff" }} /> : <>{product ? "Guardar cambios" : "Crear producto"}</>}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
