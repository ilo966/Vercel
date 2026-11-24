import { handleUpload } from "@vercel/blob/client";

export default async function handler(request, response) {
  if (request.method !== "POST") {
    return response.status(405).json({ error: "Method not allowed" });
  }

  try {
    const jsonResponse = await handleUpload({
      body: request.body,
      request,
      onBeforeGenerateToken: async (pathname) => ({
        allowedContentTypes: ["*/*"],
        maximumSizeInBytes: 100 * 1024 * 1024,
        addRandomSuffix: true
      }),
      onUploadCompleted: async () => {}
    });

    return response.status(200).json(jsonResponse);
  } catch (error) {
    console.error("Nexus upload token error:", error);
    return response.status(400).json({ error: "Could not authorize upload." });
  }
}