export function parseSlides(rawContent) {
  // Remove YAML frontmatter if present
  rawContent = rawContent.replace(/^---[\s\S]+?---/, "").trim();

  // Split content into slides based on H2 headers (##)
  const slideParts = rawContent.split(/^##\s+/m).filter((part) => part.trim() !== "");

  return slideParts.map((part) => {
    const lines = part.split("\n");
    const header = lines.shift().trim(); // The first line is always the header
    let paragraph = "";
    let codeBlocks = [];
    let inCodeBlock = false;
    let currentCodeBlock = [];

    lines.forEach((line) => {
      if (line.trim().startsWith("```typing")) {
        inCodeBlock = true;
        currentCodeBlock = []; // Start a new code block
      } else if (line.trim() === "```" && inCodeBlock) {
        inCodeBlock = false;
        codeBlocks.push(currentCodeBlock.join("\n").trim()); // Save completed code block
        currentCodeBlock = [];
      } else if (!inCodeBlock) { // Only add to paragraph if NOT in a code block
        paragraph += line + "\n";
      } else if (inCodeBlock) {
        currentCodeBlock.push(line); // Accumulate lines within the code block
      }
    });

    return { header, paragraph: paragraph.trim(), codeBlocks };
  });
}