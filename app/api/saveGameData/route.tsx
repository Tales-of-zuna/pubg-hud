import ConnectMongoDB from "@/database/connection";
import TeamsData from "@/database/models/teamsDataModel";
import { NextRequest, NextResponse } from "next/server";

ConnectMongoDB();

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const teamData = await TeamsData.create(body);
    return NextResponse.json(teamData);
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
};

export const GET = async (req: NextRequest) => {
  try {
    const teamData = await TeamsData.find();
    return NextResponse.json(teamData);
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
};
