/* eslint-disable @typescript-eslint/no-var-requires */
const compression = require('compression');
const dotenv = require('dotenv');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const next = require('next');
const path = require('path');
const cors = require('cors');

dotenv.config();

const port = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // Security headers
  server.use(
    helmet({
      contentSecurityPolicy: false,
      frameguard: { action: 'deny' },
      referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
      xssFilter: true,
    }),
  );

  // Enable compression for better performance
  server.use(compression());

  const NEXT_PUBLIC_BASE_URL =
    process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001';
  // Enable CORS
  const corsOptions = {
    origin: [NEXT_PUBLIC_BASE_URL],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200, // For legacy browser support
  };
  server.use(cors(corsOptions));

  // Logging requests in production
  if (!dev) {
    server.use(morgan('combined'));
  }

  // Serve static files correctly
  server.use(
    '/_next/static',
    express.static(path.join(__dirname, '.next/static')),
  );
  server.use(
    '/static',
    express.static(path.join(__dirname, 'public')),
  );

  // Ensure correct asset handling
  server.use('/_next', express.static(path.join(__dirname, '.next')));

  // Health check endpoint
  server.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK' });
  });

  // Handle all Next.js requests
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  // Start the server
  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Server running on http://localhost:${port}`);
  });
});