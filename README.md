# Task Challenger

A RESTful API backend application built with Node.js, Express, TypeScript, and TypeORM for managing tasks with user authentication.

## Prerequisites

- **Node.js**: v23.7.0 or higher
- **PostgreSQL**: 12 or higher
- **Docker** (optional): For containerized deployment

## Features

- User authentication with JWT
- Task management (CRUD operations)
- PostgreSQL database with TypeORM
- Automated CI/CD with GitHub Actions
- Docker support
- Health check endpoint

## Getting Started

### 1. Environment Configuration

Copy the example environment file and configure your local settings:

```bash
cp .env.example .env
```

Edit `.env` with your configuration. All environment variables are required.

**For production/deployment**: Configure GitHub Secrets following the [GITHUB_SECRETS.md](./GITHUB_SECRETS.md) guide.

### 2. Database Setup

Create a PostgreSQL database with the name specified in your `.env` file:

```bash
# Using psql
createdb task_challenger

# Or using SQL
CREATE DATABASE task_challenger;
```

The application will automatically create tables and run migrations on startup.

### 3. Installation

Install dependencies:

```bash
npm install
```

## Running the Application

### Development Mode

```bash
npm run dev
```

The application will start with hot-reload enabled.

### Production Mode

```bash
npm run build
npm start
```

### Using Docker

1. Ensure your `.env` file is configured (the Dockerfile will copy it automatically)

2. Build the Docker image:

```bash
docker build -t taskchallenger .
```

3. Run the container:

```bash
docker run -d -p 3000:3000 taskchallenger
```

Alternatively, you can pass environment variables individually:

```bash
docker run -d -p 3000:3000 \
  -e NODE_ENV=production \
  -e APP_PORT=3000 \
  -e JWT_SECRET=your_secret \
  taskchallenger
```

## Testing

Run the test suite:

```bash
npm test
```

Run tests with coverage:

```bash
npm run test:cov
```

## API Documentation

The API endpoints are documented in OpenAPI/Swagger format. See the [task_challenge.yml](./task_challenge.yml) file for detailed API specifications.

### Health Check

Verify the application is running:

```bash
curl http://localhost:3000/health
```

Expected response:
```json
{
  "status": "ok"
}
```

## Project Structure

```
├── src/
│   ├── config/          # Configuration files (database, environment, etc.)
│   ├── migrations/      # TypeORM migrations
│   ├── module/          # Application modules
│   └── utils/           # Utility functions
├── test/                # Test files
├── .env.example         # Environment variables template
└── task_challenge.yml   # API documentation
```

## Database Migrations

Generate a new migration:

```bash
npm run migration:generate
```

Clear cache:

```bash
npm run typeorm:cache
```

## CI/CD Pipeline

The project uses GitHub Actions for continuous integration and deployment:

- **Tests**: Automatically run on every push and pull request to `master`
- **Deployment**: Automatic deployment to AWS EC2 after successful tests on `master` branch

### Workflow Status

- ✅ Tests run on every PR
- 🚀 Auto-deploy to production on merge to `master`

## Deployment

All pushes to the `master` branch trigger:

1. Automated test execution
2. Docker image build on EC2
3. Container deployment with environment variables from GitHub Secrets

For deployment configuration, see [GITHUB_SECRETS.md](./GITHUB_SECRETS.md).

## Contributing

1. Create a feature branch from `master`
2. Make your changes
3. Ensure tests pass: `npm test`
4. Create a pull request

## License

This project is private and proprietary.
