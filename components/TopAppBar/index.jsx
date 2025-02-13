// src/components/TopAppBar/index.jsx
import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import CssBaseline from "@mui/material/CssBaseline";
import Branding from "./Branding";
import ThemeMenu from "./ThemeMenu";
import { useThemeSettings } from "../../pages/_app"; // Adjust the import path as needed

const TopAppBar = ({ branding = "Slop Press", homeLink = "/" }) => {
  const { mode, toggleTheme, syncWithOS, toggleSyncWithOS } = useThemeSettings();

  return (
    <>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar
          sx={{
            width: "100%",
            maxWidth: "800px",
            m: "0 auto",
          }}
        >
          <Branding branding={branding} homeLink={homeLink} />
          <ThemeMenu
            mode={mode}
            toggleTheme={toggleTheme}
            syncWithOS={syncWithOS}
            toggleSyncWithOS={toggleSyncWithOS}
          />
        </Toolbar>
      </AppBar>
    </>
  );
};

export default TopAppBar;
