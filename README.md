Redis TypeScript Web Application
A TypeScript Node.js web application that uses Redis for rate limiting and click counting, focused on CLI-based development.
Features

TypeScript Support: Fully typed application
Rate Limiting: Prevents API abuse by limiting requests per client
Click Counting: Tracks user interactions with different routes
Redis Integration: Uses Redis as an in-memory data store
CLI-focused Setup: Quick commands for setup and deployment

CLI Quick Start
Create project structure
bashCopy# Create project structure in one command
mkdir -p redis-ts-webapp/{src/{config,middleware,routes,types},dist}
cd redis-ts-webapp
Initialize project
bashCopy# Initialize npm and git
npm init -y
git init

# Install dependencies
npm install express redis dotenv helmet cors
npm install -D typescript @types/node @types/express @types/redis @types/cors @types/helmet ts-node nodemon

# Initialize TypeScript
npx tsc --init
Environment setup
bashCopy# Create .env file
cat > .env << EOL
PORT=3000
NODE_ENV=development
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100
EOL

# Create .gitignore
cat > .gitignore << EOL
node_modules/
.env
dist/
*.log
EOL
Run the application
bashCopy# Development mode
npm run dev

# Build TypeScript
npm run build

# Production mode
npm start
Testing API Endpoints
Use curl to test the endpoints:
bashCopy# Visit the home route
curl http://localhost:3000/

# Click counter test
curl http://localhost:3000/click-me

# Get statistics
curl http://localhost:3000/stats

# Test rate limiting (run multiple times quickly)
curl http://localhost:3000/test-rate-limit
Setting up Redis via CLI
Local Redis setup
bashCopy# Install Redis (Ubuntu/Debian)
sudo apt update
sudo apt install redis-server

# Start Redis
sudo systemctl start redis-server

# Check Redis status
redis-cli ping
Docker Redis setup
bashCopy# Run Redis in Docker
docker run --name redis -p 6379:6379 -d redis

# Check Redis container is running
docker ps
Deployment commands
Deploy to Railway
bashCopy# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Initialize project
railway init

# Add Redis plugin
railway add

# Deploy
railway up
Deploy to Render
bashCopy# Build the project
npm run build

# Create a Procfile for Render
echo "web: node dist/server.js" > Procfile

# Commit and push to your Git repository
git add .
git commit -m "Prepare for Render deployment"
git push
Then connect your repository in the Render dashboard.
Project Structure
Copyredis-ts-webapp/
├── .env                   # Environment variables
├── .gitignore             # Git ignore file
├── package.json           # NPM package file
├── tsconfig.json          # TypeScript configuration
├── README.md              # Project documentation
└── src/
    ├── config/
    │   └── redis.ts       # Redis connection configuration
    ├── middleware/
    │   ├── rateLimiter.ts # Rate limiter middleware
    │   └── clickCounter.ts # Click counter middleware
    ├── routes/
    │   └── index.ts       # API routes
    ├── types/
    │   └── index.ts       # TypeScript type definitions
    ├── app.ts             # Express application setup
    └── server.ts          # Entry point
License
MIT