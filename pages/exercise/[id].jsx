// pages/exercise/[id].js
import React from "react";
import Layout from "../../components/Layout";
import TopAppBar from "../../components/TopAppBar";
import TypingGame from "../../components/TypingGame";

// For demonstration, we're using static data.
// In a real app, you could fetch data from a CMS or file system.
const dummyContent = `---
title: "Typing Challenge"
description: "Practice your typing skills with this challenge exercise."
---

## Pattern Recognition

Improve your accuracy by typing the text below exactly as it appears.

\`\`\`typing
The quick brown fox jumps over the lazy dog
\`\`\`
`;

const ExercisePage = () => {
  console.log('dummyContent', dummyContent)
  return (
    <Layout>
      <TopAppBar />
      <TypingGame rawContent={dummyContent} allowBackspace={false} timeLimit={180} language="en" />
    </Layout>
  );
};

export default ExercisePage;
