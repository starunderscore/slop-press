// src/components/TypingGame/SlideDisplay.jsx
import React from "react";
import { useTheme } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const stripDiacritics = (str) =>
  str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

// ✅ Modified to accept 'blocks' and 'currentBlockIndex'
const SlideDisplay = ({ slide, userInput, blocks, currentBlockIndex }) => {
  const theme = useTheme();
  // characters are now relevant to the *current typing block* not the whole slide
  const characters = blocks[currentBlockIndex]?.split("") || [];

  // ✅ Modified renderTargetText to accept block and index
  const renderTargetText = (codeBlock, blockIndex) => (
    <Box
      key={blockIndex} // Add key for map
      sx={{
        mt: 1,
        display: "flex",
        flexWrap: "wrap",
        whiteSpace: "pre-wrap",
        backgroundColor: theme.palette.mode === "dark" ? "#333" : "#f5f5f5",
        p: 2,
        borderRadius: 1,
      }}
    >
      {codeBlock.split("").map((char, index) => {
        let letterStyle = {};
        // ✅ Only apply typing feedback to the *current* block
        if (blockIndex === currentBlockIndex && index < userInput.length) {
          const normalizedExpected = stripDiacritics(char).toLowerCase();
          const normalizedInput = stripDiacritics(userInput[index]).toLowerCase();
          letterStyle.color =
            normalizedExpected === normalizedInput
              ? theme.palette.success.main
              : theme.palette.error.main;
        }
        if (blockIndex === currentBlockIndex && index === userInput.length) {
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

  return (
    <Card
      sx={{
        my: 2,
        backgroundColor:
          theme.palette.mode === "dark" ? theme.palette.grey[900] : theme.palette.grey[100],
        color: theme.palette.text.primary,
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
        {/* ✅ Use .map to render ALL code blocks */}
        {slide.codeBlocks && blocks.map((codeBlock, index) => (
          <Box key={index} sx={{ mt: 2 }}>{renderTargetText(codeBlock, index)}</Box>
        ))}
      </CardContent>
    </Card>
  );
};

export default SlideDisplay;