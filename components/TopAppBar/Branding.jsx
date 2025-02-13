// components/TopAppBar/Branding.jsx
import React from "react";
import Typography from "@mui/material/Typography";

const Branding = ({ branding, homeLink }) => {
  return (
    <Typography
      variant="h6"
      component="a"
      href={homeLink}
      sx={{ flexGrow: 1, textDecoration: "none", color: "inherit" }}
    >
      {branding}
    </Typography>
  );
};

export default Branding;
