import { NextResponse } from "next/server";
import { baseEnvironmentSchema } from "@schema/environment.schema";
export async function GET() {
  // const response = await fetch(
  //   process.env.DEVELOPMENT_API_V1 + "/api/v1/users"
  // );
  // const data = await response.json();
  return NextResponse.json("Hello World!");
}
