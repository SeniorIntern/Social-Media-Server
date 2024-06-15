import dotenv from 'dotenv';
dotenv.config();

export default function () {
  const requiredEnvVars = [
    'JWT_SECRET',
    'PORT',
    'URI',
    'CLOUD_NAME',
    'API_KEY',
    'API_SECRET'
  ];

  requiredEnvVars.forEach((varName) => {
    if (!process.env[varName]) {
      throw new Error(`Fatal Error. ${varName} is not defined`);
    }
  });
}
