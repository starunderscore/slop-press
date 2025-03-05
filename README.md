# Slop Press - Cognitive Maintenance Tool

## Project Overview

  In today's rapidly evolving world, our cognitive abilities are more critical than ever. Just like any complex system, our minds require maintenance to function optimally. Neglecting this mental upkeep can diminish our capacity to tackle intricate problems and edge-cases.  Slop Press is designed as a proactive tool for cognitive maintenance, functioning as a "gym for your mind."

  Instead of rote memorization or exhaustive learning, Slop Press focuses on efficient, pattern-based knowledge acquisition. It leverages AI-generated content to create engaging typing exercises that distill complex subjects into their core patterns.  By using Slop Press, you can rapidly grasp the fundamental concepts across diverse domains, from linguistics and mathematics to scientific principles and creative arts.

## Key Features (Phase 2 Completion)

*   **Folder Organization:** Users can create and manage folders to organize their typing game content.
*   **Markdown Typing Games:**  The core functionality revolves around creating and playing typing games based on Markdown formatted text files.
*   **Play from Folder:** Users can easily start typing games directly from folder views, playing files within a specific folder.
*   **Completion Tracking:**  The application tracks user progress by counting file completions, providing motivation and a sense of achievement.
*   **User-Friendly Interface:** Built with React and Material UI, the application offers a clean, intuitive, and responsive user experience.
*   **Homepage as Root Folder View:** The homepage provides a clear overview of the root folder structure, serving as the central starting point for navigation.
*   **File and Folder Actions:** Users can rename and delete folders and files directly within the application.
*   **Navigation Breadcrumbs:**  Clear breadcrumbs help users understand their current location within the folder structure.
*   **Global Loading Indicator:** (Optional - can be implemented for smoother page transitions) Provides visual feedback during navigation.
*   **AI Prompt Integration:** A "Get AI Prompt" button (lightbulb icon in the TopAppBar) provides users with an AI prompt to guide content generation for Slop Press typing games using AI chat assistants.
*   **Create Markdown File Feature:** Users can now create new Markdown files directly within Slop Press through the "Folder Actions Menu" in folder views. This feature includes:
    *   A modal for entering Markdown content.
    *   Auto-filename generation based on the first H1 header in the content (optional manual filename input).
    *   Responsive modal design for optimal use in split-screen setups.
    *   Backend API integration to save created files persistently.
    *   Success and error feedback using Material UI Snackbars.
    *   File creation in both folders and the root directory.

## Technologies Used

*   **Frontend:**
    *   [Next.js](https://nextjs.org/): React framework for server-side rendering and routing.
    *   [React](https://reactjs.org/): JavaScript library for building user interfaces.
    *   [Material UI (MUI)](https://mui.com/): React UI component library for a polished and consistent design.
    *   [axios](https://axios-http.com/):  Promise-based HTTP client for making API requests.
*   **Backend:**
    *   [Node.js](https://nodejs.org/): JavaScript runtime environment for the backend API.
    *   [Express.js](https://expressjs.com/): (Implied - likely using Next.js API routes which are based on Node.js/serverless functions).
*   **Database:**
    *   [PostgreSQL](https://www.postgresql.org/): Relational database for storing folder and file data (inferred from Sequelize configuration).
    *   [Sequelize](https://sequelize.org/): Node.js ORM for interacting with the PostgreSQL database.
*   **Other:**
    *   [Markdown](https://www.markdownguide.org/):  Markup language for creating typing game content.

## Setup and Installation (Basic)

1.  **Clone the repository:**
    ```bash
    git clone [repository-link-goes-here]  # Replace with your actual repository link
    cd slop-press
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Configure Environment Variables:**
    *   Create a `.env.local` file in the project root.
    *   Define the following environment variables (adjust with your actual database credentials):
        ```
        DB_NAME=your_database_name
        DB_USER=your_database_user
        DB_PASSWORD=your_database_password
        DB_HOST=your_database_host (e.g., localhost or your database server address)
        DB_DIALECT=postgres
        DB_PORT=5432 (or your PostgreSQL port)
        DB_SSL=false (or true if you are using SSL for your database connection)
        ```
4.  **Database Setup:**
    *   Ensure you have PostgreSQL installed and running.
    *   Create a database named as specified in your `.env.local` file (`DB_NAME`).
    *   Sequelize should automatically create the necessary tables when you run the application for the first time (due to `db.sequelize.sync({})` in `models/index.js`).
    *   **Note:** For production, consider using database migrations for schema management instead of `sequelize.sync({})`.
5.  **Run the development server:**
    ```bash
    npm run dev
    ```
6.  **Access the application:** Open your browser and navigate to `http://localhost:3000`.

## Possible Future Enhancements (Phase 4 and Beyond)

*   **User Authentication and Accounts:** Implement user registration and login to personalize the experience and potentially allow for saving user progress across devices.
*   **Typing Game Enhancements:**
    *   More game modes and variations (e.g., accuracy tracking, speed metrics, different text display modes).
    *   Progressive difficulty levels.
*   **Content Library/Marketplace:**  Allow users to share and discover typing game content created by others.
*   **Visual Design and Styling Polish:** Further refine the visual design and styling for a more professional and branded look.
*   **Deployment to Production:**  Deploy the application to a hosting platform for wider accessibility.
*   **Advanced File Management:** Implement features like file editing, moving, and bulk actions within folders.

## License

Think of this software as something you're welcome to borrow and use for your personal growth and enjoyment.

Please feel free to use it, learn from it, and even adapt it for your **personal, non-commercial purposes**.

However, in the spirit of friendly sharing and respecting the effort put into creating it, please **do not redistribute it as your own, sell it, or use it for commercial gain.**  It remains my creation.

All rights are reserved by the developer.

---

**Developed with ❤️ by Michael Hunt (Star Underscore) and powered by Gemini 🚀**