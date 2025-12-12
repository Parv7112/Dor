# DOR - Backend

Backend server for the DOR built with Node.js, Express, and MongoDB.

## Installation

```bash
npm install
```

## Environment Setup

Create a `.env` file in the root directory with the following variables:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/dor-application
```

Or copy from `.env.example` if available:
```bash
cp .env.example .env
```

**Note:** Make sure MongoDB is running on your system. Update `MONGODB_URI` if your MongoDB instance is hosted elsewhere (e.g., MongoDB Atlas).

## Project Structure

```
backend/
├── config/
│   └── database.js          # MongoDB connection configuration
├── controllers/             # Request handlers
│   └── exampleController.js
├── middlewares/             # Custom middleware functions
│   ├── errorHandler.js
│   └── notFound.js
├── models/                  # Mongoose models (schemas)
├── routes/                  # API route definitions
│   └── index.js
├── services/                # Business logic layer
│   └── exampleService.js
├── server.js                # Application entry point
└── package.json
```

## Running the Server

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

The server will run on `http://localhost:5000` by default.

## API Endpoints

- `GET /` - Welcome message
- `GET /api/health` - Health check endpoint

