# News Portal - Full Stack (Node + React + MongoDB)

This repo is a production-ready boilerplate for a news portal with:
- React frontend (static)
- Node/Express backend (MongoDB, JWT auth)
- Local uploads (dev) and optional S3 support
- Docker + docker-compose for local dev

## Quick start (dev, requires Docker)
1. Copy files into your repo
2. Edit `docker-compose.yml` and `.env` values as needed (set JWT_SECRET and SETUP_TOKEN)
3. Start:
   ```bash
   docker-compose up --build

