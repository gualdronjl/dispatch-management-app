import { useCallback, useEffect, useState } from "react";
import {
    Alert,
    Box,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    MenuItem,
    Skeleton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from "@mui/material";
import { driverApi } from "../api/dispatchApi";
import { isAdmin } from "../utils/auth";

const EMPTY = {
    email: "",
    full_name: "",
    phone: "",
    cc: "",
    plate: "",
    license_expiration_date: "",
    license_type: "C1",
    license_number: "",
    status: "ACTIVO",
};

const cellSx = {
    borderBottom: "1px solid #1E293B",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 13,
    color: "#CBD5E1",
    py: 1.7,
};

const fieldSx = {
    "& .MuiOutlinedInput-root": {
        backgroundColor: "#0D1117",
        borderRadius: "10px",
        fontSize: 13,
        color: "#F1F5F9",
        fontFamily: "'DM Sans', sans-serif",
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

function statusColor(status) {
    if (status === "ACTIVO") return { bg: "rgba(34,197,94,0.12)", color: "#4ADE80" };
    if (status === "SUSPENDIDO") return { bg: "rgba(234,179,8,0.12)", color: "#FDE047" };
    return { bg: "rgba(239,68,68,0.12)", color: "#FCA5A5" };
}

function DriverForm({ open, driver, onClose, onSave }) {
    const [form, setForm] = useState(EMPTY);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        setForm(driver ? {
            email: driver.email || "",
            full_name: driver.full_name || "",
            phone: driver.phone || "",
            cc: driver.cc || "",
            plate: driver.plate || "",
            license_expiration_date: driver.license_expiration_date || "",
            license_type: driver.license_type || "",
            license_number: driver.license_number || "",
            status: driver.status || "ACTIVO",
        } : EMPTY);
    }, [driver, open]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        let newValue = value;
        if (name === "email") {
            newValue = value.trim().toLowerCase();
        }
        if (name === "phone") {
            newValue = value.replace(/\D/g, "").slice(0, 10);
        }
        if (name === "plate") {
            newValue = value
                .toUpperCase()
                .replace(/[^A-Z0-9]/g, "")
                .slice(0, 6);
        }
        if (name === "license_number") {
            newValue = value.replace(/\D/g, "").slice(0, 15);
        }
        setForm((prev) => ({ ...prev, [name]: newValue }));
    };

    const handleSubmit = async () => {
        setSaving(true);
        try {
            await onSave({
                ...form,
                plate: form.plate.trim().toUpperCase(),
                full_name: form.full_name.trim(),
                phone: form.phone.trim(),
                cc: form.cc.trim(),
                license_type: form.license_type.trim(),
                license_number: form.license_number.trim(),
            });
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { bgcolor: "#0D1117", border: "1px solid #1E293B", borderRadius: "16px" } }}>
            <DialogTitle sx={{ color: "#F8FAFC", fontFamily: "'DM Sans', sans-serif", fontWeight: 800 }}>
                {driver ? "Editar conductor" : "Nuevo conductor"}
            </DialogTitle>
            <DialogContent sx={{ pt: "20px !important" }}>
                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
                    <TextField label="Email" name="email" value={form.email} onChange={handleChange} sx={fieldSx} />
                    <TextField label="Nombre completo" name="full_name" value={form.full_name} onChange={handleChange} sx={fieldSx} />
                    <TextField label="Telefono" name="phone" value={form.phone} onChange={handleChange} sx={fieldSx} />
                    <TextField label="CC" name="cc" value={form.cc} onChange={handleChange} sx={fieldSx} />
                    <TextField
                        label="Placa"
                        name="plate"
                        value={
                            form.plate.length >= 6
                                ? `${form.plate.slice(0, 3)} - ${form.plate.slice(3)}`
                                : form.plate
                        }
                        onChange={handleChange}
                        sx={fieldSx}
                    />
                    <TextField label="Fecha expiracion licencia" name="license_expiration_date" type="date" value={form.license_expiration_date} onChange={handleChange} InputLabelProps={{ shrink: true }} sx={fieldSx} />
                    <TextField
                        select
                        label="Tipo de licencia"
                        name="license_type"
                        value={form.license_type}
                        onChange={handleChange}
                        sx={fieldSx}
                    >
                        <MenuItem value="A1">A1 - Moto hasta 125 cc</MenuItem>
                        <MenuItem value="A2">A2 - Moto más de 125 cc</MenuItem>
                        <MenuItem value="B1">B1 - Automóvil particular</MenuItem>
                        <MenuItem value="B2">B2 - Camión o bus particular</MenuItem>
                        <MenuItem value="B3">B3 - Vehículo articulado particular</MenuItem>
                        <MenuItem value="C1">C1 - Automóvil servicio público</MenuItem>
                        <MenuItem value="C2">C2 - Camión o bus servicio público</MenuItem>
                        <MenuItem value="C3">C3 - Vehículo articulado servicio público</MenuItem>
                    </TextField>
                    <TextField label="Numero de licencia" name="license_number" value={form.license_number} onChange={handleChange} sx={fieldSx} />
                    <TextField select label="Estado" name="status" value={form.status} onChange={handleChange} sx={fieldSx}>
                        <MenuItem value="ACTIVO">Activo</MenuItem>
                        <MenuItem value="INACTIVO">Inactivo</MenuItem>
                        <MenuItem value="SUSPENDIDO">Suspendido</MenuItem>
                    </TextField>
                </Box>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button onClick={onClose} sx={{ color: "#CBD5E1" }}>Cancelar</Button>
                <Button onClick={handleSubmit} disabled={saving} sx={{ bgcolor: "#FF6B35", color: "#fff", fontWeight: 700, "&:hover": { bgcolor: "#E85A24" } }}>
                    Guardar
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default function Drivers() {
    const canEdit = isAdmin();
    const [drivers, setDrivers] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [formOpen, setFormOpen] = useState(false);
    const [editing, setEditing] = useState(null);

    const fetchDrivers = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const params = search.trim() ? { search: search.trim(), limit: 100 } : { limit: 100 };
            const res = await driverApi.getAll(params);
            setDrivers(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            setError(err.response?.data?.detail || "Error al cargar conductores.");
        } finally {
            setLoading(false);
        }
    }, [search]);

    useEffect(() => {
        const id = setTimeout(fetchDrivers, 250);
        return () => clearTimeout(id);
    }, [fetchDrivers]);

    const handleSave = async (data) => {
        try {
            if (editing) await driverApi.update(editing.id, data);
            else await driverApi.create(data);
            setFormOpen(false);
            setEditing(null);
            fetchDrivers();
        } catch (err) {
            setError(err.response?.data?.detail || "Error al guardar conductor.");
        }
    };

    const handleDeactivate = async (driver) => {
        try {
            await driverApi.delete(driver.id);
            fetchDrivers();
        } catch (err) {
            setError(err.response?.data?.detail || "Error al desactivar conductor.");
        }
    };

    return (
        <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2, mb: 3, flexWrap: "wrap" }}>
                <Box>
                    <Typography sx={{ color: "#F8FAFC", fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: 23 }}>
                        Conductores
                    </Typography>
                    <Typography sx={{ color: "#94A3B8", fontFamily: "'DM Sans', sans-serif", fontSize: 13 }}>
                        Conductores asociados a placas vehiculares
                    </Typography>
                </Box>
                {canEdit && (
                    <Button onClick={() => { setEditing(null); setFormOpen(true); }} sx={{ bgcolor: "#FF6B35", color: "#fff", fontWeight: 700, borderRadius: "10px", "&:hover": { bgcolor: "#E85A24" } }}>
                        Nuevo conductor
                    </Button>
                )}
            </Box>

            <TextField
                placeholder="Buscar por nombre, placa, CC, telefono o licencia..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                size="small"
                sx={{ mb: 3, width: { xs: "100%", sm: 420 }, ...fieldSx }}
            />

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <TableContainer sx={{ bgcolor: "#0D1117", border: "1px solid #1E293B", borderRadius: "14px" }}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ bgcolor: "#060A10" }}>
                            {["Nombre", "Email", "Telefono", "CC", "Placa", "Licencia", "Vence", "Estado", "Acciones"].map((h) => (
                                <TableCell key={h} sx={{ ...cellSx, color: "#94A3B8", fontWeight: 800, fontSize: 11, textTransform: "uppercase" }}>{h}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? Array.from({ length: 5 }).map((_, i) => (
                            <TableRow key={i}>{Array.from({ length: 9 }).map((__, j) => <TableCell key={j} sx={cellSx}><Skeleton sx={{ bgcolor: "#1E293B" }} /></TableCell>)}</TableRow>
                        )) : drivers.length === 0 ? (
                            <TableRow><TableCell colSpan={9} sx={{ ...cellSx, textAlign: "center", py: 5 }}>No hay conductores registrados</TableCell></TableRow>
                        ) : drivers.map((driver) => {
                            const sc = statusColor(driver.status);
                            return (
                                <TableRow key={driver.id}>
                                    <TableCell sx={{ ...cellSx, color: "#F1F5F9", fontWeight: 700 }}>{driver.full_name}</TableCell>
                                    <TableCell sx={cellSx}>{driver.email} </TableCell>
                                    <TableCell sx={cellSx}>{driver.phone}</TableCell>
                                    <TableCell sx={cellSx}>{driver.cc}</TableCell>
                                    <TableCell sx={{ ...cellSx, color: "#F8FAFC", fontWeight: 800 }}>{driver.plate}</TableCell>
                                    <TableCell sx={cellSx}>{driver.license_type} - {driver.license_number}</TableCell>
                                    <TableCell sx={cellSx}>{driver.license_expiration_date}</TableCell>
                                    <TableCell sx={cellSx}><Chip size="small" label={driver.status} sx={{ bgcolor: sc.bg, color: sc.color, fontWeight: 700 }} /></TableCell>
                                    <TableCell sx={cellSx}>
                                        {canEdit ? (
                                            <Box sx={{ display: "flex", gap: 0.5 }}>
                                                <IconButton size="small" onClick={() => { setEditing(driver); setFormOpen(true); }} sx={{ color: "#FF6B35" }}>
                                                    <i className="lni lni-pencil" style={{ fontSize: 15 }} />
                                                </IconButton>
                                                <IconButton size="small" onClick={() => handleDeactivate(driver)} sx={{ color: "#EF4444" }}>
                                                    <i className="lni lni-ban" style={{ fontSize: 15 }} />
                                                </IconButton>
                                            </Box>
                                        ) : (
                                            <Typography sx={{ color: "#94A3B8", fontSize: 12 }}>Solo lectura</Typography>
                                        )}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>

            <DriverForm open={formOpen} driver={editing} onClose={() => { setFormOpen(false); setEditing(null); }} onSave={handleSave} />
        </Box>
    );
}
