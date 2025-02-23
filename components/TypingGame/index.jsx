import React, { useState, useEffect, useRef } from "react";
import { parseSlides } from "./SlideParser";
import SlideDisplay from "./SlideDisplay";
import CompletionScreen from "./CompletionScreen";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

const TypingGame = ({ rawContent = "", allowBackspace, timeLimit, language }) => {
  const [slides, setSlides] = useState([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [currentBlockIndex, setCurrentBlockIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [errorCount, setErrorCount] = useState(0);
  const [overallErrorCount, setOverallErrorCount] = useState(0);
  const [completed, setCompleted] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) containerRef.current.focus();
  }, []);

  useEffect(() => {
    if (rawContent) {
      const parsedSlides = parseSlides(rawContent);
      console.log("parsedSlides", parsedSlides);
      setSlides(parsedSlides);
      setUserInput("");
      setErrorCount(0);
      setCurrentBlockIndex(0);
    }
  }, [rawContent]);

  useEffect(() => {
    if (slides.length > 0) {
      const currentSlide = slides[currentSlideIndex] || {};
      const blocks = currentSlide.codeBlocks || [];
      const targetText = blocks[currentBlockIndex] || "";
  
      if (userInput === targetText) {
        // User has correctly typed the current block
  
        if (currentBlockIndex < blocks.length - 1) {
          // Move to the next block on the SAME slide
          setTimeout(() => {
            setCurrentBlockIndex((prevIndex) => prevIndex + 1);
            setUserInput("");
            setErrorCount(0); // Reset error count for the new block
          }, 500);
        } else {
          // User has completed the LAST block on the current slide
  
          if (currentSlideIndex < slides.length - 1) {
            // Move to the NEXT slide
            setTimeout(() => {
              setCurrentSlideIndex((prevIndex) => prevIndex + 1);
              setCurrentBlockIndex(0); // Reset block index to start from the first block of the new slide
              setUserInput("");
              setErrorCount(0); // Reset error count for the new slide
            }, 1000);
          } else {
            // User has completed the LAST block on the LAST slide - Exercise OVER
            setCompleted(true);
          }
        }
      }
    }
  }, [userInput, currentBlockIndex, slides, currentSlideIndex]);
  
  const handleKeyDown = (e) => {
    if (e.key.length !== 1 && e.key !== "Backspace") return;
    const currentSlide = slides[currentSlideIndex] || {};
    const blocks = currentSlide.codeBlocks || [];
    const currentTarget = blocks[currentBlockIndex] || "";

    if (e.key === "Backspace" && allowBackspace) {
      setUserInput((prev) => prev.slice(0, -1));
      return;
    }

    if (userInput.length >= currentTarget.length) return;
    const expectedChar = currentTarget[userInput.length] || "";

    if (e.key === expectedChar) {
      setUserInput((prev) => prev + e.key);
    } else {
      setErrorCount((prev) => prev + 1);
      setOverallErrorCount((prev) => prev + 1);
    }
  };

  const restartExercise = () => {
    setCompleted(false);
    setCurrentSlideIndex(0);
    setCurrentBlockIndex(0);
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

  const currentSlide = slides[currentSlideIndex] || {};
  const blocks = currentSlide.codeBlocks || [];
  const slideChars = (blocks[currentBlockIndex] || "").split("");


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
          {/* ✅ Pass blocks and currentBlockIndex directly */}
          <SlideDisplay slide={currentSlide} userInput={userInput} blocks={blocks} currentBlockIndex={currentBlockIndex} />
          <Box sx={{ mt: 2 }}>
            <Typography variant="body1">
              <strong>Typed:</strong> {userInput}
            </Typography>
            <Typography variant="body1">
              <strong>Errors:</strong> {errorCount}
            </Typography>
          </Box>
        </>
      )}
    </Box>
  );
};

export default TypingGame;
