# Task Challenger

## Node JS v23.7.0

## Setting Up

1. Create a file named `.env` in the root directory with the following content:

```
NODE_ENV=dev
APP_PORT=
JWT_SECRET=

DATABASE_TYPE=postgres
DATABASE_HOST=
DATABASE_PORT=5432
DATABASE_USERNAME=
DATABASE_PASSWORD=
DATABASE_NAME=
DATABASE_MAX_POOL_SIZE=10
DATABASE_LOGGING=true
```

**Note:** All environment variables are required.

## Running with Docker

1. Install Docker if you haven't already.

2. Build the Docker image:

```
docker build -t taskchallenger .
```

3. Run the Docker container:

```
docker run -d -p 3000:3000 taskchallenger
```

## Running with Node JS

1. Install the necessary packages:

```
npm install
```

2. Start the application:

- For development: `npm run dev`
- For production: `npm run start`

## Database

When the application starts, it will create the database and tables automatically. Ensure to create the database with the names specified in the environment variables.

## Health Check

To verify that the application is running, you can perform a health check using the following command:

```
curl -X GET http://localhost:3000/health
```

## Example APIs

## Example APIs

Refer to the [api.http](https://github.com/Mrthnx/task_challenger/blob/master/api.http) file for example API requests.

## Deployment

All pushes to the `master` branch will be automatically deployed to an EC2 instance on AWS using GitHub Actions for continuous integration and deployment.
