import dotenv from 'dotenv';
import fs from 'fs';

const nodeEnv = process.env.NODE_ENV || 'development';
const envFile = `.env${nodeEnv === 'production' ? '.production' : ''}`;

if (fs.existsSync(envFile)) {
  dotenv.config({ path: envFile });
} else {
  dotenv.config();
}
