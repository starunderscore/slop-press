// components/TypingGame/SlideDisplay.jsx
import React from "react";
import { useTheme } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

// Helper function to remove diacritics (accents) from a string.
const stripDiacritics = (str) => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

const SlideDisplay = ({ slide, userInput, slideChars }) => {
  const theme = useTheme();
  // Use slideChars if provided, otherwise split slide.code.
  const characters = slideChars || (slide.code ? slide.code.split("") : []);

  const renderTargetText = () => {
    return (
      <Box
        sx={{
          mt: 1,
          display: "flex",
          flexWrap: "wrap",
          whiteSpace: "pre-wrap", // Preserves spaces and line breaks
        }}
      >
        {characters.map((char, index) => {
          let letterStyle = {};
          if (index < userInput.length) {
            const normalizedExpected = stripDiacritics(char).toLowerCase();
            const normalizedInput = stripDiacritics(userInput[index]).toLowerCase();
            letterStyle.color =
              normalizedExpected === normalizedInput
                ? theme.palette.success.main
                : theme.palette.error.main;
          }
          if (index === userInput.length) {
            letterStyle.textDecoration = "underline";
          }
          return (
            <Typography
              key={index}
              component="span"
              sx={{
                fontFamily: "monospace",
                fontSize: "1.5rem",
                ...letterStyle,
              }}
            >
              {char}
            </Typography>
          );
        })}
      </Box>
    );
  };

  return (
    <Card
      sx={{
        my: 2,
        bgcolor: "background.paper", // Use theme background for card
        color: "text.primary",       // Use theme text color
        transition: "background-color 0.3s ease, color 0.3s ease",
      }}
    >
      <CardContent>
        <Typography variant="h5" component="h2">
          {slide.header}
        </Typography>
        {slide.paragraph && (
          <Typography variant="body1" sx={{ mt: 1 }}>
            {slide.paragraph}
          </Typography>
        )}
        {renderTargetText()}
      </CardContent>
    </Card>
  );
};

export default SlideDisplay;
