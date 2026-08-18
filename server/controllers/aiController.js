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

exports.analyzePlant = async (req, res) => {
  try {
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

    console.log("🌐 Cloudinary Image URL:", imageUrl);

    const imageResponse = await fetch(imageUrl);

    if (!imageResponse.ok) {
      throw new Error(
        `Unable to download image from Cloudinary: ${imageResponse.status}`
      );
    }

    const imageBuffer = Buffer.from(
      await imageResponse.arrayBuffer()
    );

    const base64Image = imageBuffer.toString("base64");

    const mimeType =
      req.file.mimetype || "image/jpeg";

    const prompt = `
You are an expert botanist and plant-care assistant.

Analyze the uploaded plant image carefully.

Identify the plant as accurately as possible.

Return ONLY a single valid JSON object.

The JSON MUST have exactly these fields:

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

1. Identify the plant from visible characteristics.
2. Give the most likely common plant name.
3. Give the scientific name if reasonably identifiable.
4. If identification is uncertain, write "Identification uncertain".
5. Do not invent a disease.
6. If there are no obvious disease symptoms, write "No obvious disease detected".
7. Provide practical plant-care information.
8. waterFrequency should explain how often the plant generally needs water.
9. sunlight should explain the required sunlight.
10. temperature should provide a suitable temperature range.
11. humidity should describe suitable humidity.
12. fertilizer should provide a general fertilizer recommendation.
13. careTips must contain 3 to 5 useful care tips.
14. Do not use Markdown.
15. Do not include explanations outside the JSON object.
16. Make sure the JSON object is completely closed with }.
17. Use double quotes for all JSON keys and string values.
18. Do not add trailing commas.
`;

    const models = [
      "gemini-3.6-flash",
      "gemini-3.5-flash",
    ];

    let response = null;
    let lastError = null;

    for (const model of models) {
      try {
        console.log(
          `🤖 Trying Gemini model: ${model}`
        );

        response = await ai.models.generateContent({
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

        console.log(
          `✅ Gemini model worked: ${model}`
        );

        break;
      } catch (error) {
        lastError = error;

        console.error(
          `⚠️ ${model} failed:`,
          error.message
        );

        if (
          error.status !== 503 &&
          error.status !== 429
        ) {
          throw error;
        }
      }
    }

    if (!response) {
      throw (
        lastError ||
        new Error("All Gemini models failed")
      );
    }

    let result = response.text;

    if (!result) {
      throw new Error(
        "Gemini returned an empty response"
      );
    }

    result = cleanAIResponse(result);

    console.log("🤖 Cleaned Gemini Response:");
    console.log(result);

    let plantData;

    try {
      plantData = JSON.parse(result);
    } catch (parseError) {
      console.error(
        "❌ Invalid AI JSON:",
        result
      );

      return res.status(500).json({
        success: false,
        message:
          "AI returned invalid plant information. Please try scanning again.",
      });
    }

    if (
      !plantData.plantName ||
      !plantData.plantType
    ) {
      return res.status(500).json({
        success: false,
        message:
          "AI could not identify the plant properly. Please upload a clearer image.",
      });
    }

    if (!Array.isArray(plantData.careTips)) {
      plantData.careTips = [];
    }

    console.log(
      "🌱 Plant Name:",
      plantData.plantName
    );

    console.log(
      "🔬 Scientific Name:",
      plantData.scientificName
    );

    console.log(
      "❤️ Health:",
      plantData.healthStatus
    );

    console.log(
      "🦠 Disease:",
      plantData.disease
    );

    console.log(
      "💧 Water:",
      plantData.waterFrequency
    );

    console.log(
      "☀️ Sunlight:",
      plantData.sunlight
    );

    console.log(
      "🌡️ Temperature:",
      plantData.temperature
    );

    console.log(
      "💦 Humidity:",
      plantData.humidity
    );

    console.log(
      "🌾 Fertilizer:",
      plantData.fertilizer
    );

    console.log(
      "💡 Care Tips:",
      plantData.careTips
    );

    console.log(
      "✅ Plant analysis completed"
    );

    return res.status(200).json({
      success: true,
      message: "Plant analyzed successfully",
      analysis: plantData,
    });
  } catch (error) {
    console.error(
      "❌ Plant AI Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to analyze plant",
      error: error.message,
    });
  }
};