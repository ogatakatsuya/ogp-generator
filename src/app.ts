import { Logger } from "@aws-lambda-powertools/logger";

import type { Request, Response } from "./type";
import { generateOgImage } from "./gen";
import { uploadToR2 } from "./upload";

const logger = new Logger({ serviceName: "ogp-generator" });

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Request} event
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object}
 * 
 */
export const handler = async (event: Request): Promise<Response> => {
  logger.info("Processing event", { event });

  if (!event.title) {
    logger.error("Title is required");
    return {
      statusCode: 400,
      message: "Title is required",
    };
  }

  if (!event.tags) {
    logger.error("Tags are required");
    return {
      statusCode: 400,
      message: "Tags are required",
    };
  }

  try {
    const generatedImage = await generateOgImage(event.title, event.tags);

    const url = await uploadToR2(generatedImage, "me-ogp", event.title);

    return {
      statusCode: 200,
      message: `Image generated and uploaded successfully: ${url}`,
    };
  } catch (error) {
    logger.error("Error generating image", { error });
    return {
      statusCode: 500,
      message: "Error generating image",
    };
  }
};
