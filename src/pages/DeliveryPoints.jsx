import { useState, useEffect, useCallback } from "react";
import {
    Box,
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    TextField,
    InputAdornment,
    Skeleton,
    Alert,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    CircularProgress,
} from "@mui/material";
import { deliveryApi } from "../api/dispatchApi";

const cellSx = {
    borderBottom: "1px solid #1E293B",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 13,
    color: "#CBD5E1",
    py: 1.8,
};

const FIELD_SX = {
    "& .MuiOutlinedInput-root": {
        backgroundColor: "#0D1117",
        borderRadius: "10px",
        fontSize: 13,
        color: "#E2E8F0",
        fontFamily: "'DM Sans', sans-serif",
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

const EMPTY = { name: "", address: "", city: "", zone: "", receiver_name: "", delivery_schedule: "" };

function DeliveryForm({ open, onClose, onSave, point }) {
    const [form, setForm] = useState(EMPTY);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        setForm(point ? {
            name: point.name || "",
            address: point.address || "",
            city: point.city || "",
            zone: point.zone || "",
            receiver_name: point.receiver_name || "",
            delivery_schedule: point.delivery_schedule || "",
        } : EMPTY);
        setErrors({});
    }, [point, open]);

    const validate = () => {
        const e = {};
        if (!form.name.trim()) e.name = "El nombre es requerido";
        if (!form.address.trim()) e.address = "La direccion es requerida";
        if (!form.city.trim()) e.city = "La ciudad es requerida";
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
        try {
            await onSave({
                name: form.name.trim(),
                address: form.address.trim(),
                city: form.city.trim(),
                zone: form.zone.trim() || null,
                receiver_name: form.receiver_name.trim() || null,
                delivery_schedule: form.delivery_schedule.trim() || null,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { bgcolor: "#0D1117", border: "1px solid #1E293B", borderRadius: "16px" } }}>
            <DialogTitle sx={{ borderBottom: "1px solid #1E293B", pb: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Box sx={{ width: 36, height: 36, borderRadius: "8px", background: "linear-gradient(135deg,#FF6B35,#FF8C42)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <i className={point ? "lni lni-pencil" : "lni lni-map-marker"} style={{ color: "#fff", fontSize: 16 }} />
                    </Box>
                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 16, color: "#F1F5F9" }}>
                        {point ? "Editar Punto de Entrega" : "Nuevo Punto de Entrega"}
                    </Typography>
                </Box>
            </DialogTitle>

            <DialogContent sx={{ pt: 3 }}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                    <TextField label="Nombre del punto" name="name" value={form.name} onChange={handleChange} error={!!errors.name} helperText={errors.name} fullWidth InputProps={{ startAdornment: <InputAdornment position="start"><i className="lni lni-home" style={{ color: "#64748B", fontSize: 15 }} /></InputAdornment> }} sx={FIELD_SX} />
                    <TextField label="Direccion" name="address" value={form.address} onChange={handleChange} error={!!errors.address} helperText={errors.address} fullWidth InputProps={{ startAdornment: <InputAdornment position="start"><i className="lni lni-map" style={{ color: "#64748B", fontSize: 15 }} /></InputAdornment> }} sx={FIELD_SX} />
                    <Box sx={{ display: "flex", gap: 2 }}>
                        <TextField label="Ciudad" name="city" value={form.city} onChange={handleChange} error={!!errors.city} helperText={errors.city} fullWidth InputProps={{ startAdornment: <InputAdornment position="start"><i className="lni lni-map-marker" style={{ color: "#64748B", fontSize: 15 }} /></InputAdornment> }} sx={FIELD_SX} />
                        <TextField label="Zona" name="zone" value={form.zone} onChange={handleChange} fullWidth sx={FIELD_SX} />
                    </Box>
                    <Box sx={{ display: "flex", gap: 2 }}>
                        <TextField label="Recibe" name="receiver_name" value={form.receiver_name} onChange={handleChange} fullWidth InputProps={{ startAdornment: <InputAdornment position="start"><i className="lni lni-user" style={{ color: "#64748B", fontSize: 15 }} /></InputAdornment> }} sx={FIELD_SX} />
                        <TextField label="Horario" name="delivery_schedule" value={form.delivery_schedule} onChange={handleChange} fullWidth InputProps={{ startAdornment: <InputAdornment position="start"><i className="lni lni-timer" style={{ color: "#64748B", fontSize: 15 }} /></InputAdornment> }} sx={FIELD_SX} />
                    </Box>
                </Box>
            </DialogContent>

            <DialogActions sx={{ borderTop: "1px solid #1E293B", px: 3, py: 2, gap: 1.5 }}>
                <Button onClick={onClose} sx={{ color: "#64748B", fontFamily: "'DM Sans', sans-serif", borderRadius: "8px" }}>
                    Cancelar
                </Button>
                <Button onClick={handleSubmit} disabled={loading} sx={{ background: "linear-gradient(135deg,#FF6B35,#FF8C42)", color: "#fff", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 13, borderRadius: "8px", px: 3, "&:hover": { background: "linear-gradient(135deg,#E85A24,#FF6B35)" }, "&:disabled": { opacity: 0.6 } }}>
                    {loading ? <CircularProgress size={16} sx={{ color: "#fff" }} /> : point ? "Guardar cambios" : "Crear punto"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default function Deliverypoints() {
    const [points, setPoints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [formOpen, setFormOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [deleteDialog, setDeleteDialog] = useState(null);

    const fetchPoints = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const res = await deliveryApi.getAll();
            setPoints(Array.isArray(res.data) ? res.data : res.data.items || []);
        } catch (err) {
            setError(err.response?.data?.detail || "Error al cargar los puntos de entrega.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchPoints(); }, [fetchPoints]);

    const filtered = points.filter((p) =>
        [p.name, p.address, p.city, p.zone, p.receiver_name, p.delivery_schedule].some((v) =>
            String(v || "").toLowerCase().includes(search.toLowerCase())
        )
    );

    const handleSave = async (data) => {
        try {
            if (editing) await deliveryApi.update(editing.id, data);
            else await deliveryApi.create(data);
            setFormOpen(false);
            setEditing(null);
            fetchPoints();
        } catch (err) {
            setError(err.response?.data?.detail || "Error al guardar el punto de entrega.");
            throw err;
        }
    };

    const handleDelete = async () => {
        try {
            await deliveryApi.delete(deleteDialog.id);
            setDeleteDialog(null);
            fetchPoints();
        } catch (err) {
            setError(err.response?.data?.detail || "Error al eliminar.");
        }
    };

    return (
        <Box>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3, flexWrap: "wrap", gap: 2 }}>
                <Box>
                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: 22, color: "#F1F5F9" }}>
                        Puntos de Entrega
                    </Typography>
                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#64748B", mt: 0.3 }}>
                        Gestiona los destinos de despacho
                    </Typography>
                </Box>
                <Button onClick={() => { setEditing(null); setFormOpen(true); }} startIcon={<i className="lni lni-circle-plus" style={{ fontSize: 16 }} />} sx={{ background: "linear-gradient(135deg,#FF6B35,#FF8C42)", color: "#fff", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 13, borderRadius: "10px", px: 2.5, py: 1.1, boxShadow: "0 4px 16px rgba(255,107,53,0.3)", "&:hover": { background: "linear-gradient(135deg,#E85A24,#FF6B35)" } }}>
                    Nuevo Punto
                </Button>
            </Box>

            <TextField
                placeholder="Buscar punto de entrega..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                size="small"
                sx={{ mb: 3, width: { xs: "100%", sm: 320 }, "& .MuiOutlinedInput-root": { bgcolor: "#0D1117", borderRadius: "10px", fontSize: 13, color: "#CBD5E1", fontFamily: "'DM Sans', sans-serif", "& fieldset": { borderColor: "#1E293B" }, "&:hover fieldset": { borderColor: "#334155" }, "&.Mui-focused fieldset": { borderColor: "#FF6B35" } } }}
                InputProps={{ startAdornment: <InputAdornment position="start"><i className="lni lni-search-alt" style={{ color: "#64748B", fontSize: 15 }} /></InputAdornment> }}
            />

            {error && <Alert severity="error" sx={{ mb: 2, bgcolor: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#FCA5A5", borderRadius: "10px", fontFamily: "'DM Sans', sans-serif", "& .MuiAlert-icon": { color: "#EF4444" } }}>{error}</Alert>}

            <TableContainer sx={{ bgcolor: "#0D1117", border: "1px solid #1E293B", borderRadius: "14px", overflow: "hidden" }}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ bgcolor: "#060A10" }}>
                            {["Nombre", "Direccion", "Ciudad", "Zona", "Recibe", "Horario", "Acciones"].map((h) => (
                                <TableCell key={h} sx={{ ...cellSx, color: "#475569", fontWeight: 700, fontSize: 11, letterSpacing: 1, textTransform: "uppercase" }}>{h}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i}>{Array.from({ length: 7 }).map((__, j) => <TableCell key={j} sx={cellSx}><Skeleton sx={{ bgcolor: "#1E293B", borderRadius: 1 }} height={20} /></TableCell>)}</TableRow>
                            ))
                        ) : filtered.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} sx={{ ...cellSx, textAlign: "center", py: 6 }}>
                                    <i className="lni lni-map-marker" style={{ color: "#334155", fontSize: 36, display: "block", marginBottom: 8 }} />
                                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", color: "#475569", fontSize: 14 }}>No hay puntos registrados</Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filtered.map((p) => (
                                <TableRow key={p.id} sx={{ "&:hover": { bgcolor: "rgba(255,255,255,0.02)" } }}>
                                    <TableCell sx={{ ...cellSx, fontWeight: 600, color: "#E2E8F0" }}>{p.name}</TableCell>
                                    <TableCell sx={cellSx}>{p.address || "-"}</TableCell>
                                    <TableCell sx={cellSx}>{p.city || "-"}</TableCell>
                                    <TableCell sx={cellSx}>{p.zone || "-"}</TableCell>
                                    <TableCell sx={cellSx}>{p.receiver_name || "-"}</TableCell>
                                    <TableCell sx={cellSx}>{p.delivery_schedule || "-"}</TableCell>
                                    <TableCell sx={cellSx}>
                                        <Box sx={{ display: "flex", gap: 0.5 }}>
                                            <Tooltip title="Editar">
                                                <IconButton size="small" onClick={() => { setEditing(p); setFormOpen(true); }} sx={{ color: "#64748B", "&:hover": { color: "#FF6B35", bgcolor: "rgba(255,107,53,0.1)" }, borderRadius: "8px" }}>
                                                    <i className="lni lni-pencil" style={{ fontSize: 15 }} />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Eliminar">
                                                <IconButton size="small" onClick={() => setDeleteDialog(p)} sx={{ color: "#64748B", "&:hover": { color: "#EF4444", bgcolor: "rgba(239,68,68,0.1)" }, borderRadius: "8px" }}>
                                                    <i className="lni lni-trash" style={{ fontSize: 15 }} />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <DeliveryForm open={formOpen} onClose={() => { setFormOpen(false); setEditing(null); }} onSave={handleSave} point={editing} />

            <Dialog open={!!deleteDialog} onClose={() => setDeleteDialog(null)} PaperProps={{ sx: { bgcolor: "#0D1117", border: "1px solid #1E293B", borderRadius: "14px" } }}>
                <DialogTitle sx={{ fontFamily: "'DM Sans', sans-serif", color: "#F1F5F9", fontWeight: 700 }}>Confirmar eliminacion</DialogTitle>
                <DialogContent>
                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", color: "#94A3B8", fontSize: 14 }}>
                        Deseas eliminar el punto <strong style={{ color: "#F1F5F9" }}>{deleteDialog?.name}</strong>?
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
                    <Button onClick={() => setDeleteDialog(null)} sx={{ color: "#64748B", fontFamily: "'DM Sans', sans-serif", borderRadius: "8px" }}>Cancelar</Button>
                    <Button onClick={handleDelete} sx={{ bgcolor: "#EF4444", color: "#fff", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, borderRadius: "8px", px: 2.5, "&:hover": { bgcolor: "#DC2626" } }}>Eliminar</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
