// components/TopAppBar/index.jsx
import React, { useState, useMemo, useEffect } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Branding from "./Branding";
import ThemeMenu from "./ThemeMenu";

const TopAppBar = ({ branding = "My App", homeLink = "/" }) => {
  const [mode, setMode] = useState("light");
  const [syncWithOS, setSyncWithOS] = useState(false);

  // Remove initial inline styles if any (not strictly needed in Next.js)
  useEffect(() => {
    const styleTag = document.getElementById("initial-theme-styles");
    if (styleTag && styleTag.parentNode) {
      styleTag.parentNode.removeChild(styleTag);
    }
  }, []);

  // Load stored preferences
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedMode = localStorage.getItem("slop-press-theme-mode");
      const storedSync = localStorage.getItem("slop-press-sync-with-os");
      if (storedSync !== null) setSyncWithOS(storedSync === "true");
      if (storedMode) setMode(storedMode);
    }
  }, []);

  // Sync with OS preference if enabled
  useEffect(() => {
    if (syncWithOS && typeof window !== "undefined") {
      const mql = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = (e) => setMode(e.matches ? "dark" : "light");
      setMode(mql.matches ? "dark" : "light");
      mql.addEventListener("change", handleChange);
      return () => mql.removeEventListener("change", handleChange);
    }
  }, [syncWithOS]);

  // Persist preferences
  useEffect(() => {
    if (!syncWithOS && typeof window !== "undefined") {
      localStorage.setItem("slop-press-theme-mode", mode);
    }
  }, [mode, syncWithOS]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("slop-press-sync-with-os", syncWithOS);
    }
  }, [syncWithOS]);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          background: {
            default: mode === "dark" ? "#121212" : "#fff",
            paper: mode === "dark" ? "#121212" : "#fff",
          },
          text: {
            primary: mode === "dark" ? "#fff" : "#000",
          },
        },
        components: {
          MuiCard: {
            styleOverrides: {
              root: {
                backgroundColor: mode === "dark" ? "#121212" : "#fff",
                color: mode === "dark" ? "#fff" : "#000",
                transition: "background-color 0.3s ease, color 0.3s ease",
              },
            },
          },
        },
      }),
    [mode]
  );

  const toggleTheme = () => {
    if (syncWithOS) setSyncWithOS(false);
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  const toggleSyncWithOS = () => {
    setSyncWithOS((prev) => !prev);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Branding branding={branding} homeLink={homeLink} />
          <ThemeMenu
            mode={mode}
            toggleTheme={toggleTheme}
            syncWithOS={syncWithOS}
            toggleSyncWithOS={toggleSyncWithOS}
          />
        </Toolbar>
      </AppBar>
    </ThemeProvider>
  );
};

export default TopAppBar;
