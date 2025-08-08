# React/Spring Boot Forum

A fullstack forum webapp developed to imporve skills in modern web development and end-to-end development. It combines a clean, modular tech stack:

- Backend: Spring Boot for a scalable REST API
- Frontend: React + TypeScript with React Router for site navigation
- UI: shadcn for  UI components, Tanstack Query for efficient data fetching, and Hookform + Zod for reliable form validation
- Authentication: Firebase with JWT for secure account management
- Deployment: Minimal Docker setup for easy deployment Render.io


## Demo

https://forum-p7wb.onrender.com

## Run Locally

Prerequisites:
- Node.js
- npm (comes with Node.js)
- Docker

Clone the project

```bash
  git clone https://github.com/jakub022/forum.git
```

Go to the project directory

```bash
  cd forum
```

Create a .env file based on the provided example

```bash
  copy .env.example .env
  #edit to include your config
```

Build the frontend for the Spring Boot app

```bash
  cd forum
  npm install
  npm run build
```

Build the Docker image

```bash
  docker build -t forum .
```

Run the Docker container

```bash
  docker run --env-file .env -p 8080:8080 forum
```
