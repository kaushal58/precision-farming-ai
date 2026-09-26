import 'dotenv/config';
import http from 'http';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import { Server } from 'socket.io';
import connectDB from './config/db.js';
import logger from './config/logger.js';
import errorHandler from './middleware/errorHandler.js';
import { initSocketHandlers } from './utils/socket.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import cropRoutes from './routes/crop.routes.js';
import diseaseRoutes from './routes/disease.routes.js';
import pestRoutes from './routes/pest.routes.js';
import irrigationRoutes from './routes/irrigation.routes.js';
import weatherRoutes from './routes/weather.routes.js';
import chatRoutes from './routes/chat.routes.js';
import notificationRoutes from './routes/notification.routes.js';
import adminRoutes from './routes/admin.routes.js';
import reportRoutes from './routes/report.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true },
});
app.set('io', io);

connectDB();

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    message: { success: false, message: 'Too many requests' },
  })
);

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/api/health', (_, res) => {
  res.json({ success: true, service: 'AI Crop Guardian API', version: '1.0.0' });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/crops', cropRoutes);
app.use('/api/disease', diseaseRoutes);
app.use('/api/pest', pestRoutes);
app.use('/api/irrigation', irrigationRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.use(errorHandler);

initSocketHandlers(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => logger.info(`Server running on port ${PORT}`));

export default app;
