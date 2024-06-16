import { ConfigOptions } from 'cloudinary';
import { CorsOptions } from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const cloudinaryConfigOptions: ConfigOptions = {
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
};

let whitelist = [
  'http://twit-match-play-client.vercel.app',
  'https://twit-match-play-client.vercel.app',
  'http://localhost:3000',
  'https://localhost:3000'
];

const CORS_OPTIONS: CorsOptions = {
  origin: whitelist,
  optionsSuccessStatus: 200,
  credentials: true
};

export = {
  PORT: process.env.PORT,
  URI: process.env.URI!,
  JWT_SECRET: process.env.JWT_SECRET!,
  CLOUDINARY_CONFIG: cloudinaryConfigOptions,
  CORS_OPTIONS
};
