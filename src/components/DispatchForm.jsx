import { useState, useEffect, useCallback } from "react";
import {
    Box,
    Typography,
    TextField,
    Button,
    Autocomplete,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Alert,
    Chip,
    CircularProgress,
    InputAdornment,
} from "@mui/material";
import { productApi } from "../api/productApi";
import { deliveryApi, driverApi } from "../api/dispatchApi";

const FIELD_SX = {
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

const cellSx = {
    borderBottom: "1px solid #1E293B",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 13,
    color: "#CBD5E1",
    py: 1.5,
};

export const DispatchForm = ({ onSave }) => {
    const [products, setProducts] = useState([]);
    const [deliveryPoints, setDeliveryPoints] = useState([]);
    const [deliveryPoint, setDeliveryPoint] = useState(null);
    const [deliverySearch, setDeliverySearch] = useState("");
    const [drivers, setDrivers] = useState([]);
    const [driver, setDriver] = useState(null);
    const [driverSearch, setDriverSearch] = useState("");
    const [details, setDetails] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [qty, setQty] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        productApi.getAll()
            .then((pRes) => {
                setProducts(Array.isArray(pRes.data) ? pRes.data : pRes.data.items || []);
            })
            .catch((err) => {
                setError(err.response?.data?.detail || "No se pudieron cargar productos.");
            });
    }, []);

    const fetchDeliveryPoints = useCallback(async (search) => {
        const query = search.trim();
        if (query.length < 2) {
            setDeliveryPoints([]);
            return;
        }
        try {
            const res = await deliveryApi.getAll({ search: query, limit: 20 });
            setDeliveryPoints(Array.isArray(res.data) ? res.data : res.data.items || []);
        } catch (err) {
            setError(err.response?.data?.detail || "No se pudieron buscar puntos de entrega.");
        }
    }, []);

    useEffect(() => {
        const id = setTimeout(() => fetchDeliveryPoints(deliverySearch), 300);
        return () => clearTimeout(id);
    }, [deliverySearch, fetchDeliveryPoints]);

    const fetchDrivers = useCallback(async (search) => {
        const query = search.trim();
        if (query.length < 2) {
            setDrivers([]);
            return;
        }
        try {
            const res = await driverApi.getAll({ search: query, status: "ACTIVO", limit: 20 });
            setDrivers(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            setError(err.response?.data?.detail || "No se pudieron buscar conductores.");
        }
    }, []);

    useEffect(() => {
        const id = setTimeout(() => fetchDrivers(driverSearch), 300);
        return () => clearTimeout(id);
    }, [driverSearch, fetchDrivers]);

    const addDetail = () => {
        if (!selectedProduct || !qty || isNaN(qty) || Number(qty) <= 0) return;
        if (Number(qty) > selectedProduct.stock) {
            setError(`Stock insuficiente para ${selectedProduct.name}. Disponible: ${selectedProduct.stock}`);
            return;
        }

        setError("");
        const exists = details.findIndex((d) => d.product_id === selectedProduct.id);
        if (exists >= 0) {
            const updated = [...details];
            const nextQty = updated[exists].quantity + Number(qty);
            if (nextQty > selectedProduct.stock) {
                setError(`Stock insuficiente para ${selectedProduct.name}. Disponible: ${selectedProduct.stock}`);
                return;
            }
            updated[exists].quantity = nextQty;
            setDetails(updated);
        } else {
            setDetails((prev) => [
                ...prev,
                {
                    product_id: selectedProduct.id,
                    product_name: selectedProduct.name,
                    sku: selectedProduct.sku,
                    unit: selectedProduct.unit,
                    stock: selectedProduct.stock,
                    quantity: Number(qty),
                },
            ]);
        }
        setSelectedProduct(null);
        setQty("");
    };

    const removeDetail = (idx) => setDetails((prev) => prev.filter((_, i) => i !== idx));

    const updateQty = (idx, val) => {
        const next = Number(val);
        const updated = [...details];
        updated[idx].quantity = next;
        setDetails(updated);
    };

    const handleSubmit = async () => {
        if (!deliveryPoint) { setError("Selecciona un punto de entrega"); return; }
        if (!driver) { setError("Selecciona un conductor o placa de entrega"); return; }
        if (details.length === 0) { setError("Agrega al menos un producto"); return; }
        if (details.some((d) => !d.quantity || d.quantity <= 0 || d.quantity > d.stock)) {
            setError("Revisa las cantidades. Deben ser mayores a cero y no superar el stock.");
            return;
        }

        setError("");
        setLoading(true);
        try {
            await onSave({
                delivery_point_id: deliveryPoint.id,
                driver_id: driver.id,
                details: details.map((d) => ({ product_id: d.product_id, quantity: d.quantity })),
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box>
            {error && (
                <Alert severity="error" sx={{ mb: 2.5, bgcolor: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#FCA5A5", borderRadius: "10px", fontFamily: "'DM Sans', sans-serif", "& .MuiAlert-icon": { color: "#EF4444" } }}>
                    {error}
                </Alert>
            )}

            <Box sx={{ bgcolor: "#0D1117", border: "1px solid #1E293B", borderRadius: "14px", p: 3, mb: 3 }}>
                <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: 13, color: "#FF8C42", mb: 2, textTransform: "uppercase", letterSpacing: 1 }}>
                    <i className="lni lni-map-marker" style={{ marginRight: 8 }} />
                    Punto de Entrega
                </Typography>
                    <Autocomplete
                        options={deliveryPoints}
                        getOptionLabel={(o) => o?.name ? `${o.name} - ${o.address || ""}` : ""}
                        filterOptions={(options) => options}
                        value={deliveryPoint}
                        onChange={(_, v) => setDeliveryPoint(v)}
                        inputValue={deliverySearch}
                        onInputChange={(_, v) => setDeliverySearch(v)}
                        noOptionsText={deliverySearch.trim().length < 2 ? "Escribe al menos 2 caracteres" : "Sin resultados"}
                        sx={{ maxWidth: 620 }}
                        renderInput={(params) => (
                        <TextField {...params} label="Buscar punto por NIT, CC, telefono, nombre o direccion" sx={FIELD_SX} InputProps={{ ...params.InputProps, startAdornment: <InputAdornment position="start"><i className="lni lni-map" style={{ color: "#CBD5E1", fontSize: 14 }} /></InputAdornment> }} />
                    )}
                        renderOption={(props, option) => (
                            <Box component="li" {...props} sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#CBD5E1" }}>
                                <Box>
                                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#F1F5F9", fontWeight: 700 }}>{option.name}</Typography>
                                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#94A3B8" }}>
                                        {option.document_type || ""} {option.document_number || ""} - {option.address || ""} - Tel: {option.phone || "-"}
                                    </Typography>
                                </Box>
                            </Box>
                        )}
                    slotProps={{ paper: { sx: { bgcolor: "#0D1117", border: "1px solid #1E293B", borderRadius: "10px" } } }}
                />
            </Box>

            <Box sx={{ bgcolor: "#0D1117", border: "1px solid #1E293B", borderRadius: "14px", p: 3, mb: 3 }}>
                <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: 13, color: "#FF8C42", mb: 2, textTransform: "uppercase", letterSpacing: 1 }}>
                    <i className="lni lni-delivery" style={{ marginRight: 8 }} />
                    Conductor y Placa
                </Typography>
                <Autocomplete
                    options={drivers}
                    getOptionLabel={(o) => o?.full_name ? `${o.full_name} - ${o.plate}` : ""}
                    filterOptions={(options) => options}
                    value={driver}
                    onChange={(_, v) => setDriver(v)}
                    inputValue={driverSearch}
                    onInputChange={(_, v) => setDriverSearch(v)}
                    noOptionsText={driverSearch.trim().length < 2 ? "Busca por conductor, placa, CC o telefono" : "Sin resultados"}
                    sx={{ maxWidth: 620 }}
                    renderInput={(params) => (
                        <TextField {...params} label="Buscar conductor o placa" sx={FIELD_SX} InputProps={{ ...params.InputProps, startAdornment: <InputAdornment position="start"><i className="lni lni-user" style={{ color: "#CBD5E1", fontSize: 14 }} /></InputAdornment> }} />
                    )}
                    renderOption={(props, option) => (
                        <Box component="li" {...props} sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#CBD5E1" }}>
                            <Box>
                                <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#F1F5F9", fontWeight: 700 }}>{option.full_name} - {option.plate}</Typography>
                                <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#94A3B8" }}>
                                    CC: {option.cc} - Licencia: {option.license_type} {option.license_number} - Tel: {option.phone}
                                </Typography>
                            </Box>
                        </Box>
                    )}
                    slotProps={{ paper: { sx: { bgcolor: "#0D1117", border: "1px solid #1E293B", borderRadius: "10px" } } }}
                />
            </Box>

            <Box sx={{ bgcolor: "#0D1117", border: "1px solid #1E293B", borderRadius: "14px", p: 3, mb: 3 }}>
                <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 13, color: "#FF6B35", mb: 2, textTransform: "uppercase", letterSpacing: 1 }}>
                    <i className="lni lni-package" style={{ marginRight: 8 }} />
                    Agregar Productos
                </Typography>
                <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start", flexWrap: "wrap" }}>
                    <Autocomplete
                        options={products}
                        getOptionLabel={(o) => `${o.name} (${o.sku})`}
                        value={selectedProduct}
                        onChange={(_, v) => setSelectedProduct(v)}
                        sx={{ flex: 2, minWidth: 240 }}
                        renderInput={(params) => (
                            <TextField {...params} label="Producto" sx={FIELD_SX} InputProps={{ ...params.InputProps, startAdornment: <InputAdornment position="start"><i className="lni lni-tag" style={{ color: "#64748B", fontSize: 14 }} /></InputAdornment> }} />
                        )}
                        renderOption={(props, o) => (
                            <Box component="li" {...props} sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#CBD5E1" }}>
                                <Box>
                                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#E2E8F0" }}>{o.name}</Typography>
                                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#64748B" }}>
                                        SKU: {o.sku} - Stock: {o.stock} {o.unit}
                                    </Typography>
                                </Box>
                            </Box>
                        )}
                        slotProps={{ paper: { sx: { bgcolor: "#0D1117", border: "1px solid #1E293B", borderRadius: "10px" } } }}
                    />
                    <TextField label="Cantidad" type="number" value={qty} onChange={(e) => setQty(e.target.value)} sx={{ width: 130, ...FIELD_SX }} inputProps={{ min: 1 }} />
                    <Button onClick={addDetail} disabled={!selectedProduct || !qty} sx={{ mt: 0.3, height: 48, px: 2.5, bgcolor: "rgba(255,107,53,0.15)", color: "#FF6B35", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 13, borderRadius: "10px", border: "1px solid rgba(255,107,53,0.3)", "&:hover": { bgcolor: "rgba(255,107,53,0.25)" }, "&:disabled": { opacity: 0.4 } }}>
                        <i className="lni lni-circle-plus" style={{ marginRight: 6, fontSize: 16 }} />
                        Agregar
                    </Button>
                </Box>
            </Box>

            {details.length > 0 && (
                <Box sx={{ bgcolor: "#0D1117", border: "1px solid #1E293B", borderRadius: "14px", overflow: "hidden", mb: 3 }}>
                    <Box sx={{ px: 3, py: 2, borderBottom: "1px solid #1E293B", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 13, color: "#FF6B35", textTransform: "uppercase", letterSpacing: 1 }}>
                            <i className="lni lni-list" style={{ marginRight: 8 }} />
                            Detalle del Despacho
                        </Typography>
                        <Chip label={`${details.length} item(s)`} size="small" sx={{ bgcolor: "rgba(255,107,53,0.12)", color: "#FF6B35", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 11 }} />
                    </Box>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: "#060A10" }}>
                                {["Producto", "SKU", "Unidad", "Stock", "Cantidad", ""].map((h) => (
                                    <TableCell key={h} sx={{ ...cellSx, color: "#475569", fontWeight: 700, fontSize: 11, letterSpacing: 1, textTransform: "uppercase" }}>{h}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {details.map((d, i) => (
                                <TableRow key={d.product_id} sx={{ "&:hover": { bgcolor: "rgba(255,255,255,0.02)" } }}>
                                    <TableCell sx={{ ...cellSx, fontWeight: 600, color: "#E2E8F0" }}>{d.product_name}</TableCell>
                                    <TableCell sx={cellSx}>{d.sku}</TableCell>
                                    <TableCell sx={cellSx}>{d.unit || "-"}</TableCell>
                                    <TableCell sx={cellSx}>{d.stock}</TableCell>
                                    <TableCell sx={cellSx}>
                                        <TextField type="number" value={d.quantity} onChange={(e) => updateQty(i, e.target.value)} size="small" inputProps={{ min: 1, max: d.stock, style: { fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#E2E8F0" } }} sx={{ width: 90, "& .MuiOutlinedInput-root": { bgcolor: "#060A10", borderRadius: "8px", "& fieldset": { borderColor: "#1E293B" }, "&:hover fieldset": { borderColor: "#334155" }, "&.Mui-focused fieldset": { borderColor: "#FF6B35" } } }} />
                                    </TableCell>
                                    <TableCell sx={cellSx}>
                                        <IconButton size="small" onClick={() => removeDetail(i)} sx={{ color: "#64748B", "&:hover": { color: "#EF4444", bgcolor: "rgba(239,68,68,0.1)" }, borderRadius: "8px" }}>
                                            <i className="lni lni-trash" style={{ fontSize: 15 }} />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Box>
            )}

            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button onClick={handleSubmit} disabled={loading} sx={{ background: "linear-gradient(135deg,#FF6B35,#FF8C42)", color: "#fff", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 14, borderRadius: "10px", px: 4, py: 1.4, boxShadow: "0 4px 20px rgba(255,107,53,0.35)", "&:hover": { background: "linear-gradient(135deg,#E85A24,#FF6B35)" }, "&:disabled": { opacity: 0.6 } }}>
                    {loading ? <CircularProgress size={18} sx={{ color: "#fff" }} /> : <><i className="lni lni-checkmark-circle" style={{ marginRight: 8, fontSize: 17 }} />Crear Despacho</>}
                </Button>
            </Box>
        </Box>
    );
};
