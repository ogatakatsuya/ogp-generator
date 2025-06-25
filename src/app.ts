import { Logger } from "@aws-lambda-powertools/logger";
import { writeFile } from "fs/promises";
import { join } from "path";

import type { Request, Response } from "./type";
import { generateOgImage } from "./gen";

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

    const safeTitle = event.title.replace(/[^a-z0-9_\-]/gi, "_");
    const filePath = join(__dirname, "../assets", `${safeTitle}.png`);

    await writeFile(filePath, generatedImage);

    return {
      statusCode: 200,
      message: "Image generated and saved successfully",
    };
  } catch (error) {
    logger.error("Error generating image", { error });
    return {
      statusCode: 500,
      message: "Error generating image",
    };
  }
};
