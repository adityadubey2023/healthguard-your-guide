# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/06c74964-a58d-4c34-b7d7-364517e31472

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/06c74964-a58d-4c34-b7d7-364517e31472) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

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

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/06c74964-a58d-4c34-b7d7-364517e31472) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)

## Using the ChatGPT-backed assistant (local)

This project ships with a small backend proxy you can run locally that forwards chat messages to the OpenAI API. The proxy reads the OpenAI API key from an environment variable so you don't store the key in source control.

Steps to run locally:

1. Copy the example env and set your key:

```bash
cp .env.example .env
# then edit .env and set OPENAI_API_KEY
```

2. Install server dependencies and start the proxy (from project root):

```bash
# install frontend deps as usual
npm install

# install server deps
npm install express cors

# start the backend proxy
node server/index.js
```

3. Start the frontend dev server (in another terminal):

```bash
npm run dev
```

During development Vite is configured to proxy `/api` to `http://localhost:3000` so the frontend can call `/api/chat` without exposing the key in browser code.

Security note: Never commit your real OpenAI API key to the repository. Use environment variables or a secrets manager in production.

