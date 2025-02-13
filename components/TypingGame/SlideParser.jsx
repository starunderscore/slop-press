export function parseSlides(rawContent) {
  // Remove YAML frontmatter if present using a regex:
  // This removes everything from the start (^) through the first occurrence of a line that only has "---"
  rawContent = rawContent.replace(/^---[\s\S]+?---/, '').trim();

  // Split the remaining content by lines starting with "## " (each slide starts with "## ")
  const slideParts = rawContent.split(/^##\s+/m).filter((part) => part.trim() !== "");
  
  return slideParts.map((part) => {
    const lines = part.split("\n");
    const header = lines.shift().trim();
    let paragraph = "";
    let code = "";
    let inCodeBlock = false;
    let codeLines = [];
    
    lines.forEach((line) => {
      if (line.trim().startsWith("```typing")) {
        inCodeBlock = true;
      } else if (line.trim() === "```" && inCodeBlock) {
        inCodeBlock = false;
      } else {
        if (inCodeBlock) {
          codeLines.push(line);
        } else {
          paragraph += line + "\n";
        }
      }
    });
    
    code = codeLines.join("\n").trim();
    return { header, paragraph: paragraph.trim(), code };
  });
}
