import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import Navbar from "./components/Navbar";
import DispatchList from "./pages/DispatchList.jsx";
import DeliveryPoints from "./pages/DeliveryPoints.jsx";
import DispatchCreate from "./pages/DispatchCreate.jsx";
import Drivers from "./pages/Drivers.jsx";
import Products from "./pages/Products";
import Login from "./pages/Login";
import "./App.css";
import { getStoredRole } from "./utils/auth";

function PrivateRoute({ children, roles }) {
    const token = localStorage.getItem("access_token");
    const role = getStoredRole();
    if (!token) return <Navigate to="/login" replace />;
    if (roles && !roles.includes(role)) return <Navigate to="/dispatches" replace />;
    return children;
}

function Layout({ children }) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    return (
        <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#060A10" }}>
            <Navbar />
            <Box
                component="main"
                sx={{
                    flex: 1,
                    ml: isMobile ? 0 : "220px",
                    mt: isMobile ? "56px" : 0,
                    p: { xs: 2.5, sm: 3.5 },
                    minHeight: "100vh",
                    overflowX: "hidden",
                }}
            >
                {children}
            </Box>
        </Box>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route
                    path="/products"
                    element={<PrivateRoute><Layout><Products /></Layout></PrivateRoute>}
                />
                <Route
                    path="/delivery-points"
                    element={<PrivateRoute><Layout><DeliveryPoints /></Layout></PrivateRoute>}
                />
                <Route
                    path="/drivers"
                    element={<PrivateRoute roles={["ADMIN", "SUPERVISOR"]}><Layout><Drivers /></Layout></PrivateRoute>}
                />
                <Route
                    path="/dispatches/new"
                    element={<PrivateRoute roles={["ADMIN", "OPERADOR"]}><Layout><DispatchCreate /></Layout></PrivateRoute>}
                />
                <Route
                    path="/dispatches"
                    element={<PrivateRoute><Layout><DispatchList /></Layout></PrivateRoute>}
                />
                <Route path="/" element={<Navigate to="/products" replace />} />
                <Route path="*" element={<Navigate to="/products" replace />} />
            </Routes>
        </BrowserRouter>
    );
}
