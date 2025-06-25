import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

export const uploadToR2 = async (file: Buffer, bucketName: string, fileName: string): Promise<string | undefined> => {
  try {
    const s3 = new S3Client({
      region: "auto",
      endpoint: process.env.R2_ENDPOINT!,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY!,
        secretAccessKey: process.env.R2_SECRET_KEY!,
      },
    });
    
    await s3.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: fileName + '.png',
        ContentType: 'image/png',
        Body: file,
        ACL: "public-read",
      })
    );

    const uploadedUrl = `https://storage.r2.ogatakatsuya.com/${fileName}.png`;

    return uploadedUrl;
  } catch (error) {
    throw new Error(`Failed to upload file to R2: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};
