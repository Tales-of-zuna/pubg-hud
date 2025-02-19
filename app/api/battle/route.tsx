import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const battleId = req.nextUrl.searchParams.get("battleId");

  if (!battleId) {
    return NextResponse.json({ error: "Missing battleId" }, { status: 400 });
  }
  return NextResponse.json({ message: "Hello, World!" });
};
