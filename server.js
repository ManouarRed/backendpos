
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('node:fs'); // Using fs from 'node:fs'
const { ensureDataDirAndFile } = require('./services/dataService'); // Import helper

const app = express();
const PORT = process.env.PORT || 80;

// Middleware
// Configure CORS - for development, allow all. For production, restrict to your frontend domain.
const corsOptions = {
  origin: process.env.CORS_ORIGIN || '*', // Allow all for dev, set specific for prod
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true // if you need to pass cookies or auth headers
};
app.use(cors(corsOptions));
app.use(express.json()); // Parse JSON request bodies

// Dynamically load routes
const routesPath = path.join(__dirname, 'routes');
fs.readdirSync(routesPath).forEach(file => {
  if (file.endsWith('.js')) {
    const routeName = file.split('.')[0];
    const routeModule = require(path.join(routesPath, file));
    if (typeof routeModule === 'function') { // Check if it's an Express Router
        app.use(`/api/${routeName}`, routeModule);
        console.log(`Routes for /api/${routeName} loaded from ${file}`);
    } else {
        console.warn(`File ${file} in routes directory does not export an Express Router. Skipping.`);
    }
  }
});


// Basic root route
app.get('/', (req, res) => {
  res.send('POS Backend Server is running!');
});

// 404 Handler for API routes (if no other route matched under /api)
app.use('/api/*', (req, res, next) => {
    res.status(404).json({ message: `API endpoint not found: ${req.method} ${req.originalUrl}` });
});

// Generic Error Handler
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err.stack || err.message || err);
  // Avoid sending stack trace in production
  const statusCode = err.status || err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production' && statusCode === 500 
                ? 'An unexpected internal server error occurred.' 
                : (err.message || 'Internal Server Error');
  res.status(statusCode).json({ message });
});

// Start the server
const startServer = async () => {
  try {
    // Ensure essential data files exist (or are created empty) before starting
    // This prevents errors if files are missing on first run.
    await ensureDataDirAndFile('categories.json', []);
    await ensureDataDirAndFile('manufacturers.json', []);
    await ensureDataDirAndFile('products.json', []);
    await ensureDataDirAndFile('users.json', []); // Backend will handle hashing for new users
    await ensureDataDirAndFile('sales.json', []);

    app.listen(PORT, () => {
      console.log(`Backend server listening on http://localhost:${PORT}`);
      console.log(`DATA_DIR is set to: ${path.resolve(process.env.DATA_DIR || './data')}`);
      if (process.env.CORS_ORIGIN) {
        console.log(`CORS enabled for origin: ${process.env.CORS_ORIGIN}`);
      } else {
        console.warn(`CORS enabled for all origins ('*'). This is suitable for development but should be restricted in production.`);
      }
    });
  } catch (error) {
    console.error("Failed to initialize data directory or files:", error);
    console.error("Please ensure the DATA_DIR in your .env file points to a writable directory and that the initial JSON data files are present or can be created.");
    process.exit(1); // Exit if server can't initialize properly
  }
};

startServer();
