import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { z } from "zod";
import type { ScanDetectionResult } from "@geriatric-grooves/shared";

const client = new Anthropic();

const DetectionSchema = z.object({
  stairs: z.boolean().describe("A staircase is visible in the photo"),
  chair: z.boolean().describe("A sturdy chair is visible"),
  railing: z.boolean().describe("A railing or wall-mounted handrail is visible"),
  resistance_band: z.boolean().describe("A resistance exercise band is visible"),
  open_floor: z.boolean().describe("There is open floor space to move around safely"),
  wall_space: z.boolean().describe("There is open wall space nearby, useful for wall-supported exercises"),
  light_weights: z.boolean().describe("Light hand weights or dumbbells are visible"),
  small_space: z.boolean().describe("The space looks small or tight overall"),
});

const PROMPT =
  "You are helping an older adult set up a home mobility and exercise routine. Look at this " +
  "photo of their space and identify which of the following are visible or usable: a " +
  "staircase, a sturdy chair, a railing or wall-mounted handrail, a resistance exercise band, " +
  "open floor space to move around safely, open wall space (useful for wall-supported " +
  "exercises), light hand weights or dumbbells, and whether the space looks small or tight " +
  "overall. Answer conservatively — if something isn't clearly visible, mark it false.";

type SupportedMediaType = "image/jpeg" | "image/png" | "image/webp" | "image/gif";

function parseDataUrl(dataUrl: string): { mediaType: SupportedMediaType; base64: string } {
  const match = /^data:(image\/(?:jpeg|png|webp|gif));base64,(.+)$/.exec(dataUrl);
  if (!match) {
    throw new Error("Unsupported image format.");
  }
  return { mediaType: match[1] as SupportedMediaType, base64: match[2] };
}

export async function analyzeEnvironmentPhoto(imageDataUrl: string): Promise<ScanDetectionResult> {
  const { mediaType, base64 } = parseDataUrl(imageDataUrl);

  const response = await client.messages.parse({
    model: "claude-opus-4-8",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: [
          { type: "image", source: { type: "base64", media_type: mediaType, data: base64 } },
          { type: "text", text: PROMPT },
        ],
      },
    ],
    output_config: { format: zodOutputFormat(DetectionSchema) },
  });

  if (!response.parsed_output) {
    throw new Error("The scan didn't return a usable result.");
  }
  return response.parsed_output;
}
