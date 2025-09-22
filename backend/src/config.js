require('dotenv').config();
module.exports = {
  PORT: process.env.PORT || 4000,
  MONGO_URI: process.env.MONGO_URI || 'mongodb://mongo:27017/newsportal',
  JWT_SECRET: process.env.JWT_SECRET || 'change_this',
  SETUP_TOKEN: process.env.SETUP_TOKEN || '',
  USE_S3: process.env.USE_S3 === 'true',
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  S3_BUCKET: process.env.S3_BUCKET,
  S3_REGION: process.env.S3_REGION
};

