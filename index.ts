import dotenv from 'dotenv';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import winston from 'winston';

import { serverConfig } from './config';
import { config, db, logging, prod, routes } from './startup';

dotenv.config();

const { PORT, CORS_OPTIONS } = serverConfig;
const app = express();
app.use(cors(CORS_OPTIONS));

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: CORS_OPTIONS
});

// health check
app.get('/status', (_, res) => {
  res.status(200).json('API is live');
  console.log('for debug purpose');
});

// startup configuration
logging();
config();
db();

// routes, middlewares, and optimizations
routes(app);
prod(app);

type SocketPaylod = {
  conversationId: string;
  sender: string;
  text: string;
  date: Date;
};

io.on('connection', (socket) => {
  console.log(`node- connected: ${socket.id}`);

  socket.on('send', (data: SocketPaylod) => {
    // emit to corresponding conversation
    console.log('socket, data recieved=', data);

    io.emit(data.conversationId, data);
  });
});

httpServer.listen(PORT, () =>
  winston.info(`Server started on port ${PORT}...`)
);
