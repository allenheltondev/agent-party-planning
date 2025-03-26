import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';
import { buildResponse } from '../utils/helpers.mjs';

const s3Client = new S3Client();
const bedrock = new BedrockRuntimeClient();

export const handler = async (event) => {
  try {
    const { detailedImageDescription, style } = event;

    const prompt = `
    Create a graphic for a flyer that captures the essence of ${detailedImageDescription} in a ${style} style.
    The graphic should be a single image that is easy to understand and visually appealing with minimal to no text on it.
    Make sure it's appropriate for use in an office setting.
  `;

    const command = new InvokeModelCommand({
      modelId: 'amazon.titan-image-generator-v2:0',
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify({
        taskType: 'TEXT_IMAGE',
        textToImageParams: {
          text: prompt,
        },
        imageGenerationConfig: {
          width: 1024,
          height: 1024,
          numberOfImages: 1,
          quality: 'standard'
        }
      }),
    });

    const response = await bedrock.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));

    // Get the base64 image from the response
    const base64Image = responseBody.images[0];

    // Convert base64 to buffer
    const imageBuffer = Buffer.from(base64Image, 'base64');

    // Generate a unique filename
    const timestamp = new Date().getTime();
    const filename = `graphics/${timestamp}.png`;

    // Upload to S3
    const uploadCommand = new PutObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: filename,
      Body: imageBuffer,
      ContentType: 'image/png',
      ACL: 'public-read'
    });

    await s3Client.send(uploadCommand);

    return buildResponse(event, {
      imageUrl: `https://${process.env.BUCKET_NAME}.s3.amazonaws.com/${filename}`
    });
  } catch (err) {
    console.error(err);
    return buildResponse(event, { message: 'Error generating graphic' });
  }
};
