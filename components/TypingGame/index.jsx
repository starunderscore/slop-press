// components/TypingGame/index.jsx
import React, { useState, useEffect, useRef } from "react";
import { parseSlides } from "./SlideParser";
import SlideDisplay from "./SlideDisplay";
import CompletionScreen from "./CompletionScreen";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

// Helper function to remove diacritics (accents) from a string.
const stripDiacritics = (str) => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

const TypingGame = ({ rawContent = "", allowBackspace, timeLimit, language }) => {
  const [slides, setSlides] = useState([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [errorCount, setErrorCount] = useState(0);
  const [overallErrorCount, setOverallErrorCount] = useState(0);
  const [completed, setCompleted] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) containerRef.current.focus();
  }, []);

  // Parse slides only when rawContent changes
  useEffect(() => {
    if (rawContent) {
      const parsedSlides = parseSlides(rawContent);
      console.log("parsedSlides", parsedSlides);
      setSlides(parsedSlides);
      setUserInput("");
      setErrorCount(0);
    }
  }, [rawContent]);

  useEffect(() => {
    if (slides.length > 0) {
      const currentSlide = slides[currentSlideIndex];
      const targetText = currentSlide.code;
      if (
        stripDiacritics(userInput).toLowerCase() ===
        stripDiacritics(targetText).toLowerCase()
      ) {
        if (currentSlideIndex < slides.length - 1) {
          setTimeout(() => {
            setCurrentSlideIndex(currentSlideIndex + 1);
          }, 1000);
        } else {
          setCompleted(true);
        }
      }
    }
  }, [userInput, slides, currentSlideIndex]);

  const handleKeyDown = (e) => {
    if (e.key.length !== 1) return;
    const currentTarget = slides[currentSlideIndex]?.code || "";
    if (userInput.length >= currentTarget.length) return;
    const expectedChar = currentTarget[userInput.length];
    const normalizedKey = stripDiacritics(e.key).toLowerCase();
    const normalizedExpected = stripDiacritics(expectedChar).toLowerCase();
    if (normalizedKey === normalizedExpected) {
      setUserInput((prev) => prev + e.key);
    } else {
      setErrorCount((prev) => prev + 1);
      setOverallErrorCount((prev) => prev + 1);
    }
  };

  const restartExercise = () => {
    setCompleted(false);
    setCurrentSlideIndex(0);
    setUserInput("");
    setErrorCount(0);
    setOverallErrorCount(0);
  };

  if (completed) {
    return (
      <CompletionScreen
        overallErrorCount={overallErrorCount}
        onRestart={restartExercise}
      />
    );
  }

  // Compute the array of characters from the current slide's code.
  const currentSlide = slides[currentSlideIndex] || {};
  const slideChars = currentSlide.code ? currentSlide.code.split("") : [];

  return (
    <Box
      ref={containerRef}
      autoFocus
      tabIndex={0}
      onKeyDown={handleKeyDown}
      sx={{
        outline: "none",
        p: 2,
        width: "100%",
        maxWidth: "800px !important",
        m: "0 auto",
      }}
    >
      {slides.length === 0 ? (
        <Typography variant="body1">Loading slides...</Typography>
      ) : (
        <>
          <SlideDisplay slide={currentSlide} userInput={userInput} slideChars={slideChars} />
          <Box sx={{ mt: 2 }}>
            <Typography variant="body1">
              <strong>Typed:</strong> {userInput}
            </Typography>
            <Typography variant="body1">
              <strong>Errors:</strong> {errorCount}
            </Typography>
          </Box>
          <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
            {currentSlideIndex > 0 && (
              <Button variant="outlined" onClick={() => setCurrentSlideIndex(currentSlideIndex - 1)}>
                Previous
              </Button>
            )}
            {currentSlideIndex < slides.length - 1 && (
              <Button variant="outlined" onClick={() => setCurrentSlideIndex(currentSlideIndex + 1)}>
                Next
              </Button>
            )}
          </Box>
        </>
      )}
    </Box>
  );
};

export default TypingGame;
