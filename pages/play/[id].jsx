import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import TopAppBar from "../../components/TopAppBar";
import TypingGame from "../../components/TypingGame";
import matter from "gray-matter";
import Button from "@mui/material/Button"

const ExercisePage = () => {
  const router = useRouter();
  const { id, folderId } = router.query;
  const [gameData, setGameData] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchGame = async () => {
      try {
        const response = await fetch(`/api/v1/lsov/typing-game/${id}`);
        if (!response.ok) throw new Error("Failed to fetch game data");

        const data = await response.json();

        if (!data.markdown || typeof data.markdown !== "string") {
          throw new Error("Invalid markdown content received");
        }

        setGameData(data);
      } catch (error) {
        console.error("Error fetching game:", error);
      }
    };

    fetchGame();
  }, [id]);

  if (!gameData) return <p>Loading...</p>;

  try {
    // ✅ Ensure markdown is a string before parsing
    const parsedMarkdown = matter(gameData.markdown || "");
    const markdownContent = parsedMarkdown.content || "";

    // ✅ Extract the typing challenge block
    const typingMatch = markdownContent.match(/```typing\n([\s\S]*?)\n```/);
    const typingText = typingMatch ? typingMatch[1].trim() : "";

    // ✅ Remove typing block from paragraph
    const cleanedParagraph = markdownContent.replace(/```typing\n[\s\S]*?\n```/, "").trim();

    // ✅ Construct slide data
    const parsedSlides = [
      {
        header: parsedMarkdown.data.title || "Typing Challenge",
        paragraph: cleanedParagraph,
        code: typingText, // Extracted text for typing
      },
    ];

    return (
      <Layout>
        <TopAppBar />
        <TypingGame
          rawContent={gameData.markdown}
          slides={parsedSlides}
          allowBackspace={false}
          timeLimit={180}
          language="en"
          folderId={folderId}
        />
      </Layout>
    );
  } catch (error) {
    console.error("Markdown parsing error:", error);
    return <p>Error loading game content.</p>;
  }
};

export default ExercisePage;
