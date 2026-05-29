import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
    AppBar,
    Toolbar,
    Box,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
    Divider,
    Avatar,
    Tooltip,
    useMediaQuery,
    useTheme,
    Chip,
} from "@mui/material";
import { getStoredRole } from "../utils/auth";

const NAV_ITEMS = [
    { label: "Productos", path: "/products", icon: "lni lni-package", roles: ["ADMIN", "OPERADOR", "SUPERVISOR"] },
    { label: "Puntos de Entrega", path: "/delivery-points", icon: "lni lni-map-marker", roles: ["ADMIN", "OPERADOR", "SUPERVISOR"] },
    { label: "Conductores", path: "/drivers", icon: "lni lni-users", roles: ["ADMIN", "SUPERVISOR"] },
    { label: "Nuevo Despacho", path: "/dispatches/new", icon: "lni lni-circle-plus", roles: ["ADMIN", "OPERADOR"] },
    { label: "Despachos", path: "/dispatches", icon: "lni lni-list", roles: ["ADMIN", "OPERADOR", "SUPERVISOR"] },
];

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const [drawerOpen, setDrawerOpen] = useState(false);
    const role = getStoredRole();
    const navItems = NAV_ITEMS.filter((item) => item.roles.includes(role));

    const handleLogout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    const isActive = (path) => location.pathname === path;

    const NavLinks = () => (
        <List disablePadding>
            {navItems.map((item) => (
                <ListItem key={item.path} disablePadding>
                    <ListItemButton
                        onClick={() => { navigate(item.path); setDrawerOpen(false); }}
                        sx={{
                            mx: 1,
                            my: 0.3,
                            borderRadius: "8px",
                            backgroundColor: isActive(item.path) ? "rgba(255,107,53,0.12)" : "transparent",
                            borderLeft: isActive(item.path) ? "3px solid #FF6B35" : "3px solid transparent",
                            "&:hover": { backgroundColor: "rgba(255,107,53,0.07)" },
                        }}
                    >
                        <ListItemIcon sx={{ minWidth: 36 }}>
                            <i className={item.icon} style={{
                                fontSize: 18,
                                color: isActive(item.path) ? "#FF6B35" : "#94A3B8",
                            }} />
                        </ListItemIcon>
                        <ListItemText
                            primary={item.label}
                            primaryTypographyProps={{
                                fontSize: 13,
                                fontWeight: isActive(item.path) ? 700 : 500,
                                color: isActive(item.path) ? "#FF6B35" : "#CBD5E1",
                                fontFamily: "'DM Sans', sans-serif",
                            }}
                        />
                    </ListItemButton>
                </ListItem>
            ))}
        </List>
    );

    return (
        <>
            {/* Sidebar desktop */}
            {!isMobile && (
                <Box
                    sx={{
                        width: 220,
                        height: "100vh",
                        position: "fixed",
                        left: 0,
                        top: 0,
                        backgroundColor: "#0D1117",
                        borderRight: "1px solid #1E293B",
                        display: "flex",
                        flexDirection: "column",
                        zIndex: 100,
                    }}
                >
                    {/* Logo */}
                    <Box sx={{ px: 3, py: 3, borderBottom: "1px solid #1E293B" }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                            <Box
                                sx={{
                                    width: 34,
                                    height: 34,
                                    borderRadius: "8px",
                                    background: "linear-gradient(135deg, #FF6B35, #FF8C42)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <i className="lni lni-delivery" style={{ color: "#fff", fontSize: 16 }} />
                            </Box>
                            <Box>
                                <Typography sx={{ color: "#F1F5F9", fontWeight: 800, fontSize: 14, lineHeight: 1, fontFamily: "'DM Sans', sans-serif" }}>
                                    DISPATCH
                                </Typography>
                                <Typography sx={{ color: "#FF6B35", fontWeight: 600, fontSize: 10, letterSpacing: 2, fontFamily: "'DM Sans', sans-serif" }}>
                                    MANAGER
                                </Typography>
                            </Box>
                        </Box>
                    </Box>

                    {/* Nav */}
                    <Box sx={{ flex: 1, pt: 2, overflowY: "auto" }}>
                        <Typography sx={{ px: 3, mb: 1, fontSize: 10, fontWeight: 700, color: "#475569", letterSpacing: 1.5, fontFamily: "'DM Sans', sans-serif" }}>
                            MENÚ PRINCIPAL
                        </Typography>
                        <NavLinks />
                    </Box>

                    {/* User */}
                    <Box sx={{ p: 2, borderTop: "1px solid #1E293B" }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>
                            <Avatar sx={{ width: 32, height: 32, bgcolor: "#FF6B35", fontSize: 13, fontFamily: "'DM Sans', sans-serif" }}>U</Avatar>
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Typography sx={{ color: "#F1F5F9", fontSize: 12, fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>
                                    Usuario
                                </Typography>
                                <Chip label={role || "Usuario"} size="small" sx={{ height: 16, fontSize: 9, bgcolor: "rgba(255,107,53,0.15)", color: "#FF6B35", fontFamily: "'DM Sans', sans-serif" }} />
                            </Box>
                        </Box>
                        <ListItemButton
                            onClick={handleLogout}
                            sx={{
                                borderRadius: "8px",
                                py: 0.8,
                                "&:hover": { backgroundColor: "rgba(239,68,68,0.1)" },
                            }}
                        >
                            <ListItemIcon sx={{ minWidth: 30 }}>
                                <i className="lni lni-exit" style={{ color: "#EF4444", fontSize: 16 }} />
                            </ListItemIcon>
                            <ListItemText
                                primary="Cerrar sesión"
                                primaryTypographyProps={{ fontSize: 12, color: "#EF4444", fontFamily: "'DM Sans', sans-serif" }}
                            />
                        </ListItemButton>
                    </Box>
                </Box>
            )}

            {/* Mobile AppBar */}
            {isMobile && (
                <>
                    <AppBar position="fixed" sx={{ bgcolor: "#0D1117", borderBottom: "1px solid #1E293B", boxShadow: "none" }}>
                        <Toolbar sx={{ justifyContent: "space-between" }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                <Box sx={{ width: 28, height: 28, borderRadius: "6px", background: "linear-gradient(135deg,#FF6B35,#FF8C42)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <i className="lni lni-delivery" style={{ color: "#fff", fontSize: 13 }} />
                                </Box>
                                <Typography sx={{ color: "#F1F5F9", fontWeight: 800, fontSize: 14, fontFamily: "'DM Sans', sans-serif" }}>
                                    DISPATCH MANAGER
                                </Typography>
                            </Box>
                            <IconButton onClick={() => setDrawerOpen(true)} sx={{ color: "#94A3B8" }}>
                                <i className="lni lni-menu" style={{ fontSize: 22 }} />
                            </IconButton>
                        </Toolbar>
                    </AppBar>

                    <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}
                        PaperProps={{ sx: { width: 260, bgcolor: "#0D1117", borderLeft: "1px solid #1E293B" } }}>
                        <Box sx={{ pt: 2 }}>
                            <Typography sx={{ px: 3, mb: 2, fontSize: 11, fontWeight: 700, color: "#475569", letterSpacing: 1.5, fontFamily: "'DM Sans', sans-serif" }}>
                                MENÚ
                            </Typography>
                            <NavLinks />
                            <Divider sx={{ my: 2, borderColor: "#1E293B" }} />
                            <ListItemButton onClick={handleLogout} sx={{ mx: 1, borderRadius: "8px", "&:hover": { bgcolor: "rgba(239,68,68,0.1)" } }}>
                                <ListItemIcon sx={{ minWidth: 32 }}>
                                    <i className="lni lni-exit" style={{ color: "#EF4444", fontSize: 16 }} />
                                </ListItemIcon>
                                <ListItemText primary="Cerrar sesión" primaryTypographyProps={{ fontSize: 13, color: "#EF4444", fontFamily: "'DM Sans', sans-serif" }} />
                            </ListItemButton>
                        </Box>
                    </Drawer>
                </>
            )}
        </>
    );
}
