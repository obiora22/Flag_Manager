import { NextRequest, NextResponse } from "next/server";
export async function GET(
  request: NextRequest,
  context: RouteContext<"/api/auth/users/[email]">
) {
  const { email } = await context.params;

  const response = await fetch(
    process.env.DEVELOPMENT_API_URL + `/users/email/${email}`
  );

  if (!response.ok) {
    return NextResponse.json({
      error: `External API error: ${response.status}`,
      status: response.status,
    });
  }

  let data;

  try {
    data = await response.json();
  } catch (err) {
    console.error("JSON parsing error: ", err);
    return NextResponse.json({
      error: "Failed to parse response as JSON",
      status: 500,
    });
  }

  return NextResponse.json({
    data,
    status: 200,
  });
}
