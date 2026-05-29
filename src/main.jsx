import React from "react";
import ReactDOM from "react-dom/client";
import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";
import App from "./App";

const theme = createTheme({
    palette: {
        mode: "dark",
        primary: { main: "#FF6B35" },
        background: { default: "#060A10", paper: "#0D1117" },
    },
    typography: {
        fontFamily: "'DM Sans', sans-serif",
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: `
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        @import url('https://cdn.lineicons.com/4.0/lineicons.css');

        *, *::before, *::after { box-sizing: border-box; }

        body {
          margin: 0;
          background-color: #060A10;
          color: #CBD5E1;
          font-family: 'DM Sans', sans-serif;
          -webkit-font-smoothing: antialiased;
        }

        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #0D1117; }
        ::-webkit-scrollbar-thumb { background: #1E293B; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #334155; }
      `,
        },
        MuiButton: {
            styleOverrides: { root: { textTransform: "none" } },
        },
        MuiAutocomplete: {
            styleOverrides: {
                option: { fontFamily: "'DM Sans', sans-serif", fontSize: 13 },
                noOptions: { fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#64748B" },
                loading: { fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#64748B" },
            },
        },
    },
});

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <App />
        </ThemeProvider>
    </React.StrictMode>
);

if ("serviceWorker" in navigator && import.meta.env.PROD) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("/service-worker.js").catch(() => {
            // La app sigue funcionando aunque el navegador bloquee el registro.
        });
    });
}
