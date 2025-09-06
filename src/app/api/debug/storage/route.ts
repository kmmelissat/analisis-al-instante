import { NextResponse } from "next/server";
import { serverFileStorage } from "@/lib/storage";

export async function GET() {
  const fileIds = serverFileStorage.keys();
  const storageInfo = {
    totalFiles: fileIds.length,
    fileIds: fileIds,
    timestamp: new Date().toISOString(),
  };

  console.log(`[Debug] Storage info:`, storageInfo);

  return NextResponse.json(storageInfo);
}
