import { NextRequest, NextResponse } from "next/server";
import { storeFileData } from "@/lib/storage";

export async function POST(request: NextRequest) {
  try {
    const { fileId, fileData } = await request.json();

    if (!fileId || !fileData) {
      return NextResponse.json(
        { message: "Missing fileId or fileData", error: "MISSING_DATA" },
        { status: 400 }
      );
    }

    console.log(`[Sync] Syncing file data for ID: ${fileId}`);
    storeFileData(fileId, fileData);

    return NextResponse.json({
      message: "File data synced successfully",
      fileId,
    });
  } catch (error) {
    console.error("Sync error:", error);
    return NextResponse.json(
      {
        message: "Failed to sync file data",
        error: "SYNC_ERROR",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
