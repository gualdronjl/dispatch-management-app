import { Fragment, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
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
    Chip,
    Skeleton,
    Alert,
    Select,
    MenuItem,
    FormControl,
    Collapse,
} from "@mui/material";
import { dispatchApi } from "../api/dispatchApi";

const cellSx = {
    borderBottom: "1px solid #1E293B",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 13,
    color: "#CBD5E1",
    py: 1.8,
};

const STATUS_CONFIG = {
    PENDIENTE: { label: "Pendiente", bg: "rgba(234,179,8,0.12)", color: "#FDE047", icon: "lni lni-timer" },
    ENVIADO: { label: "Enviado", bg: "rgba(59,130,246,0.12)", color: "#93C5FD", icon: "lni lni-delivery" },
    ENTREGADO: { label: "Entregado", bg: "rgba(34,197,94,0.12)", color: "#4ADE80", icon: "lni lni-checkmark-circle" },
    CANCELADO: { label: "Cancelado", bg: "rgba(239,68,68,0.12)", color: "#FCA5A5", icon: "lni lni-close" },
};

const STATUS_OPTIONS = Object.entries(STATUS_CONFIG).map(([value, config]) => ({ value, ...config }));

export default function Dispatchlist() {
    const navigate = useNavigate();
    const [dispatches, setDispatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [expandedId, setExpandedId] = useState(null);

    const fetchDispatches = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const params = statusFilter === "all" ? undefined : { status: statusFilter };
            const res = await dispatchApi.getAll(params);
            setDispatches(Array.isArray(res.data) ? res.data : res.data.items || []);
        } catch (err) {
            setError(err.response?.data?.detail || "Error al cargar los despachos.");
        } finally {
            setLoading(false);
        }
    }, [statusFilter]);

    useEffect(() => { fetchDispatches(); }, [fetchDispatches]);

    const handleStatusChange = async (id, status) => {
        try {
            await dispatchApi.updateStatus(id, status);
            fetchDispatches();
        } catch (err) {
            setError(err.response?.data?.detail || "Error al actualizar estado.");
        }
    };

    const filtered = dispatches.filter((d) =>
        [d.id, d.delivery_point_id, d.created_by, d.status].some((v) =>
            String(v || "").toLowerCase().includes(search.toLowerCase())
        )
    );

    const allowedStatuses = (status) => {
        if (status === "PENDIENTE") return ["PENDIENTE", "ENVIADO", "CANCELADO"];
        if (status === "ENVIADO") return ["ENVIADO", "ENTREGADO", "CANCELADO"];
        return [status];
    };

    const StatusChip = ({ status }) => {
        const cfg = STATUS_CONFIG[status] || { label: status, bg: "#1E293B", color: "#94A3B8", icon: "lni lni-question-circle" };
        return (
            <Chip
                label={<><i className={cfg.icon} style={{ marginRight: 4, fontSize: 11 }} />{cfg.label}</>}
                size="small"
                sx={{ bgcolor: cfg.bg, color: cfg.color, fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 11, height: 24, "& .MuiChip-label": { display: "flex", alignItems: "center" } }}
            />
        );
    };

    return (
        <Box>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3, flexWrap: "wrap", gap: 2 }}>
                <Box>
                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: 22, color: "#F1F5F9" }}>
                        Despachos
                    </Typography>
                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#64748B", mt: 0.3 }}>
                        Historial y estado de todos los despachos
                    </Typography>
                </Box>
                <Button onClick={() => navigate("/dispatches/new")} startIcon={<i className="lni lni-circle-plus" style={{ fontSize: 16 }} />} sx={{ background: "linear-gradient(135deg,#FF6B35,#FF8C42)", color: "#fff", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 13, borderRadius: "10px", px: 2.5, py: 1.1, boxShadow: "0 4px 16px rgba(255,107,53,0.3)", "&:hover": { background: "linear-gradient(135deg,#E85A24,#FF6B35)" } }}>
                    Nuevo Despacho
                </Button>
            </Box>

            <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
                <TextField
                    placeholder="Buscar despacho..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    size="small"
                    sx={{ width: { xs: "100%", sm: 280 }, "& .MuiOutlinedInput-root": { bgcolor: "#0D1117", borderRadius: "10px", fontSize: 13, color: "#CBD5E1", fontFamily: "'DM Sans', sans-serif", "& fieldset": { borderColor: "#1E293B" }, "&:hover fieldset": { borderColor: "#334155" }, "&.Mui-focused fieldset": { borderColor: "#FF6B35" } } }}
                    InputProps={{ startAdornment: <InputAdornment position="start"><i className="lni lni-search-alt" style={{ color: "#64748B", fontSize: 15 }} /></InputAdornment> }}
                />
                <FormControl size="small" sx={{ minWidth: 160 }}>
                    <Select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        sx={{ bgcolor: "#0D1117", borderRadius: "10px", fontSize: 13, color: "#CBD5E1", fontFamily: "'DM Sans', sans-serif", "& .MuiOutlinedInput-notchedOutline": { borderColor: "#1E293B" }, "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#334155" }, "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#FF6B35" }, "& .MuiSvgIcon-root": { color: "#64748B" } }}
                        MenuProps={{ PaperProps: { sx: { bgcolor: "#0D1117", border: "1px solid #1E293B", borderRadius: "10px" } } }}
                    >
                        <MenuItem value="all" sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#CBD5E1" }}>Todos los estados</MenuItem>
                        {STATUS_OPTIONS.map((s) => (
                            <MenuItem key={s.value} value={s.value} sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: s.color }}>
                                <i className={s.icon} style={{ marginRight: 8 }} />{s.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 2, bgcolor: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#FCA5A5", borderRadius: "10px", fontFamily: "'DM Sans', sans-serif", "& .MuiAlert-icon": { color: "#EF4444" } }}>{error}</Alert>}

            <TableContainer sx={{ bgcolor: "#0D1117", border: "1px solid #1E293B", borderRadius: "14px", overflow: "hidden" }}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ bgcolor: "#060A10" }}>
                            {["", "ID", "Punto de Entrega", "Fecha", "Estado", "Productos"].map((h) => (
                                <TableCell key={h} sx={{ ...cellSx, color: "#475569", fontWeight: 700, fontSize: 11, letterSpacing: 1, textTransform: "uppercase", py: 1.5 }}>{h}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i}>{Array.from({ length: 6 }).map((__, j) => <TableCell key={j} sx={cellSx}><Skeleton sx={{ bgcolor: "#1E293B", borderRadius: 1 }} height={20} /></TableCell>)}</TableRow>
                            ))
                        ) : filtered.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} sx={{ ...cellSx, textAlign: "center", py: 6 }}>
                                    <i className="lni lni-delivery" style={{ color: "#334155", fontSize: 36, display: "block", marginBottom: 8 }} />
                                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", color: "#475569", fontSize: 14 }}>No hay despachos registrados</Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filtered.map((d) => (
                                <Fragment key={d.id}>
                                    <TableRow key={d.id} sx={{ "&:hover": { bgcolor: "rgba(255,255,255,0.02)" } }}>
                                        <TableCell sx={{ ...cellSx, py: 1 }}>
                                            <IconButton size="small" onClick={() => setExpandedId(expandedId === d.id ? null : d.id)} sx={{ color: "#475569", "&:hover": { color: "#FF6B35" }, borderRadius: "6px" }}>
                                                <i className={`lni ${expandedId === d.id ? "lni-chevron-up" : "lni-chevron-down"}`} style={{ fontSize: 13 }} />
                                            </IconButton>
                                        </TableCell>
                                        <TableCell sx={{ ...cellSx, color: "#475569", fontSize: 11 }}>#{d.id}</TableCell>
                                        <TableCell sx={{ ...cellSx, fontWeight: 600, color: "#E2E8F0" }}>{d.delivery_point_id}</TableCell>
                                        <TableCell sx={cellSx}>{d.dispatch_date ? new Date(d.dispatch_date).toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" }) : "-"}</TableCell>
                                        <TableCell sx={cellSx}>
                                            <FormControl size="small">
                                                <Select
                                                    value={d.status || "PENDIENTE"}
                                                    onChange={(e) => handleStatusChange(d.id, e.target.value)}
                                                    disabled={["ENTREGADO", "CANCELADO"].includes(d.status)}
                                                    sx={{ bgcolor: "transparent", fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: STATUS_CONFIG[d.status]?.color || "#94A3B8", "& .MuiOutlinedInput-notchedOutline": { border: "none" }, "& .MuiSvgIcon-root": { color: "#475569" } }}
                                                    renderValue={(v) => <StatusChip status={v} />}
                                                    MenuProps={{ PaperProps: { sx: { bgcolor: "#0D1117", border: "1px solid #1E293B", borderRadius: "10px" } } }}
                                                >
                                                    {allowedStatuses(d.status).map((status) => {
                                                        const s = STATUS_CONFIG[status];
                                                        return (
                                                            <MenuItem key={status} value={status} sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: s.color }}>
                                                                <i className={s.icon} style={{ marginRight: 8 }} />{s.label}
                                                            </MenuItem>
                                                        );
                                                    })}
                                                </Select>
                                            </FormControl>
                                        </TableCell>
                                        <TableCell sx={cellSx}>
                                            <Chip label={`${d.details?.length || 0} item(s)`} size="small" sx={{ bgcolor: "rgba(148,163,184,0.08)", color: "#94A3B8", fontFamily: "'DM Sans', sans-serif", fontSize: 11 }} />
                                        </TableCell>
                                    </TableRow>

                                    <TableRow key={`${d.id}-detail`}>
                                        <TableCell colSpan={6} sx={{ py: 0, borderBottom: expandedId === d.id ? "1px solid #1E293B" : "none" }}>
                                            <Collapse in={expandedId === d.id} timeout="auto" unmountOnExit>
                                                <Box sx={{ px: 4, py: 2.5, bgcolor: "#060A10" }}>
                                                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 12, color: "#FF6B35", mb: 1.5, textTransform: "uppercase", letterSpacing: 1 }}>
                                                        Detalle de productos
                                                    </Typography>
                                                    {d.details && d.details.length > 0 ? (
                                                        <Table size="small">
                                                            <TableHead>
                                                                <TableRow>
                                                                    {["Producto ID", "Cantidad"].map((h) => (
                                                                        <TableCell key={h} sx={{ ...cellSx, color: "#475569", fontWeight: 700, fontSize: 10, letterSpacing: 1, textTransform: "uppercase", py: 1 }}>{h}</TableCell>
                                                                    ))}
                                                                </TableRow>
                                                            </TableHead>
                                                            <TableBody>
                                                                {d.details.map((det) => (
                                                                    <TableRow key={det.id}>
                                                                        <TableCell sx={{ ...cellSx, color: "#E2E8F0", fontWeight: 600 }}>{det.product_id}</TableCell>
                                                                        <TableCell sx={cellSx}>{det.quantity}</TableCell>
                                                                    </TableRow>
                                                                ))}
                                                            </TableBody>
                                                        </Table>
                                                    ) : (
                                                        <Typography sx={{ fontFamily: "'DM Sans', sans-serif", color: "#475569", fontSize: 13 }}>Sin detalle disponible.</Typography>
                                                    )}
                                                </Box>
                                            </Collapse>
                                        </TableCell>
                                    </TableRow>
                                </Fragment>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}
