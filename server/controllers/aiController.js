
const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const cleanAIResponse = (text) => {
  if (!text) return "";

  let cleaned = text.trim();

  cleaned = cleaned
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");

  if (firstBrace !== -1 && lastBrace !== -1) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }

  return cleaned.trim();
};

const sleep = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const getErrorStatus = (error) => {
  const status = Number(
    error?.status ||
      error?.statusCode ||
      error?.response?.status
  );

  if (Number.isFinite(status) && status > 0) {
    return status;
  }

  const message = String(error?.message || "");

  if (/\b429\b|RESOURCE_EXHAUSTED/i.test(message)) return 429;
  if (/\b503\b|UNAVAILABLE/i.test(message)) return 503;
  if (/\b504\b|DEADLINE_EXCEEDED/i.test(message)) return 504;
  if (/\b502\b/i.test(message)) return 502;
  if (/\b500\b|INTERNAL/i.test(message)) return 500;
  if (/\b408\b|TIMEOUT/i.test(message)) return 408;

  return 0;
};

const generateWithGemini = async (
  base64Image,
  mimeType,
  prompt
) => {
  const models = [
    "gemini-3.6-flash",
    "gemini-3.5-flash",
  ];

  const maxAttempts = 2;
  let lastError = null;

  for (const model of models) {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        console.log(
          `Trying Gemini model ${model}, attempt ${attempt}/${maxAttempts}`
        );

        const response = await ai.models.generateContent({
          model,
          contents: [
            {
              role: "user",
              parts: [
                {
                  inlineData: {
                    mimeType,
                    data: base64Image,
                  },
                },
                {
                  text: prompt,
                },
              ],
            },
          ],
          config: {
            responseMimeType: "application/json",
          },
        });

        console.log(`Gemini success: ${model}`);

        return response;
      } catch (error) {
        lastError = error;
        const status = getErrorStatus(error);

        console.error(
          `Gemini failed: model=${model}, status=${status}, attempt=${attempt}`,
          error.message
        );

        // Do not repeatedly retry quota/rate-limit errors.
        // Try the next configured model instead.
        if (status === 429) {
          console.warn(
            `Quota/rate limit reached for ${model}. Trying next model if available.`
          );
          break;
        }

        const retryable = [
          408, 500, 502, 503, 504,
        ].includes(status);

        if (!retryable) {
          throw error;
        }

        if (attempt < maxAttempts) {
          const delay = 2000 * attempt;

          console.log(`Retrying in ${delay}ms`);
          await sleep(delay);
        }
      }
    }

    console.log(`Attempts exhausted for ${model}.`);
  }

  throw lastError || new Error("All Gemini models failed");
};

exports.analyzePlant = async (req, res) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY is missing");

      return res.status(500).json({
        success: false,
        code: "AI_CONFIGURATION_ERROR",
        message: "AI service is not configured correctly.",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Plant image is required",
      });
    }

    const imageUrl =
      req.file.path ||
      req.file.secure_url ||
      req.file.url;

    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        message: "Uploaded image URL not found",
      });
    }

    const mimeType = req.file.mimetype || "";

    if (!["image/jpeg", "image/png", "image/webp"].includes(mimeType)) {
      return res.status(400).json({
        success: false,
        message: "Please upload a valid JPG, PNG, or WEBP image.",
      });
    }

    console.log("Plant image URL:", imageUrl);

    const imageResponse = await fetch(imageUrl);

    if (!imageResponse.ok) {
      throw new Error(
        `Unable to download image: HTTP ${imageResponse.status}`
      );
    }

    const imageBuffer = Buffer.from(
      await imageResponse.arrayBuffer()
    );

    const base64Image = imageBuffer.toString("base64");

    const validationPrompt = `
You are a strict plant image classifier.

Determine whether the uploaded image clearly contains a real biological plant.

Plants include trees, shrubs, herbs, grasses, flowers, indoor plants,
outdoor plants, crops, seedlings, leaves, stems, branches, fruits or
vegetables when clearly part of a plant.

Do not classify animals, humans, machines, furniture, buildings,
tools, toys, artificial plants, plastic plants, drawings, screenshots,
or unrelated objects as real plants.

If a real biological plant is clearly visible, return true.
Otherwise, return false.

Return ONLY valid JSON in this format:
{"isPlant": true}

or

{"isPlant": false}

Do not include any other fields or explanations.
`;

    console.log("Starting plant validation...");

    const validationResponse = await generateWithGemini(
      base64Image,
      mimeType,
      validationPrompt
    );

    const validationResult = cleanAIResponse(
      validationResponse.text
    );

    if (!validationResult) {
      throw new Error("Gemini returned an empty validation response");
    }

    let validationData;

    try {
      validationData = JSON.parse(validationResult);
    } catch (error) {
      console.error("Invalid validation JSON:", validationResult);

      return res.status(502).json({
        success: false,
        message:
          "AI returned an invalid validation response. Please try again.",
      });
    }

    if (validationData.isPlant !== true) {
      return res.status(400).json({
        success: false,
        code: "NOT_A_PLANT",
        isPlant: false,
        message:
          "This image does not appear to contain a plant. Please upload a clear plant image.",
      });
    }

    console.log("Plant image validated.");

    const prompt = `
You are an expert botanist and plant-care assistant.

Analyze only the plant visible in the uploaded image.

Return ONLY one valid JSON object with exactly these fields:

{
  "plantName": "",
  "scientificName": "",
  "plantType": "",
  "healthStatus": "",
  "disease": "",
  "description": "",
  "waterFrequency": "",
  "sunlight": "",
  "temperature": "",
  "humidity": "",
  "fertilizer": "",
  "careTips": []
}

Rules:
1. Identify the plant using visible characteristics.
2. Provide its most likely common name.
3. Give its scientific name only when reasonably identifiable.
4. If uncertain, use "Identification uncertain".
5. Do not invent a disease.
6. If no obvious symptoms are visible, use "No obvious disease detected".
7. Provide practical care guidance suitable for the identified plant.
8. Explain watering frequency, sunlight, temperature, humidity and fertilizer.
9. Include 3 to 5 useful care tips in careTips.
10. Do not discuss unrelated objects.
11. Do not use Markdown.
12. Do not add explanations outside the JSON.
13. Use double quotes for JSON keys and string values.
14. Do not add trailing commas.
15. Ensure the JSON object is complete.
`;

    console.log("Starting full plant analysis...");

    const response = await generateWithGemini(
      base64Image,
      mimeType,
      prompt
    );

    const result = cleanAIResponse(response.text);

    if (!result) {
      throw new Error("Gemini returned an empty analysis response");
    }

    let plantData;

    try {
      plantData = JSON.parse(result);
    } catch (error) {
      console.error("Invalid AI JSON:", result);

      return res.status(502).json({
        success: false,
        message:
          "AI returned invalid plant information. Please try again.",
      });
    }

    if (!plantData.plantName || !plantData.plantType) {
      return res.status(422).json({
        success: false,
        message:
          "AI could not identify the plant properly. Please upload a clearer image.",
      });
    }

    if (!Array.isArray(plantData.careTips)) {
      plantData.careTips = [];
    }

    console.log("Plant analysis completed:", plantData.plantName);

    return res.status(200).json({
      success: true,
      isPlant: true,
      message: "Plant analyzed successfully",
      analysis: plantData,
    });
  } catch (error) {
    console.error("Plant AI Error:", error);

    const status = getErrorStatus(error);

    if (status === 429) {
      return res.status(429).json({
        success: false,
        code: "AI_RATE_LIMIT",
        message:
          "Gemini request limit reached. Please wait before trying again.",
      });
    }

    if ([408, 500, 502, 503, 504].includes(status)) {
      return res.status(503).json({
        success: false,
        code: "AI_TEMPORARILY_UNAVAILABLE",
        message:
          "Plant analysis is temporarily unavailable. Please try again shortly.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to analyze plant.",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};
