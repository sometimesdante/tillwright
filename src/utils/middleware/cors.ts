import { NextRequest, NextResponse } from "next/server";

export function cors(request: NextRequest, response: NextResponse) {
  const origin = request.headers.get("origin");

  // Allow only specific origins
  if (origin === "http://localhost:3000") {
    response.headers.set("Access-Control-Allow-Origin", origin);
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );
  }

  return response;
}
