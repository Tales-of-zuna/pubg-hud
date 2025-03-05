import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const res = await fetch("http://localhost:10086/getobservingplayer");
    const data = await res.json();
    return NextResponse.json(data.observingPlayer[0]);
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
};
