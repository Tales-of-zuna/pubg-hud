import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const res = await fetch("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
};
