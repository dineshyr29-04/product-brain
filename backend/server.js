import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import ticketsRouter from './routes/tickets.js';
import dashboardsRouter from './routes/dashboards.js';
import opportunitiesRouter from './routes/opportunities.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'ProductBrain V1 API',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/tickets', ticketsRouter);
app.use('/api/dashboards', dashboardsRouter);
app.use('/api/opportunities', opportunitiesRouter);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 ProductBrain V1 Server listening on http://localhost:${PORT}`);
});
