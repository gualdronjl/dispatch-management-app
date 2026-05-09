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
    Chip,
    Skeleton,
    Alert,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Pagination,
} from "@mui/material";
import { productApi } from "../api/productApi";
import ProductForm from "../components/ProductForm";

const cellSx = {
    borderBottom: "1px solid #1E293B",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 13,
    color: "#CBD5E1",
    py: 1.8,
};

export default function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [formOpen, setFormOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [deleteDialog, setDeleteDialog] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const LIMIT = 10;

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const res = await productApi.getAll({ search, skip: (page - 1) * LIMIT, limit: LIMIT });
            const data = res.data;
            if (Array.isArray(data)) {
                setProducts(data);
                setTotalPages(1);
            } else {
                setProducts(data.items || data);
                setTotalPages(Math.ceil((data.total || data.length) / LIMIT) || 1);
            }
        } catch {
            setError("Error al cargar productos.");
        } finally {
            setLoading(false);
        }
    }, [search, page]);

    useEffect(() => { fetchProducts(); }, [fetchProducts]);

    const handleSave = async (data) => {
        try {
            if (editing) await productApi.update(editing.id, data);
            else await productApi.create(data);
            setFormOpen(false);
            setEditing(null);
            fetchProducts();
        } catch {
            setError("Error al guardar el producto.");
        }
    };

    const handleDelete = async () => {
        setDeleteLoading(true);
        try {
            await productApi.delete(deleteDialog.id);
            setDeleteDialog(null);
            fetchProducts();
        } catch {
            setError("Error al eliminar el producto.");
        } finally {
            setDeleteLoading(false);
        }
    };

    const stockColor = (stock) => {
        if (stock > 50) return { bg: "rgba(34,197,94,0.12)", color: "#4ADE80" };
        if (stock > 10) return { bg: "rgba(234,179,8,0.12)", color: "#FDE047" };
        return { bg: "rgba(239,68,68,0.12)", color: "#FCA5A5" };
    };

    return (
        <Box>
            {/* Header */}
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3, flexWrap: "wrap", gap: 2 }}>
                <Box>
                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: 22, color: "#F1F5F9", letterSpacing: "-0.5px" }}>
                        Productos
                    </Typography>
                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#64748B", mt: 0.3 }}>
                        Gestiona el catálogo de productos disponibles
                    </Typography>
                </Box>
                <Button
                    onClick={() => { setEditing(null); setFormOpen(true); }}
                    startIcon={<i className="lni lni-circle-plus" style={{ fontSize: 16 }} />}
                    sx={{
                        background: "linear-gradient(135deg,#FF6B35,#FF8C42)",
                        color: "#fff",
                        fontFamily: "'DM Sans', sans-serif",
                        fontWeight: 700,
                        fontSize: 13,
                        textTransform: "none",
                        borderRadius: "10px",
                        px: 2.5,
                        py: 1.1,
                        boxShadow: "0 4px 16px rgba(255,107,53,0.3)",
                        "&:hover": { background: "linear-gradient(135deg,#E85A24,#FF6B35)" },
                    }}
                >
                    Nuevo Producto
                </Button>
            </Box>

            {/* Search */}
            <TextField
                placeholder="Buscar producto..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                size="small"
                sx={{
                    mb: 3,
                    width: { xs: "100%", sm: 320 },
                    "& .MuiOutlinedInput-root": {
                        backgroundColor: "#0D1117",
                        borderRadius: "10px",
                        fontSize: 13,
                        color: "#CBD5E1",
                        fontFamily: "'DM Sans', sans-serif",
                        "& fieldset": { borderColor: "#1E293B" },
                        "&:hover fieldset": { borderColor: "#334155" },
                        "&.Mui-focused fieldset": { borderColor: "#FF6B35" },
                    },
                }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <i className="lni lni-search-alt" style={{ color: "#64748B", fontSize: 15 }} />
                        </InputAdornment>
                    ),
                }}
            />

            {error && (
                <Alert severity="error" sx={{ mb: 2, bgcolor: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#FCA5A5", borderRadius: "10px", fontFamily: "'DM Sans', sans-serif", "& .MuiAlert-icon": { color: "#EF4444" } }}>
                    {error}
                </Alert>
            )}

            {/* Table */}
            <TableContainer sx={{ backgroundColor: "#0D1117", border: "1px solid #1E293B", borderRadius: "14px", overflow: "hidden" }}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: "#060A10" }}>
                            {["ID", "Nombre", "Descripción", "Precio", "Stock", "Unidad", "Acciones"].map((h) => (
                                <TableCell key={h} sx={{ ...cellSx, color: "#475569", fontWeight: 700, fontSize: 11, letterSpacing: 1, textTransform: "uppercase" }}>
                                    {h}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading
                            ? Array.from({ length: 6 }).map((_, i) => (
                                <TableRow key={i}>
                                    {Array.from({ length: 7 }).map((__, j) => (
                                        <TableCell key={j} sx={cellSx}>
                                            <Skeleton sx={{ bgcolor: "#1E293B", borderRadius: 1 }} height={20} />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                            : products.length === 0
                                ? (
                                    <TableRow>
                                        <TableCell colSpan={7} sx={{ ...cellSx, textAlign: "center", py: 6 }}>
                                            <i className="lni lni-package" style={{ color: "#334155", fontSize: 36, display: "block", marginBottom: 8 }} />
                                            <Typography sx={{ fontFamily: "'DM Sans', sans-serif", color: "#475569", fontSize: 14 }}>
                                                No hay productos registrados
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                )
                                : products.map((p) => {
                                    const sc = stockColor(p.stock);
                                    return (
                                        <TableRow key={p.id} sx={{ "&:hover": { backgroundColor: "rgba(255,255,255,0.02)" } }}>
                                            <TableCell sx={{ ...cellSx, color: "#475569", fontSize: 11 }}>#{p.id}</TableCell>
                                            <TableCell sx={{ ...cellSx, fontWeight: 600, color: "#E2E8F0" }}>{p.name}</TableCell>
                                            <TableCell sx={{ ...cellSx, maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                                {p.description || <span style={{ color: "#334155" }}>—</span>}
                                            </TableCell>
                                            <TableCell sx={{ ...cellSx, color: "#4ADE80", fontWeight: 600 }}>
                                                ${Number(p.price).toLocaleString("es-CO")}
                                            </TableCell>
                                            <TableCell sx={cellSx}>
                                                <Chip
                                                    label={p.stock}
                                                    size="small"
                                                    sx={{ bgcolor: sc.bg, color: sc.color, fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 11, height: 22 }}
                                                />
                                            </TableCell>
                                            <TableCell sx={cellSx}>{p.unit || "—"}</TableCell>
                                            <TableCell sx={cellSx}>
                                                <Box sx={{ display: "flex", gap: 0.5 }}>
                                                    <Tooltip title="Editar">
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => { setEditing(p); setFormOpen(true); }}
                                                            sx={{ color: "#64748B", "&:hover": { color: "#FF6B35", bgcolor: "rgba(255,107,53,0.1)" }, borderRadius: "8px" }}
                                                        >
                                                            <i className="lni lni-pencil" style={{ fontSize: 15 }} />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Eliminar">
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => setDeleteDialog(p)}
                                                            sx={{ color: "#64748B", "&:hover": { color: "#EF4444", bgcolor: "rgba(239,68,68,0.1)" }, borderRadius: "8px" }}
                                                        >
                                                            <i className="lni lni-trash" style={{ fontSize: 15 }} />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                    </TableBody>
                </Table>
            </TableContainer>

            {totalPages > 1 && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                    <Pagination
                        count={totalPages}
                        page={page}
                        onChange={(_, v) => setPage(v)}
                        sx={{
                            "& .MuiPaginationItem-root": {
                                fontFamily: "'DM Sans', sans-serif",
                                color: "#64748B",
                                borderColor: "#1E293B",
                                "&.Mui-selected": { bgcolor: "#FF6B35", color: "#fff" },
                                "&:hover": { bgcolor: "rgba(255,107,53,0.1)" },
                            },
                        }}
                    />
                </Box>
            )}

            <ProductForm
                open={formOpen}
                onClose={() => { setFormOpen(false); setEditing(null); }}
                onSave={handleSave}
                product={editing}
            />

            {/* Delete dialog */}
            <Dialog
                open={!!deleteDialog}
                onClose={() => setDeleteDialog(null)}
                PaperProps={{ sx: { bgcolor: "#0D1117", border: "1px solid #1E293B", borderRadius: "14px" } }}
            >
                <DialogTitle sx={{ fontFamily: "'DM Sans', sans-serif", color: "#F1F5F9", fontWeight: 700 }}>
                    Confirmar eliminación
                </DialogTitle>
                <DialogContent>
                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", color: "#94A3B8", fontSize: 14 }}>
                        ¿Deseas eliminar el producto <strong style={{ color: "#F1F5F9" }}>{deleteDialog?.name}</strong>? Esta acción no se puede deshacer.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
                    <Button onClick={() => setDeleteDialog(null)} sx={{ color: "#64748B", fontFamily: "'DM Sans', sans-serif", textTransform: "none", borderRadius: "8px" }}>
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleDelete}
                        disabled={deleteLoading}
                        sx={{ bgcolor: "#EF4444", color: "#fff", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, textTransform: "none", borderRadius: "8px", px: 2.5, "&:hover": { bgcolor: "#DC2626" } }}
                    >
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}