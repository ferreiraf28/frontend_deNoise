# deNoise Frontend

Note: For the main project README, please head to the [deNoise Backend GitHub repository.](https://github.com/tiagocrz/deNoise)

This README's purpose is to add some extra notes specifically in our frontend's functioning, which was implemented in lovable in this seperate repository.

## Short descripition of the most relevant files in the frontend code:

To briefly explain the architecture of the frontend implemented we'll state the main purpose of the files that were the main focus to achieve our desired frontend:

** Main pages in the UI **: These files handle the UI experience in all the main pages in our frontend.

src/pages/Auth.tsx - Log-in and Sign-up pages
src/pages/Chat.tsx - Conversational agent page
src/pages/Home.tsx - Landing page of our app
src/pages/Podcast.tsx - Podcast feature page
src/pages/Report.tsx - Report feature page

** Other important files **: These files ensure that the orchestration between all pages is smooth, as well as the connection with our FastAPI Backend.

src/context/GlobalStateContext.tsx - Manages global state for chat history, report data, and podcast data (when to clear/refresh the UI state)
src/hooks/useAuth.tsx - Handles the authentication and login/signup logic for the app
src/services/api.ts - API service layer for FastAPI backend

## How to run the frontend locally?

This project is fully deployed online (frontend hosted in lovable and backend deployed in render), so it can be tried fully tested [here.](https://denoise.lovable.app)

However, the frontend can be ran locally. The requirements for running the frontend in a localhost are having Node.js & npm installed - [install with nvm here (specifically the "Install & Update Script" section)](https://github.com/nvm-sh/nvm#installing-and-updating)

Then, follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

This final command will start a localhost server. This local host server is also connected with the backend deployed in render.

## What technologies are used for this frontend?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS