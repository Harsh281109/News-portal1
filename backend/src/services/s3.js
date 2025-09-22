// Simple S3 uploader helper (AWS SDK v2)
const AWS = require('aws-sdk');
const { S3_BUCKET, S3_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } = require('../config');

if (!S3_BUCKET) throw new Error('S3_BUCKET not configured');

AWS.config.update({
  region: S3_REGION,
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY
});
const s3 = new AWS.S3();

async function uploadFile(buffer, key, mimetype) {
  const params = {
    Bucket: S3_BUCKET,
    Key: key,
    Body: buffer,
    ContentType: mimetype,
    ACL: 'public-read'
  };
  const r = await s3.upload(params).promise();
  return r.Location; // public URL
}

module.exports = { uploadFile };
