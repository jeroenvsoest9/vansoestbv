const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const { db, storage, auth } = require('./src/config/database');

// Load environment variables
require('dotenv').config();

// Initialize Express
const server = express();

// Security middleware
server.use(helmet());
server.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'https://vansoest.nl',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
});
server.use(limiter);

// Other middleware
server.use(compression());
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(morgan('combined'));

// Serve static files from the React app
server.use(express.static(path.join(__dirname, 'public')));

// API routes
server.use('/api/auth', require('./src/routes/auth'));
server.use('/api/users', require('./src/routes/users'));
server.use('/api/projects', require('./src/routes/projects'));
server.use('/api/content', require('./src/routes/content'));
server.use('/api/social-media', require('./src/routes/social-media'));

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
server.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling
server.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
