import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const res = await fetch("http://localhost:10086/gettotalplayerlist");
    const data = await res.json();
    return NextResponse.json(data.playerInfoList);
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
};
